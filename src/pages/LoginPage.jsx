import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "../components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useNavigate, Navigate } from "react-router-dom";
import { AlertCircle, Loader2, CheckCircle2, XCircle } from "lucide-react";
import axios from "axios";
import { useAuth } from '../contexts/AuthContext';

export const LoginPage = () => {
  const { user, login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/home" replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/auth/login',
        JSON.stringify({ username, password }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      const { token, user } = response.data;
      login(user, token);
      navigate('/home', {
        state: {
          showWelcome: true,
          userName: user.firstName
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Ocurrió un error inesperado. Por favor, intenta de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex max-h-screen">
        <div className="hidden lg:block relative min-w-[1000px] h-screen bg-no-repeat bg-cover bg-[center_top_-8rem] border-r-4"
          style={{ backgroundImage: `url(/background_login.png)` }}>
        </div>

        <div className="w-full lg:min-w-2/3 p-8 flex flex-col justify-center items-center bg-cover bg-center h-screen"
          style={{ backgroundImage: `url(/background.png)` }}>
          <div className="max-w-sm w-full">
            <h1 className="text-3xl font-bold mb-6 primary-text text-center">¡Bienvenido (a)!</h1>
            <p className="mb-6 font-bold secondary-text text-center">
              Para iniciar sesión, por favor introduce tus datos.
            </p>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="username" className="font-bold">Usuario</Label>
                <Input
                  id="username"
                  className="bg-[#f3f3f3] border-4 border-[#f3f3f3] rounded-lg"
                  placeholder="Nombre de usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="password" className="font-bold">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  className="bg-[#f3f3f3] border-4 border-[#f3f3f3] rounded-lg"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="flex justify-center">
                <Button
                  type="submit"
                  className="w-60px h-[45px] rounded-sm p-2 button-gradient text-black font-bold primary-text"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Ingresando...
                    </>
                  ) : (
                    <>
                      <img src="/icon_login.png" alt="login" width="50px" className="mr-2" />
                      Ingresar
                    </>
                  )}
                </Button>
              </div>
            </form>

            <a href="#"
              className="mt-6 text-sm text-black underline font-bold hover:underline block text-center tracking-wider"
              tabIndex={isLoading ? -1 : 0}
            >
              ¿Olvidaste tu usuario?
            </a>
          </div>
        </div>
      </div>
    </>
  );
};