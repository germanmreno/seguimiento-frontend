import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Layout } from "../layout"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"
import { puntosCuentaService } from "@/services/puntosCuenta.service"
import { Check, ChevronsUpDown, Loader2, AlertCircle, FileImage, FileText } from "lucide-react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
  numero: z.string().min(2, "El número de punto de cuenta es requerido"),
  tipo: z.string().refine(val => val === "CUENTA", "El tipo debe ser CUENTA"),
  fecha: z.date({
    required_error: "La fecha es requerida",
  }),
  presentante: z.array(z.string()).min(1, "Debe seleccionar al menos una oficina"),
  asunto: z.string().min(2, "El asunto es requerido"),
  decision: z.enum(["PENDIENTE", "APROBADO", "RECHAZADO"]),
  observacion: z.string().min(2, "La observación es requerida"),
  documento_escaneado: z.any().optional(),
})

export const RegisterPuntoCuentaPage = () => {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [offices, setOffices] = useState([])
  const [loadingOffices, setLoadingOffices] = useState(true)
  const [officeError, setOfficeError] = useState(null)
  const [documentFiles, setDocumentFiles] = useState([])

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numero: "",
      tipo: "CUENTA",
      fecha: new Date(),
      presentante: [],
      asunto: "",
      decision: "PENDIENTE",
      observacion: "",
    },
  })

  const handleDocumentFiles = (event) => {
    const files = event.target.files
    if (files.length > 0) {
      setDocumentFiles(Array.from(files))
    }
  }

  useEffect(() => {
    const fetchOffices = async () => {
      try {
        setLoadingOffices(true)
        const data = await puntosCuentaService.getOffices()
        setOffices(data)
        setOfficeError(null)
      } catch (error) {
        console.error('Error:', error)
        setOfficeError(error.message)
        toast.error('Error al cargar las oficinas')
      } finally {
        setLoadingOffices(false)
      }
    }

    fetchOffices()
  }, [])

  const onSubmit = async (values) => {
    try {
      console.log('Starting form submission with values:', values);
      setSubmitting(true);

      if (!documentFiles.length) {
        toast.error('Documento requerido');
        return;
      }

      const formData = new FormData();

      // Log each value before adding to FormData
      console.log('Numero value:', values.numero);
      console.log('Tipo value:', values.tipo);
      console.log('Fecha value:', values.fecha);
      console.log('Presentante value:', values.presentante);

      formData.append('numero', values.numero);
      formData.append('tipo', values.tipo);
      formData.append('fecha', format(values.fecha, 'yyyy-MM-dd'));
      formData.append('presentante', JSON.stringify(values.presentante));
      formData.append('asunto', values.asunto);
      formData.append('decision', values.decision);
      formData.append('observacion', values.observacion);
      formData.append('documento_escaneado', documentFiles[0]);

      // Log FormData contents
      console.log('=== FormData Contents ===');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value instanceof File ? `File: ${value.name}` : value);
      }
      console.log('========================');

      const response = await puntosCuentaService.createPunto(formData);
      console.log('Response:', response);

      toast.success('Punto de cuenta registrado exitosamente');
      navigate('/puntos-cuenta');
    } catch (error) {
      console.error('Error in form submission:', error);
      toast.error(error.message || 'Error al registrar el punto de cuenta');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-4 md:py-6 px-4 md:px-6 flex justify-center">
        <Card className="shadow-lg w-full max-w-[1000px]">
          <CardHeader className="bg-primary-blue mb-4 text-white p-4 md:p-6">
            <CardTitle className="text-xl md:text-2xl font-bold">
              Registrar Nuevo Punto de Cuenta
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
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 mt-3"
                encType="multipart/form-data"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="numero"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="primary-text">
                          NÚMERO <span className="text-red-500 text-xl">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Número de punto de cuenta"
                            className="bg-gray-200"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tipo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="primary-text">
                          TIPO <span className="text-red-500 text-xl">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled
                        >
                          <FormControl>
                            <SelectTrigger className="bg-gray-300">
                              <SelectValue placeholder="Seleccione el tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="CUENTA">CUENTA</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fecha"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="primary-text">
                          FECHA <span className="text-red-500 text-xl">*</span>
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal bg-gray-200",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Seleccione una fecha</span>
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-full bg-gray-50 p-4 rounded-lg border">
                  <FormField
                    control={form.control}
                    name="presentante"
                    render={() => (
                      <FormItem>
                        <FormLabel className="text-lg primary-text mb-4">
                          PRESENTANTE <span className="text-red-500 text-xl">*</span>
                        </FormLabel>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {offices.map((office) => (
                            <FormField
                              key={office.id}
                              control={form.control}
                              name="presentante"
                              render={({ field }) => (
                                <FormItem
                                  key={office.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(office.id)}
                                      onCheckedChange={(checked) => {
                                        const updatedValue = checked
                                          ? [...field.value, office.id]
                                          : field.value?.filter((value) => value !== office.id);
                                        field.onChange(updatedValue);
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">
                                    {office.name}
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        <FormDescription>
                          Seleccione la(s) oficina(s) que presenta(n) el punto de cuenta
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            placeholder="Asunto del punto de cuenta"
                            className="bg-gray-200"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="decision"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="primary-text">
                          DECISIÓN <span className="text-red-500 text-xl">*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-gray-200">
                              <SelectValue placeholder="Seleccione la decisión" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="PENDIENTE">PENDIENTE</SelectItem>
                            <SelectItem value="APROBADO">APROBADO</SelectItem>
                            <SelectItem value="RECHAZADO">RECHAZADO</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="documento_escaneado"
                  render={({ field }) => (
                    <FormItem className="col-span-full bg-gray-50 p-4 rounded-lg border">
                      <FormLabel className="text-lg primary-text">
                        DOCUMENTO ESCANEADO <span className="text-red-500 text-xl">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="w-full flex flex-col gap-4">
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleDocumentFiles}
                            className="hidden"
                            id="document-upload"
                          />
                          <label
                            htmlFor="document-upload"
                            className="flex items-center max-w-80 justify-center px-4 py-2 bg-blue-400 text-white rounded cursor-pointer hover:bg-blue-600 transition-colors"
                          >
                            <FileImage size={24} className="mr-2" />
                            <span>Adjuntar documento</span>
                          </label>
                          {documentFiles.length > 0 && (
                            <div className="mt-2">
                              <h4 className="text-sm font-medium">Archivo seleccionado:</h4>
                              <ul className="list-disc list-inside">
                                {documentFiles.map((file, index) => (
                                  <li key={index} className="flex items-center gap-2 text-sm">
                                    <FileText className="h-4 w-4" />
                                    {file.name}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>
                        Añada el documento escaneado del punto de cuenta (PDF o Word).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="observacion"
                  render={({ field }) => (
                    <FormItem className="col-span-full">
                      <FormLabel className="primary-text">
                        OBSERVACIÓN <span className="text-red-500 text-xl">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Observaciones del punto de cuenta"
                          className="bg-gray-200"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4 flex justify-center">
                  <Button
                    type="submit"
                    className="w-full sm:w-[400px] h-[45px] bg-primary-green primary-text"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      'Enviar'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
} 