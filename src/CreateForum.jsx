import { useState } from "react"

import { format } from "date-fns"
import { useForm } from "react-hook-form"

import { Layout } from "./layout/layout"

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
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "./components/ui/popover"
import { Calendar } from "./components/ui/calendar"

import { CalendarIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select"
import { Badge } from "./components/ui/badge"

const receptionOptions = [
  { id: 'MESA_DE_PARTES', label: 'Mesa de Partes' },
  { id: 'CORREO', label: 'Correo Electrónico' },
  { id: 'PRE_VP', label: 'PRE - VP' },
]

const gerencyOptions = [
  { id: 'ADMIN', label: 'Administración' },
  { id: 'ATENCIONCIUD', label: 'Atención Ciudadana' },
  { id: 'AUDITORIA', label: 'Auditoría Interna' },
  { id: 'CARBOSUROESTE', label: 'Carbosuroeste' },
  { id: 'CATASTRO', label: 'Catastro Minero' },
  { id: 'CHOCO', label: 'Planta de Chocó' },
  { id: 'COMERCIALIZACION', label: 'Comercialización' },
  { id: 'COMUNICACIONES', label: 'Comunicaciones' },
  { id: 'CONSULTORIA', label: 'Consultoría Jurídica' },
  { id: 'CUMPLIMIENTO', label: 'Oficial de Cumplimiento' },
  { id: 'ECOSOCIALISMO', label: 'Ecosocialismo' },
  { id: 'FOSFASUROESTE', label: 'Fosfasuroeste' },
  { id: 'GUIAS', label: 'Guías' },
  { id: 'INSUMOS', label: 'Coordinación de Insumos' },
  { id: 'NIQUEL', label: 'Planta Lomas de Niquel' },
  { id: 'PLANIFICACION', label: 'Planificación' },
  { id: 'PRODUCCION', label: 'Producción' },
  { id: 'PROYECTO', label: 'Proyecto Minero' },
  { id: 'REGIONES', label: 'Gerencia de Regiones' },
  { id: 'RRHH', label: 'Gestión Humana' },
  { id: 'SEGUIMIENTO', label: 'Seguimiento y Control' },
  { id: 'SEGURIDAD', label: 'Seguridad' },
  { id: 'TECNOLOGIA', label: 'Tecnología' },
]

const instructionOptions = [
  { id: 'PROCESAR', label: 'Procesar' },
  { id: 'CHEQUEAR', label: 'Chequear e Informar' },
  { id: 'COORDINAR', label: 'Coordinar e Informar' },
  { id: 'VERIFICAR', label: 'Verificar e Informar' },
  { id: 'EVALUAR', label: 'Evaluar y Recomendar' },
  { id: 'PREPARAR', label: 'Preparar y presentar respuesta' },
  { id: 'RESOLVER', label: 'Resolver e Informar' },
  {
    id: 'SEGUIR', label: 'Seguimiento'
  },
  { id: 'COORDINAREU', label: 'Coordinar Reunión' },
  { id: 'APOYAR', label: 'Apoyar' },
  { id: 'DIFUNDIR', label: 'Difundir' },
  { id: 'PRESENTE', label: 'Tener presente' },
  { id: 'ESPERAR', label: 'Esperar' },
  { id: 'ARCHIVAR', label: 'Archivar' },
  { id: 'Other', label: 'OTRA' },
]


const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'))

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})

export const CreateForum = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    selectedOptions: [],
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (optionId) => {
    setFormData((prev) => {
      const newSelectedOptions = prev.selectedOptions.includes(optionId)
        ? prev.selectedOptions.filter((id) => id !== optionId)
        : [...prev.selectedOptions, optionId]
      return { ...prev, selectedOptions: newSelectedOptions }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Handle form submission logic here
  }


  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      asunto: ""
    },
  })

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, date }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <Layout>

      <div className="container mx-auto py-10 divide-y flex justify-center">
        <Card className="w-full max-w-4xl bg-white shadow-lg">
          <CardHeader className="bg-[#667f2a] rounded-t-lg">
            <CardTitle className="text-sms text-left text-white primary-text">RECEPCIÓN DE OFICIOS</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form} >
              <form onSubmit={handleSubmit} className="space-y-6 mt-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      className=""
                      name="asunto"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="primary-text">FECHA DE RECEPCIÓN</FormLabel>
                          <FormControl>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={`w-full justify-start text-left font-normal bg-gray-200 ${!formData.date && "text-muted-foreground"}`}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {formData.date ? format(formData.date, "dd/MM/yy") : "Elige una fecha"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={formData.date}
                                  onSelect={handleDateChange}
                                  initialFocus
                                  {...field}
                                />
                              </PopoverContent>
                            </Popover>
                          </FormControl>
                          <FormDescription>
                            Seleccione la fecha en que se recibió el oficio.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      className=""
                      name="asunto"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="primary-text">HORA DE RECEPCIÓN</FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-1">
                                <Select name="hour" onValueChange={(value) => handleSelectChange("hour", value)}>
                                  <SelectTrigger className="w-auto bg-gray-200" icon="hidden">
                                    <SelectValue placeholder="Hora" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {hours.map((hour) => (
                                      <SelectItem key={hour} value={hour}>
                                        {hour}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <div>
                                  :
                                </div>
                                <Select name="minute" onValueChange={(value) => handleSelectChange("minute", value)}>
                                  <SelectTrigger className="w-auto bg-gray-200" icon="hidden">
                                    <SelectValue placeholder="Minuto" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {minutes.map((minute) => (
                                      <SelectItem key={minute} value={minute}>
                                        {minute}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <Badge className="bg-gray-500">AM</Badge>
                              </div>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Seleccione la hora en la que se recibió el oficio.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-1"></div> {/* Empty space for 2 columns */}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      className=""
                      name="asunto"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="primary-text">NÚMERO DE OFICIO</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Número de oficio"
                              className="bg-gray-200"
                              required
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Indique el número de oficio.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <FormField
                      control={form.control}
                      className=""
                      name="asunto"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="primary-text">ASUNTO DE OFICIO</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Asunto de oficio"
                              className="bg-gray-200"
                              required
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Escriba el asunto notificado en el oficio recibido.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-4 col-span-full">
                    <Label className="primary-text">RECIBIDO A TRAVÉS DE</Label>
                    <div className="flex flex-col gap-4">
                      {receptionOptions.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={option.id}
                            checked={formData.selectedOptions.includes(option.id)}
                            onCheckedChange={() => handleCheckboxChange(option.id)}
                          />
                          <Label htmlFor={option.id} className="text-xs">{option.label.toUpperCase()}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4 col-span-full">
                    <Label className="text-lg primary-text">GERENCIA(S) RESPONSABLE(S)</Label>
                    <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {gerencyOptions.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={option.id}
                            checked={formData.selectedOptions.includes(option.id)}
                            onCheckedChange={() => handleCheckboxChange(option.id)}
                          />
                          <Label htmlFor={option.id} className="text-xs">{option.label.toUpperCase()}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4 col-span-full">
                    <Label className="text-lg primary-text">INSTRUCCIÓN PRE - VP</Label>
                    <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {instructionOptions.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={option.id}
                            checked={formData.selectedOptions.includes(option.id)}
                            onCheckedChange={() => handleCheckboxChange(option.id)}
                          />
                          <Label htmlFor={option.id} className="text-xs">{option.label.toUpperCase()}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <Button type="submit" className="w-full">Submit</Button>

              </form>
            </Form>
          </CardContent>
        </Card>
      </div>


      {/* <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="p-2 m-2 max-w-[600px] grid grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form > */}
    </Layout >
  )
}
