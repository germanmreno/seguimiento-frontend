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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from 'sonner'

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
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchTerm, setSearchTerm] = useState('');

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

  // Add new state for user management
  const [selectedUser, setSelectedUser] = useState(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Add function to fetch users
  const fetchUsers = async () => {
    try {
      const usersData = await authService.getUsers()
      setUsers(usersData)
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('No se pudieron cargar los usuarios')
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Add function to handle user updates
  const handleUserUpdate = async (userId, updateData) => {
    try {
      setIsLoading(true)
      await authService.updateUser(userId, updateData)
      toast.success('Usuario actualizado correctamente')
      fetchUsers() // Refresh users list
      setIsEditDialogOpen(false)
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al actualizar usuario')
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      await authService.register(data)
      toast.success('Usuario creado exitosamente')
      form.reset()
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al crear usuario')
    } finally {
      setIsLoading(false)
    }
  }

  // Add filter function
  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.username.toLowerCase().includes(searchLower) ||
      user.firstName.toLowerCase().includes(searchLower) ||
      user.lastName.toLowerCase().includes(searchLower) ||
      user.ci.toLowerCase().includes(searchLower) ||
      user.office?.name.toLowerCase().includes(searchLower)
    );
  });

  return (
    <Layout>
      {isLoading && <Loader message="Procesando..." />}
      <div className="container mx-auto py-4 px-2 sm:px-4 md:py-10">
        <Card className="max-w-6xl mx-auto">
          <CardHeader className="bg-[#24387d] rounded-t-lg">
            <CardTitle className="text-white text-lg sm:text-xl">Panel de Administración</CardTitle>
          </CardHeader>
          <CardContent className="mt-4 p-2 sm:p-6">
            <Tabs defaultValue="create" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="create">Crear Usuario</TabsTrigger>
                <TabsTrigger value="manage">Gestionar Usuarios</TabsTrigger>
              </TabsList>

              <TabsContent value="create">
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

                    <div className="flex justify-center mt-6">
                      <Button
                        type="submit"
                        className="w-full sm:w-[200px] bg-primary-green"
                        disabled={isLoading}
                      >
                        {isLoading ? "Creando..." : "Crear Usuario"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="manage">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Usuarios Registrados</h3>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Buscar usuario..."
                        className="max-w-[200px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchUsers}
                      >
                        Actualizar
                      </Button>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-[#24387d]">
                          <TableHead className="text-white whitespace-nowrap">CI</TableHead>
                          <TableHead className="text-white whitespace-nowrap">Usuario</TableHead>
                          <TableHead className="text-white whitespace-nowrap">Nombre Completo</TableHead>
                          <TableHead className="text-white whitespace-nowrap hidden md:table-cell">Oficina</TableHead>
                          <TableHead className="text-white whitespace-nowrap hidden sm:table-cell">Rol</TableHead>
                          <TableHead className="text-white whitespace-nowrap text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>{user.ci}</TableCell>
                            <TableCell className="font-medium">{user.username}</TableCell>
                            <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              {user.office?.name || 'N/A'}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <span className={`px-2 py-1 rounded-full text-xs ${user.role === 'ADMIN'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                                }`}>
                                {user.role}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedUser(user)}
                                  >
                                    Editar
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Editar Usuario</DialogTitle>
                                  </DialogHeader>
                                  <UserEditForm
                                    user={selectedUser}
                                    offices={offices}
                                    onSubmit={handleUserUpdate}
                                    onCancel={() => setIsEditDialogOpen(false)}
                                  />
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        ))}
                        {filteredUsers.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                              No se encontraron usuarios
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

// Create a separate component for the edit form
const UserEditForm = ({ user, offices, onSubmit, onCancel }) => {
  const form = useForm({
    resolver: zodResolver(userEditSchema),
    defaultValues: {
      username: user?.username || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      office_id: user?.office_id || '',
      role: user?.role || 'USER',
      password: '', // Empty by default
    },
  })

  const handleSubmit = (data) => {
    // Only include password if it was changed
    const updateData = { ...data }
    if (!updateData.password) {
      delete updateData.password
    }
    onSubmit(user.id, updateData)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid gap-4">
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
                <FormLabel>Nueva Contraseña (opcional)</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Dejar en blanco para mantener" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          </div>

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

        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 mt-6">
          <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
            Cancelar
          </Button>
          <Button type="submit" className="w-full sm:w-auto">
            Guardar Cambios
          </Button>
        </div>
      </form>
    </Form>
  )
}

// Add validation schema for editing users
const userEditSchema = z.object({
  username: z.string().min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres").optional().or(z.literal('')),
  firstName: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().min(1, "El apellido es requerido"),
  office_id: z.string().min(1, "La oficina es requerida"),
  role: z.enum(["ADMIN", "USER"], {
    required_error: "El rol es requerido",
  }),
}) 