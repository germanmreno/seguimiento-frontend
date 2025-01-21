import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Layout } from "../layout/Layout"
import { Loader } from "@/components/custom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ChatBox } from "@/components/custom";
import { urgencyOptions } from "@/options/formOptions";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { Lock, Image, FileText, Unlock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { forumsService } from "@/services/forums.service";
import { Button } from "@/components/ui/button";

const canManageForumStatus = (user) => {
  return user.role === 'ADMIN' || user.office_id === '110';
};

export const ForumPage = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [forum, setForum] = useState(null);
  const [relatedOffices, setRelatedOffices] = useState([]);
  const [error, setError] = useState('');

  const urgencyVariant = urgencyOptions.find(
    option => option.id === forum?.memoDetails?.urgencyLevel?.toUpperCase()
  )?.variant;

  useEffect(() => {
    const fetchForumDetails = async () => {
      try {
        const forumData = await forumsService.getForumDetails(id);
        console.log('Forum details:', forumData);
        setForum(forumData);
        setRelatedOffices(forumData.relatedOffices);
      } catch (error) {
        console.error('Failed to fetch forum details:', error);
        setError('Failed to fetch forum details.');
      }
    };

    fetchForumDetails();
  }, [id]);

  useEffect(() => {
    // Listen for forum status changes from ChatBox
    const handleForumStatusChange = (event) => {
      const { forumId, status } = event.detail;
      if (forum && forum.id === parseInt(forumId)) {
        setForum(prev => ({
          ...prev,
          status
        }));
      }
    };

    window.addEventListener('forumStatusChanged', handleForumStatusChange);

    return () => {
      window.removeEventListener('forumStatusChanged', handleForumStatusChange);
    };
  }, [forum]);

  const handleDeleteMessage = async (messageId) => {
    try {
      await forumsService.deleteForumMessage(id, messageId, user.id);

      // Update the forum state by removing the deleted message
      setForum(prevForum => ({
        ...prevForum,
        messages: prevForum.messages.filter(msg => msg.id !== messageId)
      }));

      toast.success("Mensaje eliminado correctamente");
    } catch (error) {
      console.error('Failed to delete message:', error);
      toast.error(error.error || 'Error al eliminar el mensaje');
    }
  };

  const handleForumStatusChange = async () => {
    try {
      const newStatus = forum.status === 'OPEN' ? 'CLOSED' : 'OPEN';
      await forumsService.updateForumStatus(forum.id, newStatus);
      setForum(prev => ({
        ...prev,
        status: newStatus
      }));
      toast.success(`Foro ${newStatus === 'OPEN' ? 'abierto' : 'cerrado'} exitosamente`);
    } catch (error) {
      toast.error(error.error || 'Error al actualizar el estado del foro');
    }
  };

  console.log(forum)
  console.log(forum?.memoDetails?.reception_images[0].filename)
  console.log('Filepath:', forum?.memoDetails?.reception_images[0].path)

  if (error) return <Layout><p>{error}</p></Layout>;
  if (!forum) return <Layout><Loader /></Layout>;

  // Rest of your component remains exactly the same
  return (
    <Layout>
      <div className="container mx-auto py-4 sm:py-10 px-2 sm:px-4">
        <div className="flex justify-center">
          <Card className="w-full max-w-[95%] lg:max-w-[1000px] xl:max-w-[1200px] shadow-lg">
            <CardHeader className="bg-primary-blue mb-4 text-white p-4 sm:p-8">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2">
                    <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <span className="primary-text text-xl sm:text-2xl">{forum.title}</span>
                      <Badge className="text-sm w-fit" variant="officeBadge">
                        {(forum.memo_id).toUpperCase()}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-gray-200 text-sm sm:text-base">
                      {relatedOffices.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {relatedOffices.map((office) => (
                            <Badge key={forum.id} className="bg-primary-green hover:bg-primary-green/90 transition-colors">
                              {office.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    {forum.status === 'CLOSED' && (
                      <div className="flex items-center gap-2 bg-red-500/90 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg">
                        <Lock className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="text-sm sm:text-base font-medium">Foro Cerrado</span>
                      </div>
                    )}
                    {canManageForumStatus(user) && (
                      <Button
                        onClick={handleForumStatusChange}
                        className={cn(
                          "min-w-[120px] sm:min-w-[140px] h-8 sm:h-10 text-sm sm:text-base",
                          forum.status === 'OPEN'
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-emerald-500 hover:bg-emerald-600"
                        )}
                      >
                        <div className="flex items-center justify-center gap-2">
                          {forum.status === 'OPEN' ? (
                            <>
                              <Lock className="h-4 w-4" />
                              <span>Cerrar Foro</span>
                            </>
                          ) : (
                            <>
                              <Unlock className="h-4 w-4" />
                              <span>Abrir Foro</span>
                            </>
                          )}
                        </div>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 sm:px-8 py-4 sm:py-6">
              <p className="text-justify text-gray-700 leading-relaxed mb-6 text-sm sm:text-base">
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

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
                {forum.memoDetails?.reception_images?.map((image, index) => (
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
                              src={`/${image.path}`}
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
                    <DialogContent className="max-w-[95vw] sm:max-w-3xl max-h-[90vh]">
                      {image.isPdf ? (
                        <iframe
                          src={`http://172.16.2.51:3005/${image.path}`}
                          className="w-full h-[70vh]"
                          title="PDF Viewer"
                        />
                      ) : (
                        <div className="relative w-full h-full max-h-[70vh] flex items-center justify-center">
                          <img
                            src={`http://172.16.2.51:3005/${image.path}`}
                            alt={`Imagen ${index + 1}`}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </CardContent>
            <CardFooter className="text-xs sm:text-sm text-gray-600 px-4 sm:px-8 py-3 sm:py-4 bg-gray-50">
              <div className="flex flex-col sm:flex-row justify-between w-full gap-2 sm:gap-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium">NIVEL DE URGENCIA:</span>
                  <Badge className="text-xs sm:text-sm" variant={urgencyVariant}>
                    {forum.memoDetails.urgencyLevel}
                  </Badge>
                </div>
                <div className="flex flex-col items-start sm:items-end gap-0.5">
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

        <div className="mt-4 max-w-[95%] lg:max-w-[1000px] xl:max-w-[1200px] mx-auto">
          <ChatBox
            forumId={id}
            onDeleteMessage={handleDeleteMessage}
            currentUserId={user?.id}
            userRole={user?.role}
            forumStatus={forum.status}
          />
        </div>
      </div>
    </Layout>
  )
}