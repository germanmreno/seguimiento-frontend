import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/layout/Layout";
import { memosService } from "@/services/memos.service";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  User,
  Mail,
  Calendar,
  Clock,
  Eye,
  Download,
  MessageCircle,
  Image,
} from "lucide-react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Loader } from "@/components/custom";
import { formatDate, formatTime } from '@/lib/dateUtils';
import { STATUS_STYLES } from '@/constants/status';

export const MemoDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [memo, setMemo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fileLoading, setFileLoading] = useState(false);

  useEffect(() => {
    const fetchMemo = async () => {
      try {
        const data = await memosService.getMemo(id);
        console.log('Memo data:', data);
        setMemo(data);
        setLoading(false);
      } catch (error) {
        toast.error("Error al cargar el memo");
        console.error(error);
      }
    };

    fetchMemo();
  }, [id]);

  const getStatusText = (status) => {
    const statusMap = {
      PENDING: "Pendiente",
      ASSIGNED: "Asignado",
      COMPLETED: "Completado",
      ARCHIVED: "Archivado"
    };
    return statusMap[status] || status;
  };

  const getFileIcon = (file) => {
    if (file.isPdf) {
      return <FileText className="h-5 w-5 text-red-500" />;
    }

    const type = file.type?.toLowerCase() || '';

    if (type.includes('pdf')) {
      return <FileText className="h-5 w-5 text-red-500" />;
    }
    if (type.includes('image')) {
      return <Image className="h-5 w-5 text-blue-500" />;
    }
    if (type.includes('word') || type.includes('document')) {
      return <FileText className="h-5 w-5 text-blue-600" />;
    }
    if (type.includes('sheet') || type.includes('excel')) {
      return <FileText className="h-5 w-5 text-green-600" />;
    }
    return <FileText className="h-5 w-5 text-gray-500" />;
  };

  const handleViewFile = async (file) => {
    setFileLoading(true);
    try {
      const cleanPath = file.path.replace(/\\/g, '/').replace(/^\/+/, '');
      const fileUrl = `${import.meta.env.VITE_API_URL || ''}/${cleanPath}`;

      if (file.type === 'application/pdf') {
        window.open(fileUrl, '_blank', 'noopener,noreferrer');
      } else if (file.type.startsWith('image/')) {
        return fileUrl;
      } else {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = file.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      toast.error("Error al cargar el archivo");
      console.error(error);
    } finally {
      setFileLoading(false);
    }
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

  const getStatusBadgeVariant = (status) => {
    return STATUS_STYLES[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getUrgencyBadgeVariant = (urgency) => {
    return urgency === 'URGENT' ? 'destructive' :
      urgency === 'MEDIUM' ? 'warning' : 'secondary';
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-6">
          <Card className="shadow-lg min-h-[400px] flex items-center justify-center">
            <Loader className="w-10 h-10 text-primary-blue" />
            <p className="text-gray-500 mt-4">Cargando detalles del memo...</p>
          </Card>
        </div>
      </Layout>
    );
  }

  console.log(memo)

  return (
    <Layout>
      <div className="container mx-auto py-4 md:py-6">
        <Card className="shadow-lg">
          <CardHeader className="bg-primary-blue mb-4 text-white p-4 md:p-8">
            <CardTitle className="text-2xl flex items-center justify-between">
              <span>Detalles de Correspondencia - {memo?.id}</span>
              <Badge
                variant={getUrgencyBadgeVariant(memo?.urgency)}
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

          <CardContent className="p-4 md:p-8">
            <div className="space-y-8">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <h3 className="font-semibold text-primary-blue flex items-center gap-2 mb-3 text-sm md:text-base">
                      <FileText className="h-4 w-4 md:h-5 md:w-5" />
                      Asunto
                    </h3>
                    <p className="text-base md:text-lg text-gray-700">{memo?.name}</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <h3 className="font-semibold text-primary-blue flex items-center gap-2 mb-3 text-sm md:text-base">
                      <User className="h-4 w-4 md:h-5 md:w-5" />
                      Solicitante
                    </h3>
                    <p className="text-base md:text-lg text-gray-700">{memo?.applicant}</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <h3 className="font-semibold text-primary-blue flex items-center gap-2 mb-3 text-sm md:text-base">
                      <Calendar className="h-4 w-4 md:h-5 md:w-5" />
                      Fecha y Hora de Recepción
                    </h3>
                    <p className="text-base md:text-lg text-gray-700">
                      {formatDate(memo?.reception_date)} - {memo?.reception_hour}
                    </p>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <h3 className="font-semibold text-primary-blue flex items-center gap-2 mb-3 text-sm md:text-base">
                      <MessageCircle className="h-4 w-4 md:h-5 md:w-5" />
                      Estado
                    </h3>
                    <Badge className={`${getStatusBadgeVariant(memo?.status)}`}>
                      {getStatusText(memo?.status)}
                    </Badge>
                  </div>

                  <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <h3 className="font-semibold text-primary-blue flex items-center gap-2 mb-3 text-sm md:text-base">
                      <Eye className="h-4 w-4 md:h-5 md:w-5" />
                      Método de Recepción
                    </h3>
                    <p className="text-base md:text-lg text-gray-700">{formatReceptionMethod(memo?.reception_method)}</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <h3 className="font-semibold text-primary-blue flex items-center gap-2 mb-3 text-sm md:text-base">
                      <MessageCircle className="h-4 w-4 md:h-5 md:w-5" />
                      Requiere Respuesta
                    </h3>
                    <Badge variant={memo?.response_require === 'YES' ? 'default' : 'secondary'}>
                      {formatResponseRequire(memo?.response_require)}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Files Section */}
              <div className="grid grid-cols-2 gap-8">
                {/* Reception Images */}
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                  <h3 className="font-semibold text-primary-blue flex items-center gap-2 mb-4">
                    <FileText className="h-5 w-5" />
                    Imágenes de Recepción
                  </h3>
                  {memo?.reception_images?.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4">
                      {memo.reception_images.map((file, index) => (
                        <Dialog key={index}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full h-20 md:h-24 aspect-square relative group overflow-hidden"
                            >
                              {file.isPdf ? (
                                <div className="flex flex-col items-center justify-center h-24 w-full bg-gray-50 group-hover:bg-gray-100">
                                  <FileText className="h-12 w-12 text-red-500 mb-2" />
                                  <span className="text-sm font-medium text-gray-700">
                                    {file.filename}
                                  </span>
                                </div>
                              ) : (
                                <>
                                  <img
                                    src={`${file.path.replace(/\\/g, '/').replace(/^\/+/, '')}`}
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
                          <DialogContent className="max-w-[95vw] md:max-w-4xl">
                            {file.isPdf ? (
                              <iframe
                                src={`${import.meta.env.VITE_API_URL || ''}/${file.path}`}
                                className="w-full h-[80vh]"
                                title="PDF Viewer"
                              />
                            ) : (
                              <img
                                src={`${file.path}`}
                                alt={`Recepción ${index + 1}`}
                                className="max-w-full max-h-[80vh] object-contain"
                              />
                            )}
                          </DialogContent>
                        </Dialog>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 italic flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
                      <FileText className="h-5 w-5" />
                      <span>No hay imágenes de recepción disponibles</span>
                    </div>
                  )}
                </div>

                {/* Attachments */}
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                  <h3 className="font-semibold text-primary-blue flex items-center gap-2 mb-4">
                    <FileText className="h-5 w-5" />
                    Archivos Adjuntos
                  </h3>
                  {memo?.attachment_files?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {memo.attachment_files.map((file, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          onClick={() => handleViewFile(file)}
                          className="w-full flex items-center gap-3 p-4 hover:border-primary-blue/50 group"
                          disabled={fileLoading}
                        >
                          <div className="flex-shrink-0">
                            {fileLoading ? (
                              <Loader className="w-5 h-5" />
                            ) : (
                              getFileIcon(file)
                            )}
                          </div>
                          <div className="flex-1 flex flex-col items-start">
                            <span className="text-sm font-medium text-gray-700">{file.filename}</span>
                            <span className="text-xs text-gray-500">
                              {file.type ? file.type.split('/')[1].toUpperCase() : 'DOCUMENTO'}
                            </span>
                          </div>
                          <Download className="h-4 w-4 text-gray-400 group-hover:text-primary-blue" />
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 italic flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
                      <FileText className="h-5 w-5" />
                      <span>No hay archivos adjuntos disponibles</span>
                    </div>
                  )}
                </div>
              </div>

              <Separator className="my-6" />

              {/* Instruction Section */}
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <h3 className="font-semibold text-primary-blue flex items-center gap-2 mb-4">
                  <MessageCircle className="h-5 w-5" />
                  Instrucción
                </h3>
                <p className="text-lg text-gray-700 bg-gray-50 p-4 rounded-lg border">
                  {memo?.instruction || "Sin instrucción asignada"}
                </p>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => navigate("/memos")}
                  className="hover:bg-gray-100"
                >
                  Volver
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}; 