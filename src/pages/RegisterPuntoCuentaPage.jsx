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
import { Check, ChevronsUpDown, Loader2, AlertCircle } from "lucide-react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  numero: z.string().min(2, "El número de punto de cuenta es requerido"),
  tipo: z.string().refine(val => val === "CUENTA", "El tipo debe ser CUENTA"),
  fecha: z.date({
    required_error: "La fecha es requerida",
  }),
  presentante: z.string().min(2, "El presentante es requerido"),
  asunto: z.string().min(2, "El asunto es requerido"),
  decision: z.string().min(2, "La decisión es requerida"),
  observacion: z.string().min(2, "La observación es requerida"),
})

export const RegisterPuntoCuentaPage = () => {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [offices, setOffices] = useState([])
  const [openOffice, setOpenOffice] = useState(false)
  const [loadingOffices, setLoadingOffices] = useState(true)
  const [officeError, setOfficeError] = useState(null)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numero: "",
      tipo: "CUENTA",
      presentante: "",
      asunto: "",
      decision: "",
      observacion: "",
    },
  })

  useEffect(() => {
    const fetchOffices = async () => {
      try {
        setLoadingOffices(true)
        setOfficeError(null)
        const data = await puntosCuentaService.getOffices()
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

  const onSubmit = async (data) => {
    try {
      setSubmitting(true)
      await puntosCuentaService.createPunto({
        ...data,
        fecha: data.fecha.toISOString(),
      })
      toast.success('Punto de cuenta registrado exitosamente')
      navigate('/puntos-cuenta')
    } catch (error) {
      console.error('Error:', error)
      toast.error(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Layout>
      <div className="container mx-auto py-4 md:py-6 px-4 md:px-6 flex justify-center">
        <Card className="shadow-lg w-full max-w-[1000px]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
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
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="numero"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="primary-text">
                          NRO. PUNTO <span className="text-red-500 text-xl">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Ej: PC-2024-001"
                          />
                        </FormControl>
                        <FormDescription>
                          Número único del punto de cuenta
                        </FormDescription>
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
                        <FormControl>
                          <Input
                            {...field}
                            value="CUENTA"
                            disabled
                            placeholder="CUENTA"
                          />
                        </FormControl>
                        <FormDescription>
                          El tipo de punto es siempre CUENTA
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fecha"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="primary-text">
                          FECHA <span className="text-red-500 text-xl">*</span>
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
                                  <span>Seleccione la fecha</span>
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
                          Fecha del punto de cuenta
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="presentante"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="primary-text">
                          PRESENTANTE <span className="text-red-500 text-xl">*</span>
                        </FormLabel>
                        <Popover open={openOffice} onOpenChange={setOpenOffice}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openOffice}
                                className={cn(
                                  "w-full justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                                disabled={loadingOffices}
                              >
                                {loadingOffices ? (
                                  <div className="flex items-center">
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Cargando oficinas...
                                  </div>
                                ) : field.value ? (
                                  offices.find((office) => office.id === field.value)?.name ||
                                  "Oficina no encontrada"
                                ) : (
                                  "Seleccione la oficina presentante"
                                )}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput
                                placeholder={loadingOffices ? "Cargando..." : "Buscar oficina..."}
                                disabled={loadingOffices}
                              />
                              <CommandEmpty>
                                {loadingOffices ? (
                                  <div className="flex items-center justify-center p-4">
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Cargando...
                                  </div>
                                ) : (
                                  "No se encontró la oficina."
                                )}
                              </CommandEmpty>
                              <CommandGroup>
                                {offices.map((office) => (
                                  <CommandItem
                                    key={office.id}
                                    value={office.id}
                                    onSelect={() => {
                                      form.setValue("presentante", office.id)
                                      setOpenOffice(false)
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value === office.id
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {office.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          {loadingOffices
                            ? "Cargando lista de oficinas..."
                            : "Seleccione la oficina que presenta el punto de cuenta"
                          }
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
                            placeholder="Ej: Solicitud de recursos"
                          />
                        </FormControl>
                        <FormDescription>
                          Breve descripción del asunto a tratar
                        </FormDescription>
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
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Ej: Aprobado"
                          />
                        </FormControl>
                        <FormDescription>
                          Decisión tomada sobre el punto de cuenta
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="observacion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="primary-text">
                          OBSERVACIONES <span className="text-red-500 text-xl">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Ej: Pendiente de firma"
                          />
                        </FormControl>
                        <FormDescription>
                          Observaciones adicionales sobre el punto de cuenta
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
                      'Registrar Punto de Cuenta'
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