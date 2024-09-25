import { useState } from "react"
import { format } from "date-fns"
import { useForm, Controller } from "react-hook-form"
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
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"
import { Calendar } from "../components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Badge } from "../components/ui/badge"
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group"
import { attachedOptions, gerencyOptions, instructionOptions, receptionOptions, responseOptions, urgencyOptions } from "../options/formOptions"
import ImageUpload from "@/components/custom/image-upload"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CalendarIcon } from "lucide-react"

const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'))

const formSchema = z.object({
  receptionDate: z.date(),
  receptionHour: z.string(),
  receptionMinute: z.string(),
  officeNumber: z.string().min(1, "Número de oficio es requerido"),
  officeSubject: z.string().min(1, "Asunto de oficio es requerido"),
  receptionMethod: z.string(),
  responsibleManagements: z.array(z.string()),
  instruction: z.string(),
  requiresResponse: z.string(),
  urgencyLevel: z.string(),
  attachments: z.array(z.string()),
})

export const RegisterMemoPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      receptionDate: new Date(),
      receptionHour: "",
      receptionMinute: "",
      officeNumber: "",
      officeSubject: "",
      receptionMethod: "",
      responsibleManagements: [],
      instruction: "",
      requiresResponse: "",
      urgencyLevel: "NORMAL",
      attachments: [],
    },
  })

  const onSubmit = (data) => {
    console.log(data)
    // Handle form submission logic here
  }

  return (
    <Layout>
      <div className="container mx-auto py-10 divide-y flex justify-center">
        <Card className="w-full max-w-4xl bg-white shadow-lg">
          <CardHeader className="bg-[#667f2a] rounded-t-lg">
            <CardTitle className="text-sms text-left text-white primary-text">REGISTRO DE NUEVO OFICIO</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2 mt-2">
                    <FormField
                      control={form.control}
                      name="receptionDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="primary-text">FECHA DE RECEPCIÓN</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={`w-full justify-start text-left font-normal bg-gray-200 ${!field.value && "text-muted-foreground"}`}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value ? format(field.value, "dd/MM/yy") : "Elige una fecha"}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            Seleccione la fecha en que se recibió el oficio.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <FormLabel className="primary-text">HORA DE RECEPCIÓN</FormLabel>
                    <div className="flex items-center space-x-1">
                      <Controller
                        name="receptionHour"
                        control={form.control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
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
                        )}
                      />
                      <div>:</div>
                      <Controller
                        name="receptionMinute"
                        control={form.control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
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
                        )}
                      />
                      <Badge className="bg-gray-500">AM</Badge>
                    </div>
                    <FormDescription>
                      Seleccione la hora en la que se recibió el oficio.
                    </FormDescription>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="officeNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="primary-text">NÚMERO DE OFICIO</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Número de oficio"
                            className="bg-gray-200"
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
                  <FormField
                    control={form.control}
                    name="officeSubject"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel className="primary-text">ASUNTO DE OFICIO</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Asunto de oficio"
                            className="bg-gray-200"
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

                <FormField
                  control={form.control}
                  name="receptionMethod"
                  render={({ field }) => (
                    <FormItem className="space-y-4 col-span-full">
                      <FormLabel className="primary-text">RECIBIDO A TRAVÉS DE</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex flex-col gap-4"
                        >
                          {receptionOptions.map((option) => (
                            <div className="flex items-center space-x-2" key={option.id}>
                              <RadioGroupItem value={option.id} id={option.id} />
                              <Label htmlFor={option.id}>{option.label.toUpperCase()}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormDescription>
                        Seleccione el medio a través del cuál recibió el oficio.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="responsibleManagements"
                  render={() => (
                    <FormItem className="space-y-4 col-span-full">
                      <FormLabel className="text-lg primary-text">GERENCIA(S) RESPONSABLE(S)</FormLabel>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {gerencyOptions.map((option) => (
                          <FormField
                            key={option.id}
                            control={form.control}
                            name="responsibleManagements"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={option.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(option.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, option.id])
                                          : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== option.id
                                            )
                                          )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-xs">
                                    {option.label.toUpperCase()}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormDescription>
                        Seleccione las gerencias relacionadas al asunto del oficio.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="instruction"
                  render={({ field }) => (
                    <FormItem className="space-y-4 col-span-full">
                      <FormLabel className="text-lg primary-text">INSTRUCCIÓN PRE - VP</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
                        >
                          {instructionOptions.map((option) => (
                            <div className="flex items-center space-x-2" key={option.id}>
                              <RadioGroupItem value={option.id} id={option.id} />
                              <Label htmlFor={option.id} className="text-xs">{option.label.toUpperCase()}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormDescription>
                        Seleccione la instrucción emanada desde Presidencia o Vicepresidencia.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="requiresResponse"
                  render={({ field }) => (
                    <FormItem className="space-y-4 col-span-full">
                      <FormLabel className="primary-text">¿REQUIERE RESPUESTA?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex justify-center gap-5"
                        >
                          {responseOptions.map((option) => (
                            <div className="flex items-center space-x-2" key={option.id}>
                              <RadioGroupItem value={option.id} id={option.id} />
                              <Label htmlFor={option.id} className="text-xl">{option.label.toUpperCase()}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormDescription>
                        Indique si el oficio requiere una respuesta por parte de la Corporación Venezolana de Minería, S.A.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="urgencyLevel"
                  render={({ field }) => (
                    <FormItem className="space-y-4 col-span-full">
                      <FormLabel className="primary-text">NIVEL DE URGENCIA</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex justify-center gap-5"
                        >
                          {urgencyOptions.map((option) => (
                            <div className="flex items-center m-auto space-x-2" key={option.id}>
                              <RadioGroupItem value={option.id} id={option.id} />
                              <Label htmlFor={option.id}>
                                <Badge variant={option.variant} className="text-sm">{option.label.toUpperCase()}</Badge>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormDescription>
                        Indique el nivel de urgencia con el que deberá ser atendido el contenido del oficio.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="attachments"
                  render={() => (
                    <FormItem className="space-y-4 col-span-full">
                      <FormLabel className="text-lg primary-text">ANEXO(S)</FormLabel>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {attachedOptions.map((option) => (
                          <FormField
                            key={option.id}
                            control={form.control}
                            name="attachments"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={option.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(option.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, option.id])
                                          : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== option.id
                                            )
                                          )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel htmlFor={option.id} className="text-xs">
                                    {option.label.toUpperCase()}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormDescription>
                        Indique si el oficio trajo consigo anexos añadidos o no.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4 col-span-full">
                  <Label className="text-lg primary-text">AÑADIR ANEXO</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="rounded-full shadow" variant="outline">
                          Adjuntar archivos
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle className="text-center">
                            Subir archivos
                          </DialogTitle>
                          <DialogDescription className="text-center">
                            Sólo suba los archivos necesarios.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <ImageUpload />
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                <div className="space-y-4 flex justify-center">
                  <Button type="submit" className="w-[400px] h-[45px] bg-primary-green primary-text text-lg">Enviar</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
