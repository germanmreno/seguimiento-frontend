import { memo, useState, useEffect } from "react"
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
import { attachedOptions, gerencyOptions, receptionOptions, responseOptions, urgencyOptions } from "../options/formOptions"

import { CalendarIcon, FileImage, FileText } from "lucide-react"
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
import { CheckCircle2 } from "lucide-react"
import { memosService } from "@/services/memos.service"
import { generateMemoExcel } from '@/utils/excelGenerator'

const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'))

const formSchema = z.object({
  applicant: z.string().min(2, "El solicitante es requerido"),
  attachment_type: z.array(z.string()).min(1, "Debe indicar si posee o no anexos"),
  reception_images: z
    .array(z.any())
    .min(1, "Debe adjuntar al menos una imagen de recepción"),
  attachment_files: z.array(z.any()).optional(),
  id: z.string().min(5, "El número de oficio es requerido"),
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
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [newMemoId, setNewMemoId] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [receptionFiles, setReceptionFiles] = useState([]);
  const [attachmentFiles, setAttachmentFiles] = useState([]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      applicant: "",
      attachment_type: [],
      reception_images: [],
      attachment_files: [],
      id: "",
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

  const { watch, control } = form;

  // Reception Images Handler
  const handleReceptionFiles = (e) => {
    const files = Array.from(e.target.files);
    setReceptionFiles(files);
    form.setValue('reception_images', files);
  };

  // Attachment Files Handler
  const handleAttachmentFiles = (e) => {
    const files = Array.from(e.target.files);
    setAttachmentFiles(files);
    form.setValue('attachment_files', files);
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);

      const formData = new FormData();

      // Format the reception hour
      const formattedHour = formatTime(data.receptionHour, data.receptionMinute);

      // Append basic form fields individually
      formData.append('id', data.id);
      formData.append('name', data.name);
      formData.append('applicant', data.applicant);
      formData.append('reception_method', data.reception_method);
      formData.append('reception_date', data.reception_date.toISOString());
      formData.append('reception_hour', formattedHour);
      formData.append('response_require', data.response_require);
      formData.append('observation', data.observation);
      formData.append('status', data.status);
      formData.append('urgency', data.urgency);

      // Handle arrays
      formData.append('attachment_type', JSON.stringify(data.attachment_type));
      formData.append('officeIds', JSON.stringify(data.officeIds));

      // Append reception images
      if (receptionFiles.length > 0) {
        receptionFiles.forEach((file) => {
          formData.append('reception_images', file);
        });
      }

      // Append attachment files if they exist
      if (attachmentFiles.length > 0) {
        attachmentFiles.forEach((file) => {
          formData.append('attachment_files', file);
        });
      }

      // Use the memoService instead of direct axios call
      const response = await memosService.createMemo(formData);

      setNewMemoId(response.id);
      setShowSuccessDialog(true);
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Error al registrar el memo');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFiles(Array.from(event.target.files));
  };

  const formatTime = (hour, minute) => {
    return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
  };

  // Watch the hour value to determine AM or PM
  const selectedHour = watch('receptionHour');
  const attachments = watch('attachment');
  const period = selectedHour && parseInt(selectedHour, 10) >= 12 ? 'PM' : 'AM';

  useEffect(() => {
    if (form.watch('attachment_type').length > 0 &&
      form.watch('attachment_type').includes('NO')) {
      setAttachmentFiles([]);
    }
  }, [form.watch('attachment_type')]);

  // Add this function to handle form reset
  const resetForm = () => {
    form.reset({
      applicant: "",
      attachment_type: [],
      reception_images: [],
      attachment_files: [],
      id: "",
      name: "",
      observation: "",
      officeIds: [],
      reception_method: "",
      receptionHour: "",
      receptionMinute: "",
      response_require: "",
      status: "PENDING",
      urgency: "NORMAL"
    });
    setReceptionFiles([]);
    setAttachmentFiles([]);
    setSelectedFiles([]);
  };

  return (

    <Layout>
      <div className="container mx-auto py-4 md:py-6 px-4 md:px-6 flex justify-center">
        <Card className="shadow-lg w-full max-w-[1000px]">
          <CardHeader className="bg-primary-blue mb-4 text-white p-4 md:p-6">
            <CardTitle className="text-xl md:text-2xl font-bold">Registrar Nuevo Oficio</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                    <FormLabel className="primary-text text-sm sm:text-base">HORA DE RECEPCIÓN</FormLabel>
                    <div className="flex items-center space-x-1 overflow-x-auto">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                      <FormLabel className="primary-text text-sm sm:text-base">
                        RECIBIDO A TRAVÉS DE <span className="text-red-500 text-xl">*</span>
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex flex-col sm:flex-row flex-wrap gap-4"
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
                      <FormLabel className="text-sm sm:text-lg primary-text">
                        OFICINA(S) O GERENCIA(S) RESPONSABLE(S) <span className="text-red-500 text-xl">*</span>
                      </FormLabel>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
                          className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-5"
                        >
                          {urgencyOptions.map((option) => (
                            <div className="flex items-center m-auto space-x-2" key={option.id}>
                              <RadioGroupItem value={option.id} id={option.id} />
                              <Label htmlFor={option.id}>
                                <Badge
                                  variant={option.variant}
                                  className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-1"
                                >
                                  {option.label.toUpperCase()}
                                </Badge>
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

                <div className="space-y-4">
                  <FormField


                    control={form.control}
                    name="reception_images"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="primary-text text-sm sm:text-base">
                          IMÁGENES DE RECEPCIÓN <span className="text-red-500 text-xl">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="w-full flex flex-col gap-4">
                            <input
                              type="file"
                              multiple
                              accept="image/*,.pdf"
                              onChange={handleReceptionFiles}
                              className="hidden"
                              id="reception-upload"
                            />
                            <label
                              htmlFor="reception-upload"
                              className="flex items-center max-w-80 justify-center px-4 py-2 bg-blue-400 text-white rounded cursor-pointer hover:bg-blue-600"
                            >
                              <FileImage size={24} className="mr-2" />
                              <span>Adjuntar comprobante de recepción</span>
                            </label>
                            {receptionFiles.length > 0 && (
                              <div className="mt-2">
                                <h4 className="text-sm font-medium">Archivos seleccionados:</h4>
                                <ul className="list-disc list-inside">
                                  {receptionFiles.map((file, index) => (
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
                          Añada el archivo comprobante de la recepción del oficio.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="attachment_type"
                  render={({ field }) => (
                    <FormItem className="space-y-4 col-span-full">
                      <FormLabel className="text-lg primary-text">
                        ANEXO(S) <span className="text-red-500 text-xl">*</span>
                      </FormLabel>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {attachedOptions.map((option) => (
                          <FormField
                            key={option.id}
                            control={form.control}
                            name="attachment_type"
                            render={({ field }) => (
                              <FormItem
                                key={option.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(option.id)}
                                    onCheckedChange={(checked) => {
                                      const updatedValue = checked
                                        ? [...field.value, option.id]
                                        : field.value?.filter((value) => value !== option.id);
                                      field.onChange(updatedValue);
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm">{option.label}</FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch('attachment_type').length > 0 &&
                  !form.watch('attachment_type').includes('NO') && (
                    <FormField
                      control={form.control}
                      name="attachment_files"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg primary-text">
                            ARCHIVOS DE ANEXOS
                          </FormLabel>
                          <FormControl>
                            <div className="w-full flex flex-col gap-4">
                              <input
                                type="file"
                                multiple
                                onChange={handleAttachmentFiles}
                                className="hidden"
                                id="attachment-upload"
                              />
                              <label
                                htmlFor="attachment-upload"
                                className="flex items-center max-w-80 justify-center px-4 py-2 bg-blue-400 text-white rounded cursor-pointer hover:bg-blue-600"
                              >
                                <FileImage size={24} className="mr-2" />
                                <span>Adjuntar anexos</span>
                              </label>
                              {attachmentFiles.length > 0 && (
                                <div className="mt-2">
                                  <h4 className="text-sm font-medium">Anexos seleccionados:</h4>
                                  <ul className="list-disc list-inside">
                                    {attachmentFiles.map((file, index) => (
                                      <li key={index} className="text-sm">{file.name}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

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
                  <Button type="submit" className="w-full sm:w-[400px] h-[45px] bg-primary-green primary-text">
                    Enviar
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
              ¡Memo Registrado Exitosamente!
            </DialogTitle>
            <DialogDescription>
              El memo <span className="font-semibold">{newMemoId}</span> ha sido creado correctamente.
              <br />
              Se ha generado el archivo Excel con los datos del memo.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowSuccessDialog(false);
                resetForm();
              }}
            >
              Registrar Otro Memo
            </Button>
            <Button
              type="button"
              className="bg-primary-green"
              onClick={() => {
                setShowSuccessDialog(false);
                navigate("/memos");
              }}
            >
              Ver Lista de Memos
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  )
}
