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
import { useState } from "react"
import { Loader } from "@/components/custom/Loader"
import { useAuth } from "@/contexts/AuthContext"

const formSchema = z.object({
  title: z.string().min(5, "El título es requerido y debe poseer más de 5 carácteres"),
  description: z.string().min(10, "La descripción es requerida y debe poseer más de 10 carácteres"),
})

export const CreateForumPage = () => {

  const navigate = useNavigate()
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: ""
    },
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const forumData = {
        memo_id: id,
        ...data,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      }

      const response = await forumsService.createForum(forumData, user)

      if (response) {
        navigate(`/forums/${response.id}`)
      }
    } catch (error) {
      console.error('Error creating forum:', error)
      // Here you might want to add some error handling UI feedback
    } finally {
      setIsLoading(false)
    }
  }

  return (

    <Layout>
      {isLoading && <Loader message={`Creando foro para el oficio ${id.toUpperCase()}...`} />}
      <div className="container mx-auto py-10 divide-y flex justify-center">
        <Card className="w-full max-w-4xl bg-white shadow-lg">
          <CardHeader className="bg-[#24387d] rounded-t-lg">
            <CardTitle className="text-sms text-left text-white primary-text">CREACIÓN DE FORO</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-3">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="primary-text">TÍTULO <span className="text-red-500 text-xl">*</span></FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Título del foro"
                              className="bg-gray-200"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Indique el título del foro.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
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


                <div className="space-y-4 flex justify-center">
                  <Button
                    type="submit"
                    className="w-[400px] h-[45px] bg-primary-green primary-text text-lg"
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

