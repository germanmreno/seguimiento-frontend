import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "../components/ui/label"
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex max-h-screen">
      <div className="hidden lg:block relative min-w-[1000px] h-screen bg-no-repeat bg-cover bg-[center_top_-8rem] border-r-4" style={{ backgroundImage: `url(/background_login.png)` }}>
      </div>

      <div className="w-full lg:min-w-2/3 p-8 flex flex-col justify-center items-center bg-cover bg-center h-screen" style={{ backgroundImage: `url(/background.png)` }}>
        <div className="max-w-sm w-full">
          <h1 className="text-3xl font-bold mb-6 primary-text text-center">¡Bienvenido (a)!</h1>
          <p className="mb-6 font-bold secondary-text text-center">Para iniciar sesión, por favor introduce tus datos.</p>

          <form className="space-y-4">
            <div className="flex flex-row justify-start align-center">
              <Select>
                <SelectTrigger className="w-[80px] bg-[#d4d4d4] rounded-r-lg">
                  <SelectValue placeholder="V" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Documento</SelectLabel>
                    <SelectItem value="apple">V</SelectItem>
                    <SelectItem value="banana">E</SelectItem>
                    <SelectItem value="blueberry">J</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Input className="mx-2 w-full bg-[#f3f3f3] border-4 border-[#f3f3f3] rounded-lg" type="text" placeholder="Documento" />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="user_handle" className="font-bold">Usuario</Label>
              <Input id="user_handle" className="bg-[#f3f3f3] border-4 border-[#f3f3f3] rounded-lg" placeholder="Nombre de usuario" />
            </div>

            <div className="flex space-x-2 w-full">
              <Button variant="outline" className="flex-1 flex-col h-50 w-80 rounded-lg p-2 button-gradient" onClick={() => navigate("/home")}>
                <img src="/icon_login.png" alt="registro" width="50px" />
                <span className="primary-text mt-[-8px]">Ingresar</span>
              </Button>
              <Button variant="outline" className="flex-1 flex-col h-50 w-80 rounded-lg p-2 button-gradient">
                <img src="/icon_register.png" alt="registro" width="50px" />
                <span className="primary-text mt-[-8px]">Registro</span>
              </Button>
              <Button variant="outline" className="flex-1 flex-col h-50 w-80 rounded-lg p-2 button-gradient">
                <img src="/icon_unlock.png" alt="registro" width="50px" />
                <span className="primary-text mt-[-8px]">Desbloqueo</span>
              </Button>
            </div>
          </form>

          <a href="#" className="mt-6 text-sm text-black underline font-bold hover:underline block text-center tracking-wider">¿Olvidaste tu usuario?</a>
        </div>
      </div>
    </div>
  )
}