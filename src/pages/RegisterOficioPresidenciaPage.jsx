import { useState, useEffect } from "react"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { Layout } from "../layout"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"
import { Calendar } from "../components/ui/calendar"
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CalendarIcon, CheckCircle2, FileImage, FileText, Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { oficiosPresidenciaService } from "@/services/oficiosPresidencia.service"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

const formSchema = z.object({
  numero: z.string().min(2, "El número de oficio es requerido"),
  elaboradoPor: z.array(z.string()).min(1, "Debe seleccionar al menos una oficina"),
  institucion: z.string().min(2, "La institución es requerida"),
  destinatario: z.string().min(2, "El destinatario es requerido"),
  asunto: z.string().min(2, "El asunto es requerido"),
  fechaElaboracion: z.date({
    required_error: "La fecha de elaboración es requerida",
  }),
  fechaEntrega: z.date({
    required_error: "La fecha de entrega es requerida",
  }),
  requiereRespuesta: z.string().min(1, "Debe indicar si requiere respuesta"),
  status: z.string().default("PENDIENTE"),
  documento_escaneado: z
    .array(z.any())
    .min(1, "Debe adjuntar el documento escaneado"),
})

export const RegisterOficioPresidenciaPage = () => {
  const navigate = useNavigate()
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [newOficioId, setNewOficioId] = useState(null)
  const [documentFiles, setDocumentFiles] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [offices, setOffices] = useState([])
  const [openOffice, setOpenOffice] = useState(false)
  const [loadingOffices, setLoadingOffices] = useState(true)
  const [officeError, setOfficeError] = useState(null)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numero: "",
      elaboradoPor: [],
      institucion: "",
      destinatario: "",
      asunto: "",
      requiereRespuesta: "",
      status: "PENDIENTE",
      documento_escaneado: [],
    },
  })

  useEffect(() => {
    const fetchOffices = async () => {
      try {
        setLoadingOffices(true)
        setOfficeError(null)
        const data = await oficiosPresidenciaService.getOffices()
        setOffices(data)
      } catch (error) {
        setOfficeError(error.message || "Error al cargar las oficinas")
        toast.error("Error al cargar las oficinas")
        console.error(error)
      } finally {
        setLoadingOffices(false)
      }
    }

    fetchOffices()
  }, [])

  const handleDocumentFiles = (e) => {
    const files = Array.from(e.target.files);
    setDocumentFiles(files);
    form.setValue('documento_escaneado', files);
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true)
      const formData = new FormData()

      // Append form fields
      Object.keys(data).forEach(key => {
        if (key === 'fechaElaboracion' || key === 'fechaEntrega') {
          formData.append(key, data[key].toISOString())
        } else if (key === 'elaboradoPor') {
          formData.append(key, JSON.stringify(data[key]))
        } else if (key !== 'documento_escaneado') {
          formData.append(key, data[key])
        }
      })

      // Append document files
      if (documentFiles.length > 0) {
        documentFiles.forEach((file) => {
          formData.append('documento_escaneado', file)
        })
      }

      const result = await oficiosPresidenciaService.createOficio(formData)
      setNewOficioId(result.id)
      setShowSuccessDialog(true)
      toast.success('Oficio registrado exitosamente')
      navigate('/oficios-presidencia')
    } catch (error) {
      toast.error(error.message || "Error al registrar el oficio")
      console.error('Error:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    form.reset({
      numero: "",
      elaboradoPor: [],
      institucion: "",
      destinatario: "",
      asunto: "",
      requiereRespuesta: "",
      status: "PENDIENTE",
      documento_escaneado: [],
    })
  }

  return (
    <Layout>
      <div className="container mx-auto py-4 md:py-6 px-4 md:px-6 flex justify-center">
        <Card className="shadow-lg w-full max-w-[1000px]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Registrar Nuevo Oficio de Presidencia
            </CardTitle>
          </CardHeader>
          <CardContent>
            {officeError && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {officeError}
                  <Button
                    variant="link"
                    className="pl-2 text-red-900 hover:text-red-700"
                    onClick={() => window.location.reload()}
                  >
                    Reintentar
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="numero"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="primary-text">
                          NRO. OFICIO <span className="text-red-500 text-xl">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Ej: OF-2024-001"
                          />
                        </FormControl>
                        <FormDescription>
                          Ingrese el número único del oficio
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="elaboradoPor"
                    render={() => (
                      <FormItem className="space-y-4 col-span-full">
                        <FormLabel className="text-sm sm:text-lg primary-text">
                          ELABORADO POR <span className="text-red-500 text-xl">*</span>
                        </FormLabel>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {offices.map((office) => (
                            <FormField
                              key={office.id}
                              control={form.control}
                              name="elaboradoPor"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={office.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(office.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, office.id])
                                            : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== office.id
                                              )
                                            )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm">
                                      {office.name}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormDescription>
                          Seleccione la(s) oficina(s) que elabora(n) el oficio
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="institucion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="primary-text">
                          INSTITUCIÓN <span className="text-red-500 text-xl">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Ej: PDVSA"
                          />
                        </FormControl>
                        <FormDescription>
                          Nombre de la institución relacionada
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="destinatario"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="primary-text">
                          DESTINATARIO <span className="text-red-500 text-xl">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Ej: María González"
                          />
                        </FormControl>
                        <FormDescription>
                          Nombre completo del destinatario del oficio
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="asunto"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="primary-text">
                          ASUNTO <span className="text-red-500 text-xl">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Ej: Solicitud de información"
                          />
                        </FormControl>
                        <FormDescription>
                          Breve descripción del asunto del oficio
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fechaElaboracion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="primary-text">
                          FECHA ELABORACIÓN <span className="text-red-500 text-xl">*</span>
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Seleccione la fecha de elaboración</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          Fecha en que se elaboró el oficio
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fechaEntrega"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="primary-text">
                          FECHA ENTREGA <span className="text-red-500 text-xl">*</span>
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Seleccione la fecha de entrega</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          Fecha programada para la entrega del oficio
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="requiereRespuesta"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="primary-text">
                          REQUIERE RESPUESTA <span className="text-red-500 text-xl">*</span>
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <div className="flex items-center space-x-3">
                              <RadioGroupItem value="true" id="r1" />
                              <Label htmlFor="r1">Sí</Label>
                            </div>
                            <div className="flex items-center space-x-3">
                              <RadioGroupItem value="false" id="r2" />
                              <Label htmlFor="r2">No</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormDescription>
                          Indique si el oficio requiere una respuesta
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="documento_escaneado"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="primary-text">
                          DOCUMENTO ESCANEADO <span className="text-red-500 text-xl">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="w-full flex flex-col gap-4">
                            <input
                              type="file"
                              multiple
                              accept="image/*,.pdf"
                              onChange={handleDocumentFiles}
                              className="hidden"
                              id="document-upload"
                            />
                            <label
                              htmlFor="document-upload"
                              className="flex items-center max-w-80 justify-center px-4 py-2 bg-blue-400 text-white rounded cursor-pointer hover:bg-blue-600"
                            >
                              <FileImage size={24} className="mr-2" />
                              <span>Adjuntar documento escaneado</span>
                            </label>
                            {documentFiles.length > 0 && (
                              <div className="mt-2">
                                <h4 className="text-sm font-medium">Archivos seleccionados:</h4>
                                <ul className="list-disc list-inside">
                                  {documentFiles.map((file, index) => (
                                    <li key={index} className="flex items-center gap-2 text-sm">
                                      {file.type === 'application/pdf' ?
                                        <FileText className="h-4 w-4" /> :
                                        <FileImage className="h-4 w-4" />
                                      }
                                      {file.name}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription>
                          Adjunte el documento escaneado del oficio.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4 flex justify-center">
                  <Button
                    type="submit"
                    className="w-full sm:w-[400px] h-[45px] bg-primary-green primary-text"
                    disabled={submitting || loadingOffices}
                  >
                    {submitting ? (
                      <div className="flex items-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Registrando...
                      </div>
                    ) : (
                      'Registrar Oficio'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-6 w-6" />
              ¡Oficio Registrado Exitosamente!
            </DialogTitle>
            <DialogDescription>
              El oficio <span className="font-semibold">{newOficioId}</span> ha sido creado correctamente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowSuccessDialog(false)
                resetForm()
              }}
            >
              Registrar Otro Oficio
            </Button>
            <Button
              type="button"
              className="bg-primary-green"
              onClick={() => {
                setShowSuccessDialog(false)
                navigate("/oficios-presidencia")
              }}
            >
              Ver Lista de Oficios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  )
} 