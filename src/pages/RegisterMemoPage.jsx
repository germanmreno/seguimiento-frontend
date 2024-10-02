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
import axios from "axios"
import { useNavigate } from "react-router-dom"

const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'))

const formSchema = z.object({
  applicant: z.string().min(2, "El solicitante es requerido"),
  attachment: z.array(z.string()).min(1, "Debe indicar si posee o no anexos"),
  id: z.string().min(5, "El número de oficio es requerido"),
  instruction: z.string().min(1, "Es requerido saber si necesita respuesta"),
  name: z.string().min(2, "Asunto de oficio es requerido"),
  observation: z.string().min(1, "Asunto de oficio es requerido"),
  officeIds: z.array(z.string()).min(1, "Debe seleccionar al menos una oficina"),
  reception_date: z.date({
    errorMap: (issue, { defaultError }) => ({
      message: issue.code === "invalid_date" ? "No ha seleccionado una fecha" : defaultError,
    }),
  }),
  reception_method: z.string().min(1, "Método de recepción es requerido"),
  receptionHour: z.string().optional(),
  receptionMinute: z.string().optional(),
  response_require: z.string().min(1, "Es requerido saber si necesita respuesta"),
  status: z.string(),
  urgency: z.string().min(1, "Es requerido saber si necesita respuesta"),
})

export const RegisterMemoPage = () => {

  const navigate = useNavigate()

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      applicant: "",
      attachment: [],
      id: "",
      instruction: "",
      name: "",
      observation: "",
      officeIds: [],
      reception_method: "",
      receptionHour: "",
      receptionMinute: "",
      response_require: "",
      status: "PENDING",
      urgency: "NORMAL"
    },
  })

  const { watch } = form;

  const onSubmit = async (data) => {

    const formattedTime = formatTime(data.receptionHour, data.receptionMinute);
    // const formattedDate = format(data.reception_date, "dd/MM/yy")

    delete data.receptionMinute;
    delete data.receptionHour;

    data.reception_hour = formattedTime;
    // data.reception_date = formattedDate;

    console.log('Form submitted:', { ...data });

    try {
      const response = await axios.post('http://localhost:3000/memos', data);
      console.log('Memo created:', response.data);
      navigate("/memos")

    } catch (error) {
      console.error('Error creating memo:', error);
    }
    // Handle form submission logic here

  }

  const formatTime = (hour, minute) => {
    const hourInt = parseInt(hour, 10);
    const minuteInt = parseInt(minute, 10);
    const period = hourInt >= 12 ? 'PM' : 'AM';
    const formattedHour = hourInt % 12 === 0 ? 12 : hourInt % 12;
    const formattedMinute = minuteInt < 10 ? `0${minuteInt}` : minuteInt;
    return `${formattedHour}:${formattedMinute} ${period}`;
  };

  // Watch the hour value to determine AM or PM
  const selectedHour = watch('receptionHour');
  const period = selectedHour && parseInt(selectedHour, 10) >= 12 ? 'PM' : 'AM';

  return (

    <Layout>
      <div className="container mx-auto py-10 divide-y flex justify-center">
        <Card className="w-full max-w-4xl bg-white shadow-lg">
          <CardHeader className="bg-[#24387d] rounded-t-lg">
            <CardTitle className="text-sms text-left text-white primary-text">REGISTRO DE NUEVO OFICIO</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2 mt-2">
                    <FormField
                      control={form.control}
                      name="reception_date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="primary-text">FECHA DE RECEPCIÓN <span className="text-red-500 text-xl">*</span></FormLabel>
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
                  <div className="space-y-2 mt-2">
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
                      <Badge variant="outline" className="text-lg">
                        {period}
                      </Badge>
                    </div>
                    <FormDescription>
                      Seleccione la hora en la que se recibió el oficio.
                    </FormDescription>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="primary-text">NÚMERO DE OFICIO <span className="text-red-500 text-xl">*</span></FormLabel>
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
                    name="name"
                    render={({ field }) => (
                      <FormItem className="col-span-1">
                        <FormLabel className="primary-text">ASUNTO DE OFICIO <span className="text-red-500 text-xl">*</span></FormLabel>
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
                  <FormField
                    control={form.control}
                    name="applicant"
                    render={({ field }) => (
                      <FormItem className="col-span-1">
                        <FormLabel className="primary-text">SOLICITANTE <span className="text-red-500 text-xl">*</span></FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Solicitante del oficio"
                            className="bg-gray-200"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Indique quién solicita el contenido del oficio o quién es el órgano que lo envía.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="reception_method"
                  render={({ field }) => (
                    <FormItem className="space-y-4 col-span-full">
                      <FormLabel className="primary-text">RECIBIDO A TRAVÉS DE <span className="text-red-500 text-xl">*</span></FormLabel>
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
                  name="officeIds"
                  render={() => (
                    <FormItem className="space-y-4 col-span-full">
                      <FormLabel className="text-lg primary-text">OFICINA(S) O GERENCIA(S) RESPONSABLE(S) <span className="text-red-500 text-xl">*</span></FormLabel>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {gerencyOptions.map((option) => (
                          <FormField
                            key={option.id}
                            control={form.control}
                            name="officeIds"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={option.id}
                                  className="flex flex-row items-start text-balance space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(option.id)}
                                      className="rounded-full"
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
                      <FormLabel className="text-lg primary-text">INSTRUCCIÓN PRE - VP <span className="text-red-500 text-xl">*</span></FormLabel>
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
                  name="response_require"
                  render={({ field }) => (
                    <FormItem className="space-y-4 col-span-full">
                      <FormLabel className="primary-text">¿REQUIERE RESPUESTA? <span className="text-red-500 text-xl">*</span></FormLabel>
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
                  name="urgency"
                  render={({ field }) => (
                    <FormItem className="space-y-4 col-span-full">
                      <FormLabel className="primary-text">NIVEL DE URGENCIA <span className="text-red-500 text-xl">*</span></FormLabel>
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
                  name="attachment"
                  render={() => (
                    <FormItem className="space-y-4 col-span-full">
                      <FormLabel className="text-lg primary-text">ANEXO(S) <span className="text-red-500 text-xl">*</span></FormLabel>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {attachedOptions.map((option) => (
                          <FormField
                            key={option.id}
                            control={form.control}
                            name="attachment"
                            render={({ field }) => {
                              const isNoPosee = option.id.toUpperCase() === "NO";
                              const isNoPoseeSelected = field.value?.includes("NO");
                              return (
                                <FormItem
                                  key={option.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(option.id)}
                                      disabled={!isNoPosee && isNoPoseeSelected}
                                      onCheckedChange={(checked) => {
                                        if (isNoPosee) {
                                          // If "NO POSEE" is checked, clear all other values
                                          return checked
                                            ? field.onChange([option.id])
                                            : field.onChange([]);
                                        } else {
                                          // If any other option is checked, remove "NO POSEE" if it exists
                                          const newValue = checked
                                            ? [...field.value.filter((id) => id !== "NO"), option.id]
                                            : field.value.filter((value) => value !== option.id);
                                          return field.onChange(newValue);
                                        }
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="observation"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel className="primary-text">OBSERVACIÓN <span className="text-red-500 text-xl">*</span></FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Observaciones de oficio"
                            className="bg-gray-200"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Añada las observaciones acerca del estatus o procedimiento del oficio.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
