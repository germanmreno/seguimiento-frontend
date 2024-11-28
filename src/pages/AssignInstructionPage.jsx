import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "../layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { instructionOptions } from "../options/formOptions";
import { FileText, Eye, Download, Clock, User, Mail, Calendar } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Checkbox } from "@/components/ui/checkbox"
import { memosService } from '@/services/memos.service';
import { useAuth } from "@/contexts/AuthContext";
import { gerencyOptions } from "@/options/formOptions";

const formSchema = z.object({
  instruction: z.array(z.string()).min(1, "Debe seleccionar una instrucción"),
  customInstruction: z.string().optional(),
  officeIds: z.array(z.string()).optional(),
})

export const AssignInstructionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [memo, setMemo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const canEditOffices = user.role === 'ADMIN' || user.office_id === '101';

  useEffect(() => {
    const fetchMemo = async () => {
      try {
        const data = await memosService.getMemo(id);
        setMemo(data);
        setLoading(false);
      } catch (error) {
        toast.error("Error al cargar el memo");
        console.error(error);
      }
    };

    fetchMemo();
  }, [id]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      instruction: [],
      customInstruction: "",
      officeIds: memo?.offices?.map(office => office.office_id) || [],
    },
  })

  const selectedInstruction = form.watch("instruction");
  const isOtherSelected = selectedInstruction.includes("OTHER");

  useEffect(() => {
    if (memo) {
      form.setValue('officeIds', memo.offices.map(office => office.office_id));
    }
  }, [memo]);

  const handleAssignInstruction = async (data) => {
    if (isSubmitting) return;

    const toastId = 'assignInstruction';

    try {
      setIsSubmitting(true);
      toast.loading('Asignando instrucción...', { id: toastId });

      const finalInstruction = isOtherSelected ? data.customInstruction : data.instruction[0];

      await memosService.assignInstruction(
        id,
        finalInstruction,
        data.officeIds,
        user
      );

      const displayInstruction = isOtherSelected
        ? data.customInstruction
        : instructionOptions.find(opt => opt.id === finalInstruction)?.label;

      toast.success(
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-600" />
            <span className="font-semibold text-base">Instrucción asignada exitosamente</span>
          </div>
          <div className="pl-7">
            <p className="text-sm text-gray-600">
              Memo: <span className="font-medium">{id}</span>
            </p>
            <p className="text-sm text-gray-600">
              Instrucción: <span className="font-medium">
                {isOtherSelected ? "OTRA - " : ""}{displayInstruction}
              </span>
            </p>
          </div>
        </div>,
        {
          duration: 4000,
          className: "bg-white",
          id: toastId,
        }
      );

      // Navigate after a short delay
      setTimeout(() => {
        navigate("/memos");
      }, 1500);
    } catch (error) {
      console.error('Error assigning instruction:', error);
      toast.error(
        <div className="flex flex-col gap-1">
          <span className="font-semibold">Error al asignar la instrucción</span>
          <span className="text-sm">Por favor, intente nuevamente</span>
        </div>,
        {
          duration: 4000,
          id: toastId,
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewFile = (filePath) => {
    window.open(`http://172.16.2.51:3005/${filePath}`, '_blank');
  };

  const formatReceptionMethod = (method) => {
    const methodMap = {
      MESA_DE_PARTES: "Mesa de Partes",
      EMAIL: "Correo Electrónico",
      COURIER: "Courier",
      PERSONAL: "Personal"
    };
    return methodMap[method] || method;
  };

  const formatResponseRequire = (response) => {
    const responseMap = {
      YES: "Sí",
      NO: "No"
    };
    return responseMap[response] || response;
  };

  const formatOfficeName = (name) => {
    const words = name.split('_');
    return words
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-6">
          <div className="flex items-center justify-center">
            Cargando...
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-4 sm:py-6 px-2 sm:px-4">
        <Card className="shadow-lg">
          <CardHeader className="bg-primary-blue text-white p-4 sm:p-6 md:p-8">
            <CardTitle className="text-lg sm:text-xl md:text-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span>Asignar Instrucción - Memo {memo?.id}</span>
              <Badge
                variant={memo?.urgency === 'URGENT' ? 'destructive' :
                  memo?.urgency === 'NORMAL' ? 'normal' :
                    'secondary'}
                className="text-sm sm:text-base px-3 sm:px-4 py-1 w-fit"
              >
                {memo?.urgency}
              </Badge>
            </CardTitle>
            <div className="flex flex-wrap gap-2 mt-4">
              {memo?.offices?.map((officeRel) => (
                <Badge
                  key={officeRel.office.id}
                  variant="secondary"
                  className="text-xs"
                >
                  {officeRel.office.name}
                </Badge>
              ))}
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-6 md:p-8">
            <div className="space-y-6 sm:space-y-8">
              {/* Basic Memo Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
                      <FileText className="h-4 sm:h-5 w-4 sm:w-5 text-primary-blue" />
                      Asunto
                    </h3>
                    <p className="text-base sm:text-lg">{memo?.name}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
                      <User className="h-5 w-5 text-primary-blue" />
                      Solicitante
                    </h3>
                    <p className="text-lg">{memo?.applicant}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
                      <Mail className="h-5 w-5 text-primary-blue" />
                      Método de Recepción
                    </h3>
                    <p className="text-lg">{formatReceptionMethod(memo?.reception_method)}</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
                      <Calendar className="h-5 w-5 text-primary-blue" />
                      Fecha y Hora de Recepción
                    </h3>
                    <p className="text-lg flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      {format(new Date(memo?.reception_date), 'dd/MM/yyyy')} - {memo?.reception_hour}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Requiere Respuesta</h3>
                    <p className="text-lg">{formatResponseRequire(memo?.response_require)}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Offices */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Oficinas Asignadas:</h3>
                <div className="flex flex-wrap gap-2">
                  {memo?.offices.map((office) => (
                    <Badge
                      key={office.office_id}
                      variant="secondary"
                      className="text-xs"
                    >
                      {office.office.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Files Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                {/* Reception Images */}
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2 sm:mb-3">Imágenes de Recepción:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {memo?.reception_images.map((file, index) => (
                      <Dialog key={index}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full h-32 relative group overflow-hidden"
                          >
                            {file.isPdf ? (
                              <div className="flex flex-col items-center">
                                <FileText className="h-8 w-8 text-blue-500 mb-2" />
                                <span>Ver PDF {index + 1}</span>
                              </div>
                            ) : (
                              <>
                                <img
                                  src={`http://172.16.2.51:3005/${file.path}`}
                                  alt={`Recepción ${index + 1}`}
                                  className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Eye className="h-6 w-6 text-white" />
                                </div>
                              </>
                            )}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          {file.isPdf ? (
                            <iframe
                              src={`http://172.16.2.51:3005/${file.path}`}
                              className="w-full h-[80vh]"
                              title="PDF Viewer"
                            />
                          ) : (
                            <img
                              src={`http://172.16.2.51:3005/${file.path}`}
                              alt={`Recepción ${index + 1}`}
                              className="max-h-[80vh] w-auto mx-auto"
                            />
                          )}
                        </DialogContent>
                      </Dialog>
                    ))}
                  </div>
                </div>

                {/* Attachments */}
                {memo?.attachment_files && memo.attachment_files.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-3">Archivos Adjuntos:</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {memo.attachment_files.map((file, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          onClick={() => handleViewFile(file.path)}
                          className="flex items-center gap-2 h-12"
                        >
                          <Download className="h-5 w-5 text-primary-blue" />
                          <span className="truncate">{file.filename}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Observation */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Observación:</h3>
                <p className="text-lg bg-gray-50 p-4 rounded-lg">{memo?.observation || "Sin observaciones"}</p>
              </div>

              <Separator />

              {/* Instruction Selection */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAssignInstruction)} className="space-y-4 sm:space-y-6">
                  <FormField
                    control={form.control}
                    name="instruction"
                    render={() => (
                      <FormItem>
                        <FormLabel className="text-base sm:text-lg font-semibold text-gray-700">
                          SELECCIONAR INSTRUCCIÓN <span className="text-red-500 text-xl">*</span>
                        </FormLabel>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mt-2">
                          {[...instructionOptions, { id: 'OTHER', label: 'OTRA' }].map((option) => (
                            <FormField
                              key={option.id}
                              control={form.control}
                              name="instruction"
                              render={({ field }) => (
                                <FormItem
                                  key={option.id}
                                  className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(option.id)}
                                      onCheckedChange={(checked) => {
                                        const updatedValue = checked
                                          ? [option.id] // Only allow one selection
                                          : [];
                                        field.onChange(updatedValue);
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">
                                    {option.label}
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Custom Instruction Input */}
                  {isOtherSelected && (
                    <FormField
                      control={form.control}
                      name="customInstruction"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold text-gray-700">
                            ESCRIBIR INSTRUCCIÓN <span className="text-red-500 text-xl">*</span>
                          </FormLabel>
                          <FormControl>
                            <textarea
                              {...field}
                              className="w-full min-h-[100px] p-3 border rounded-md"
                              placeholder="Escriba la instrucción personalizada aquí..."
                              required={isOtherSelected}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Add office selection if user has permission */}
                  {canEditOffices && (
                    <FormField
                      control={form.control}
                      name="officeIds"
                      render={() => (
                        <FormItem className="space-y-4 col-span-full">
                          <FormLabel className="text-lg primary-text">
                            ACTUALIZAR OFICINA(S) O GERENCIA(S) RESPONSABLE(S)
                          </FormLabel>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {gerencyOptions.map((option) => (
                              <FormField
                                key={option.id}
                                control={form.control}
                                name="officeIds"
                                render={({ field }) => (
                                  <FormItem
                                    key={option.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
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
                                )}
                              />
                            ))}
                          </div>
                          <FormDescription>
                            Actualice las gerencias relacionadas al asunto del oficio si es necesario.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Actions */}
                  <div className="flex justify-end space-x-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/memos")}
                      disabled={isSubmitting}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="bg-primary-green hover:bg-primary-green/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <span className="animate-spin">⏳</span>
                          <span>Asignando...</span>
                        </div>
                      ) : (
                        'Asignar Instrucción'
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}; 