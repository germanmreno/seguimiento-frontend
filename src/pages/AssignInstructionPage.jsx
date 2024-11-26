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

const formSchema = z.object({
  instruction: z.array(z.string()).min(1, "Debe seleccionar una instrucción"),
})

export const AssignInstructionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [memo, setMemo] = useState(null);
  const [selectedInstruction, setSelectedInstruction] = useState("");
  const [loading, setLoading] = useState(true);

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
    },
  })

  const handleAssignInstruction = async (data) => {
    try {
      await memosService.assignInstruction(id, data.instruction[0]);

      const instructionLabel = instructionOptions.find(
        opt => opt.id === data.instruction[0]
      )?.label;

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
              Instrucción: <span className="font-medium">{instructionLabel}</span>
            </p>
          </div>
        </div>,
        {
          duration: 4000,
          className: "bg-white",
        }
      );

      setTimeout(() => {
        navigate("/memos");
      }, 1000);
    } catch (error) {
      toast.error(
        <div className="flex flex-col gap-1">
          <span className="font-semibold">Error al asignar la instrucción</span>
          <span className="text-sm">Por favor, intente nuevamente</span>
        </div>,
        {
          duration: 4000,
        }
      );
      console.error(error);
    }
  };

  const handleViewFile = (filePath) => {
    window.open(`http://localhost:3005/${filePath}`, '_blank');
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
      <div className="container mx-auto py-6">
        <Card className="shadow-lg">
          <CardHeader className="bg-primary-blue text-white p-8">
            <CardTitle className="text-2xl flex items-center justify-between">
              <span>Asignar Instrucción - Memo {memo?.id}</span>
              <Badge
                variant={memo?.urgency === 'URGENT' ? 'destructive' :
                  memo?.urgency === 'NORMAL' ? 'normal' :
                    'secondary'}
                className="text-base px-4 py-1"
              >
                {memo?.urgency}
              </Badge>
            </CardTitle>
            <div className="flex gap-2 mt-4">
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
          <CardContent className="p-8">
            <div className="space-y-8">
              {/* Basic Memo Information */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
                      <FileText className="h-5 w-5 text-primary-blue" />
                      Asunto
                    </h3>
                    <p className="text-lg">{memo?.name}</p>
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
              <div className="grid grid-cols-2 gap-8">
                {/* Reception Images */}
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">Imágenes de Recepción:</h3>
                  <div className="grid grid-cols-2 gap-4">
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
                                  src={`http://localhost:3005/${file.path}`}
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
                              src={`http://localhost:3005/${file.path}`}
                              className="w-full h-[80vh]"
                              title="PDF Viewer"
                            />
                          ) : (
                            <img
                              src={`http://localhost:3005/${file.path}`}
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
                <form onSubmit={form.handleSubmit(handleAssignInstruction)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="instruction"
                    render={() => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold text-gray-700">
                          SELECCIONAR INSTRUCCIÓN <span className="text-red-500 text-xl">*</span>
                        </FormLabel>
                        <FormDescription>
                          Seleccione la instrucción que desea asignar al memo.
                        </FormDescription>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                          {instructionOptions.map((option) => (
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
                                          ? [...(field.value || []), option.id]
                                          : field.value?.filter((value) => value !== option.id);
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

                  {/* Actions */}
                  <div className="flex justify-end space-x-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/memos")}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="bg-primary-green hover:bg-primary-green/90"
                    >
                      Asignar Instrucción
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