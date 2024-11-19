import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Layout } from "../layout/Layout"
import axios from "axios";
import { Loader } from "@/components/custom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ChatBox } from "@/components/custom";
import { urgencyOptions } from "@/options/formOptions";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Image, FileText } from "lucide-react";

export const ForumPage = () => {

  const { id } = useParams();
  const { user } = useAuth();
  console.log('Current user:', user);

  const [forum, setForum] = useState(null);
  const [relatedOffices, setRelatedOffices] = useState([]);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const urgencyVariant = urgencyOptions.find(option => option.id === forum?.memoDetails?.urgencyLevel?.toUpperCase())?.variant;

  useEffect(() => {
    const fetchForumDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/forums/${id}`);
        console.log(response)
        setForum(response.data);
        setRelatedOffices(response.data.relatedOffices);
      } catch (error) {
        console.error('Failed to fetch forum details:', error);
        setError('Failed to fetch forum details.');
      }
    };

    fetchForumDetails();
  }, [id]);

  const handleDeleteMessage = async (messageId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/forums/${id}/messages/${messageId}`,
        { data: { user_id: user.id } }
      );

      toast.success("Mensaje borrado correctamente");
    } catch (error) {
      console.error('Failed to delete message:', error);
      toast.error(error.response?.data?.error || 'Failed to delete message');
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (!forum) {
    return (<Layout>
      <Loader />
    </Layout>)

  }

  return (
    <Layout>
      <div className="container mx-auto py-10 grid grid-rows-1 divide-y">
        <div className="flex justify-center">
          <Card className="w-[1200px] shadow-lg">
            <CardHeader className="bg-primary-blue mb-4 text-white p-8">
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="flex items-center gap-3 mb-2">
                      <span className="primary-text text-2xl">{forum.title}</span>
                      <Badge className="text-sm" variant="officeBadge">
                        {(forum.memo_id).toUpperCase()}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-gray-200 text-base">
                      {relatedOffices.length > 0 && (
                        <div className="flex gap-2">
                          {relatedOffices.map((office) => (
                            <Badge key={forum.id} className="bg-primary-green hover:bg-primary-green/90 transition-colors">
                              {office.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardDescription>
                  </div>
                  {forum.status === 'CLOSED' && (
                    <div className="flex items-center gap-2 bg-red-500/90 px-4 py-2 rounded-lg">
                      <Lock className="h-5 w-5" />
                      <span className="font-medium">Foro Cerrado</span>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-8 py-6">
              <p className="text-justify text-gray-700 leading-relaxed mb-6">
                {forum.description}
              </p>

              {forum.memoDetails?.instruction && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-3 text-gray-700">
                    Instrucción del memo:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className="bg-gray-50 text-gray-600 text-sm py-2 px-3"
                    >
                      {forum.memoDetails.instruction}
                    </Badge>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium mb-3 flex items-center gap-2 text-gray-700">
                    <Image className="w-4 h-4" />
                    Imágenes de recepción
                  </h3>
                  {forum.memoDetails?.reception_images?.length > 0 ? (
                    <div className="grid grid-cols-6 gap-2">
                      {forum.memoDetails.reception_images.map((image, index) => (
                        <Dialog key={index}>
                          <DialogTrigger asChild>
                            <div className="group cursor-pointer">
                              {image.isPdf ? (
                                <div className="border rounded-lg p-2 hover:bg-gray-50 transition-colors flex flex-col items-center justify-center h-24">
                                  <FileText className="w-8 h-8 text-red-500 mb-1" />
                                  <span className="text-xs text-gray-600 text-center break-words max-w-full px-1 line-clamp-1">
                                    {image.filename}
                                  </span>
                                </div>
                              ) : (
                                <div className="relative overflow-hidden rounded-lg border aspect-square h-24">
                                  <img
                                    src={`http://localhost:3000/${image.path}`}
                                    alt={`Imagen ${index + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                  />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-white text-xs">Ver</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[80vh]">
                            {image.isPdf ? (
                              <iframe
                                src={`http://localhost:3000/${image.path}`}
                                className="w-full h-[70vh]"
                                title="PDF Viewer"
                              />
                            ) : (
                              <div className="relative w-full h-full max-h-[70vh] flex items-center justify-center">
                                <img
                                  src={`http://localhost:3000/${image.path}`}
                                  alt={`Imagen ${index + 1}`}
                                  className="max-w-full max-h-full object-contain"
                                />
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm flex items-center gap-2 italic">
                      <span>No hay imágenes de recepción disponibles</span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium mb-3 flex items-center gap-2 text-gray-700">
                    <FileText className="w-4 h-4" />
                    Archivos adjuntos
                  </h3>
                  {forum.memoDetails?.attachment_files?.length > 0 ? (
                    <div className="grid grid-cols-6 gap-2">
                      {forum.memoDetails.attachment_files.map((file, index) => (
                        <Dialog key={index}>
                          <DialogTrigger asChild>
                            <div className="group cursor-pointer">
                              {file.type === 'application/pdf' ? (
                                <div className="border rounded-lg p-2 hover:bg-gray-50 transition-colors flex flex-col items-center justify-center h-24">
                                  <FileText className="w-8 h-8 text-blue-500 mb-1" />
                                  <span className="text-xs text-gray-600 text-center break-words max-w-full px-1 line-clamp-1">
                                    {file.filename}
                                  </span>
                                </div>
                              ) : (
                                <div className="relative overflow-hidden rounded-lg border aspect-square h-24">
                                  <img
                                    src={`http://localhost:3000/${file.path}`}
                                    alt={`Archivo ${index + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                  />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-white text-xs">Ver</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[80vh]">
                            {file.type === 'application/pdf' ? (
                              <iframe
                                src={`http://localhost:3000/${file.path}`}
                                className="w-full h-[70vh]"
                                title="PDF Viewer"
                              />
                            ) : (
                              <div className="relative w-full h-full max-h-[70vh] flex items-center justify-center">
                                <img
                                  src={`http://localhost:3000/${file.path}`}
                                  alt={`Archivo ${index + 1}`}
                                  className="max-w-full max-h-full object-contain"
                                />
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm flex items-center gap-2 italic">
                      <span>No hay archivos adjuntos disponibles</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="text-sm text-gray-600 px-8 py-4 bg-gray-50">
              <div className="flex justify-between w-full">
                <div className="flex items-center gap-2">
                  <span className="font-medium">NIVEL DE URGENCIA:</span>
                  <Badge className="text-sm" variant={urgencyVariant}>
                    {forum.memoDetails.urgencyLevel}
                  </Badge>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Creado: {new Date(forum.createdAt).toLocaleDateString()}</span>
                  </div>
                  {forum.lastMessageAt && (
                    <div className="flex items-center gap-1 text-primary-blue">
                      <Clock className="h-4 w-4" />
                      <span>
                        Último mensaje: {new Date(forum.lastMessageAt).toLocaleDateString()} {new Date(forum.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className={cn(
          "mt-4 flex flex-col items-center justify-center border-t-2 rounded-b-lg text-white rounded-lg border-none",
          forum.status === 'CLOSED' ? "border-red-500 bg-red-500" : "border-primary-blue bg-primary-blue"
        )}>
          <h2 className="text-2xl font-bold py-4 primary-text">
            Chat del foro
            {forum.status === 'CLOSED' && " (Cerrado)"}
          </h2>
          <ChatBox
            forumId={id}
            onDeleteMessage={handleDeleteMessage}
            currentUserId={user?.id}
            forumStatus={forum.status}
          />
        </div>


      </div>
    </Layout>
  )
}