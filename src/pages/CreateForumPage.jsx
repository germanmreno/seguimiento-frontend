import { useState } from "react"
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
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
  title: z.string().min(5, "El título es requerido y debe poseer más de 5 carácteres"),
  description: z.string().min(10, "La descripción es requerida y debe poseer más de 10 carácteres"),
})

export const CreateForumPage = () => {

  const navigate = useNavigate()
  const { id } = useParams()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: ""
    },
  })

  const onSubmit = async (data) => {
    console.log('Form submitted:', { ...data });

    try {
      const response = await fetch('http://localhost:3000/forums', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memo_id: id, // Assuming you want to include the memo_id from the URL params
          ...data,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Success:', result);

      // Navigate to another page or show a success message
      navigate(`/forums/${result.id}`);
    } catch (error) {
      console.error('Error:', error);
      // Show an error message to the user
    }
  };

  return (

    <Layout>
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
                  <Button type="submit" className="w-[400px] h-[45px] bg-primary-green primary-text text-lg">Crear</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

