import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Layout } from "../layout/Layout";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { FileImage, Download, ExternalLink, Loader2, Search } from "lucide-react";
import { sentMemosService } from '../services/sentMemos.service';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { formatDate } from "../lib/dateUtils";

const formSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  receptionImage: z.any(),
});

export const SendMemoPage = () => {
  const { user } = useAuth();
  const [receptionFile, setReceptionFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [sentMemos, setSentMemos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      receptionImage: null,
    },
  });

  // Fetch sent memos
  const fetchSentMemos = async () => {
    try {
      setIsLoading(true);
      const data = await sentMemosService.getSentMemos();
      setSentMemos(data);
    } catch (error) {
      toast.error('Error al cargar los documentos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSentMemos();
  }, []);

  // Filter memos based on search term
  const filteredMemos = Array.isArray(sentMemos) ? sentMemos.filter((memo) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      memo.title.toLowerCase().includes(searchLower) ||
      memo.id.toLowerCase().includes(searchLower)
    );
  }) : []; // Default to an empty array if sentMemos is not an array

  const handleReceptionFile = (e) => {
    const file = e.target.files[0];
    setReceptionFile(file);
    form.setValue("receptionImage", [file]);
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("receptionImage", receptionFile);
      formData.append("registeredBy", user.id);

      const result = await sentMemosService.createSentMemo(formData);
      setSuccessData(result);
      toast.success("Documento registrado exitosamente");
      form.reset();
      setReceptionFile(null);
    } catch (error) {
      toast.error(error.message || "Error al procesar el documento");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 md:py-8">
        <Card className="shadow-lg max-w-5xl mx-auto">
          <CardHeader className="bg-primary-blue mb-6 text-white p-6 md:p-8">
            <CardTitle className="text-2xl">Gestión de Documentos</CardTitle>
            <p className="mt-2 text-gray-100 text-sm md:text-base">
              Registre y gestione los documentos del sistema
            </p>
          </CardHeader>

          <CardContent className="p-6 md:p-8">
            <Tabs defaultValue="create" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="create">Nuevo Documento</TabsTrigger>
                <TabsTrigger value="list">Ver Documentos</TabsTrigger>
              </TabsList>

              <TabsContent value="create">
                <div className="bg-white p-8 rounded-lg border shadow-sm">
                  <h3 className="font-semibold text-primary-blue flex items-center gap-2 mb-6 text-lg">
                    <FileImage className="h-6 w-6" />
                    Información del Documento
                  </h3>

                  {!successData ? (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid gap-8">
                          <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormLabel className="text-base font-medium">
                                  Título del Documento
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Ingrese el título del documento"
                                    {...field}
                                    className="h-12 px-4 text-base"
                                    aria-label="Título del documento"
                                  />
                                </FormControl>
                                <p className="text-sm text-gray-500">
                                  Ingrese un título descriptivo para identificar el documento
                                </p>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="receptionImage"
                            render={() => (
                              <FormItem className="space-y-4">
                                <FormLabel className="text-base font-medium">
                                  Documento PDF
                                </FormLabel>
                                <FormControl>
                                  <div className="flex flex-col gap-4">
                                    <div className="p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 hover:border-primary-blue/50 transition-colors">
                                      <div className="flex flex-col md:flex-row items-center gap-6">
                                        <div className="w-full md:w-auto">
                                          <label
                                            className="inline-flex px-6 py-3 bg-primary-blue text-white rounded-lg cursor-pointer hover:bg-primary-blue/90 transition-colors text-sm font-semibold"
                                          >
                                            Seleccionar archivo
                                            <Input
                                              type="file"
                                              onChange={handleReceptionFile}
                                              accept=".pdf"
                                              className="hidden"
                                              aria-label="Seleccionar documento PDF"
                                            />
                                          </label>
                                          <span className="ml-3 text-sm text-gray-500">
                                            {receptionFile ? receptionFile.name : 'Sin archivo seleccionado'}
                                          </span>
                                        </div>
                                        {receptionFile && (
                                          <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-lg border border-blue-100">
                                            <FileImage className="h-5 w-5 text-blue-600" />
                                            <span className="text-sm font-medium text-blue-700">
                                              {receptionFile.name}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <p className="text-sm text-gray-600 flex items-center gap-2">
                                        <FileImage className="h-4 w-4" />
                                        Formato aceptado: PDF
                                      </p>
                                      <p className="text-sm text-gray-600 flex items-center gap-2">
                                        <FileImage className="h-4 w-4" />
                                        Tamaño máximo: 10MB
                                      </p>
                                    </div>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="flex justify-end">
                          <Button
                            type="submit"
                            className="w-full md:w-auto"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Procesando...
                              </>
                            ) : (
                              "Enviar Documento"
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  ) : (
                    <div className="mt-8 space-y-6">
                      <div className="bg-white p-6 rounded-lg border shadow-sm">
                        <h3 className="font-semibold text-primary-blue flex items-center gap-2 mb-4 text-lg">
                          <FileImage className="h-6 w-6" />
                          Documento Procesado
                        </h3>

                        <div className="space-y-6">
                          <div className="border-2 rounded-lg p-1">
                            <iframe
                              src={`http://172.16.2.51:3005/${successData.pdfWithQR}`}
                              className="w-full h-[600px] rounded"
                              title="Vista previa del documento con QR"
                            />
                          </div>

                          <div className="flex flex-col md:flex-row gap-4 justify-center">
                            <a
                              href={`http://172.16.2.51:3005/${successData.pdfWithQR}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="Descargar PDF"
                            >
                              <Button
                                size="lg"
                                className="w-full md:w-auto px-8 bg-blue-600 hover:bg-blue-700"
                              >
                                <Download className="mr-2 h-5 w-5" />
                                Descargar PDF
                              </Button>
                            </a>

                            <a
                              href={`http://172.16.2.51:3005/verify/${successData.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="Ver página de verificación"
                            >
                              <Button
                                size="lg"
                                className="w-full md:w-auto px-8 bg-green-600 hover:bg-green-700"
                              >
                                <ExternalLink className="mr-2 h-5 w-5" />
                                Ver Página de Verificación
                              </Button>
                            </a>
                          </div>

                          <div className="flex justify-center mt-6">
                            <Button
                              onClick={() => {
                                setSuccessData(null);
                                form.reset();
                              }}
                              variant="outline"
                              size="lg"
                            >
                              Crear Nuevo Documento
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="list">
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium text-primary-blue flex items-center gap-2">
                      <FileImage className="h-5 w-5" />
                      Documentos Enviados
                    </h3>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Buscar documento..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-[250px]"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchSentMemos}
                      >
                        Actualizar
                      </Button>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border shadow-sm">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-100">
                            <TableHead className="whitespace-nowrap">ID</TableHead>
                            <TableHead className="whitespace-nowrap">Título</TableHead>
                            <TableHead className="whitespace-nowrap">Fecha</TableHead>
                            <TableHead className="whitespace-nowrap text-right">Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredMemos.map((memo) => (
                            <TableRow key={memo.id}>
                              <TableCell className="font-medium">{memo.id.slice(0, 8)}...</TableCell>
                              <TableCell>{memo.title}</TableCell>
                              <TableCell>{formatDate(memo.createdAt)}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <a
                                    href={`http://172.16.2.51:3005/${memo.receptionImage}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Button variant="outline" size="sm">
                                      Original
                                    </Button>
                                  </a>
                                  {memo.pdfWithQR && (
                                    <a
                                      href={`http://172.16.2.51:3005/${memo.pdfWithQR}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <Button variant="outline" size="sm">
                                        Con QR
                                      </Button>
                                    </a>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                          {filteredMemos.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                                No se encontraron documentos
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}; 