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
import { RadioGroup, RadioGroupItem } from "./components/ui/radio-group"
import { attachedOptions, gerencyOptions, instructionOptions, receptionOptions, responseOptions, urgencyOptions } from "./options/formOptions"

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
                    <RadioGroup defaultValue="">
                      <div className="flex flex-col gap-4">
                        {receptionOptions.map((option) => (
                          <div className="flex items-center space-x-2" key={option.id}>
                            <RadioGroupItem value={option.id} id={option.id} />
                            <Label htmlFor={option.id}>{option.label.toUpperCase()}</Label>
                          </div>
                        ))}

                      </div>
                    </RadioGroup>
                    <FormDescription>
                      Seleccione el medio a través del cuál recibió el oficio.
                    </FormDescription>
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
                    <FormDescription>
                      Seleccione las gerencias relacionadas al asunto del oficio.
                    </FormDescription>
                  </div>
                  <div className="space-y-4 col-span-full">
                    <Label className="text-lg primary-text">INSTRUCCIÓN PRE - VP</Label>
                    <RadioGroup defaultValue="">
                      <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {instructionOptions.map((option) => (
                          <div className="flex items-center space-x-2" key={option.id}>
                            <RadioGroupItem value={option.id} id={option.id} />
                            <Label htmlFor={option.id}>{option.label.toUpperCase()}</Label>
                          </div>

                        ))}
                      </div>
                    </RadioGroup>
                    <FormDescription>
                      Seleccione la instrucción emanada desde Presidencia o Vicepresidencia.
                    </FormDescription>
                  </div>
                  <div className="space-y-4 col-span-full">
                    <Label className="text- primary-text">¿REQUIERE RESPUESTA?</Label>
                    <RadioGroup defaultValue="">
                      <div className="flex justify-center gap-5">
                        {responseOptions.map((option) => (
                          <div className="flex items-center space-x-2" key={option.id}>
                            <RadioGroupItem value={option.id} id={option.id} />
                            <Label htmlFor={option.id} className="text-xl">{option.label.toUpperCase()}</Label>
                          </div>

                        ))}
                      </div>
                    </RadioGroup>
                    <FormDescription>
                      Indique si el oficio requiere una respuesta por parte de la Corporación Venezolana de Minería, S.A.
                    </FormDescription>
                  </div>
                  <div className="space-y-4 col-span-full">
                    <Label className="text- primary-text">NIVEL DE URGENCIA</Label>
                    <RadioGroup defaultValue="NORMAL">
                      <div className="flex justify-center gap-5">
                        {urgencyOptions.map((option) => (
                          <div className="flex items-center m-auto space-x-2" key={option.id}>
                            <RadioGroupItem value={option.id} id={option.id} />
                            <Label htmlFor={option.id}><Badge variant={option.variant} className="text-sm">{option.label.toUpperCase()}</Badge></Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                    <FormDescription>
                      Indique el nivel de urgencia con el que deberá ser atendido el contenido del oficio.
                    </FormDescription>
                  </div>
                </div>
                <div className="space-y-4 col-span-full">
                  <Label className="text-lg primary-text">ANEXO(S)</Label>
                  <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {attachedOptions.map((option) => (
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
                  <FormDescription>
                    Indique si el oficio trajo consigo anexos añadidos o no.
                  </FormDescription>
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
