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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useState, useEffect } from "react"
import { Loader } from "@/components/custom/Loader"
import { authService } from "@/services/auth.service"
import { useAuth } from "@/contexts/AuthContext"
import { Navigate } from "react-router-dom"
import { AlertCircle, CheckCircle } from "lucide-react"

const userSchema = z.object({
  ci: z.string().min(1, "La cédula es requerida"),
  username: z.string().min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  firstName: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().min(1, "El apellido es requerido"),
  office_id: z.string().min(1, "La oficina es requerida"),
  role: z.enum(["ADMIN", "USER"], {
    required_error: "El rol es requerido",
  }),
})

export const AdministrationPanel = () => {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [offices, setOffices] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Redirect if not admin
  if (user?.role !== 'ADMIN') {
    return <Navigate to="/home" replace />
  }

  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      ci: "",
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      office_id: "",
      role: "USER"
    },
  })

  useEffect(() => {
    const fetchOffices = async () => {
      try {
        const officesData = await authService.getOffices()
        setOffices(officesData)
      } catch (error) {
        console.error('Error fetching offices:', error)
        setError('No se pudieron cargar las oficinas')
      }
    }

    fetchOffices()
  }, [])

  const onSubmit = async (data) => {
    setIsLoading(true)
    setError('')
    setSuccess('')
    try {
      const response = await authService.register(data)
      setSuccess(`El usuario ${response.username} ha sido creado exitosamente`)
      form.reset()
    } catch (error) {
      console.error('Error creating user:', error)
      setError(error.response?.data?.error || "Error al crear el usuario")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout>
      {isLoading && <Loader message="Creando nuevo usuario..." />}
      <div className="container mx-auto py-10">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="bg-[#24387d] rounded-t-lg">
            <CardTitle className="text-white">Panel de Administración - Crear Usuario</CardTitle>
          </CardHeader>
          <CardContent className="mt-4">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-4 bg-green-50 border-green-500">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertTitle className="text-green-800">Éxito</AlertTitle>
                <AlertDescription className="text-green-700">{success}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="ci"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cédula</FormLabel>
                        <FormControl>
                          <Input placeholder="Cédula" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre de Usuario</FormLabel>
                        <FormControl>
                          <Input placeholder="Nombre de usuario" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contraseña</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Contraseña" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input placeholder="Nombre" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Apellido</FormLabel>
                        <FormControl>
                          <Input placeholder="Apellido" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="office_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Oficina</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar oficina" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {offices.map((office) => (
                              <SelectItem key={office.id} value={office.id}>
                                {office.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rol</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar rol" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="USER">Usuario</SelectItem>
                            <SelectItem value="ADMIN">Administrador</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-center">
                  <Button
                    type="submit"
                    className="w-[200px] bg-primary-green"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creando..." : "Crear Usuario"}
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