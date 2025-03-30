import { useForm } from "react-hook-form"
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
import { useNavigate, useParams } from "react-router-dom"
import { Textarea } from "@/components/ui/textarea"
import { forumsService } from '@/services/forums.service';
import { useState, useEffect } from "react"
import { Loader } from "@/components/custom/Loader"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"

const formSchema = z.object({
  title: z.string().min(5, "El título es requerido y debe poseer más de 5 carácteres"),
  description: z.string().min(10, "La descripción es requerida y debe poseer más de 10 carácteres"),
})

export const CreateForumPage = () => {

  const navigate = useNavigate()
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !user) {
      toast.error('Sesión no válida. Por favor, inicie sesión nuevamente.');
      navigate('/login');
    }
  }, [user, navigate]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: ""
    },
  })

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      if (!id) {
        toast.error('ID del memo no encontrado');
        return;
      }

      const forumData = {
        memo_id: id,
        ...data,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      };

      const response = await forumsService.createForum(forumData, user);

      if (response?.id) {
        toast.success('Foro creado exitosamente');
        navigate(`/forums/${response.id}`);
      } else {
        throw new Error('No se recibió una respuesta válida del servidor');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message ||
        error.message ||
        'Error al crear el foro. Por favor, intente nuevamente.';
      console.error('Error creating forum:', errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (

    <Layout>
      {isLoading && <Loader message={`Creando foro para el oficio ${id.toUpperCase()}...`} />}
      <div className="container mx-auto py-4 md:py-6 px-4 md:px-6">
        <Card className="shadow-lg">
          <CardHeader className="bg-primary-blue mb-4 text-white p-4 md:p-6">
            <CardTitle className="text-xl md:text-2xl font-bold">Crear Nuevo Foro</CardTitle>
          </CardHeader>

          <CardContent className="p-4 md:p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 gap-4 md:gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="primary-text text-sm md:text-base">
                          TÍTULO <span className="text-red-500 text-xl">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Título del foro"
                            className="bg-gray-200"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs md:text-sm">
                          Indique el título del foro.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="col-span-3">
                        <FormLabel className="primary-text">DESCRIPCIÓN DEL OFICIO <span className="text-red-500 text-xl">*</span></FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descripción..."
                            className="bg-gray-200"
                            rows={5}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Escriba una descripción sobre el oficio a tratar.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-center pt-4">
                  <Button
                    type="submit"
                    className="w-full md:w-[400px] h-[45px] bg-primary-green primary-text text-base md:text-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creando...' : 'Crear'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

