import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import { useViewTransition } from '../hooks/useViewTransition';
import { NotificationBell } from '../components/custom/NotificationBell';
import { User } from 'lucide-react';

export const NavBar = () => {
  const navigate = useNavigate();
  const { startViewTransition } = useViewTransition();
  const { user, handleLogout } = useAuth();

  if (!user) {
    return null;
  }

  const handleNavigation = (path) => {
    startViewTransition(() => {
      navigate(path);
    });
  };

  return (
    <nav className="navbar navbar-light navbar-gradient m-0 min-w-[400px] lg:w-[100%] h-auto xl:h-[125px] p-2 flex justify-center border-b-4 border-gray-950">
      <div className="w-[80%] flex flex-col xl:flex-row justify-between items-center">
        <div className="flex xl:ml-11">
          <img src="/logo_gob.webp" alt="logo gobierno" className="h-[90px] mx-4" />
          <div className="inline-block h-[90px] min-h-[1em] w-0.5 self-stretch separator-gradient"></div>
          <img src="/logo_cvm.webp" alt="logo cvm" className="h-[90px] mx-4" />
          <div className="inline-block h-[90px] xl:hidden min-h-[1em] w-0.5 self-stretch separator-gradient"></div>
          <img src="/logo_batalla.webp" alt="logo cvm" className="h-[90px] mx-4 mr-11 xl:hidden" />
        </div>
        <div className="flex mt-8 xl:mt-0 text-center justify-center items-end text-white">
          <div className="flex flex-col lg:flex-row text-center justify-center items-end text-white p-0">
            <Button
              variant="transparent"
              className="flex justify-center items-center p-2"
              onClick={() => handleNavigation("/home")}
            >
              <img src="/icon_home.webp" alt="registro" className="h-[50px]" />
              <span className="primary-text">INICIO</span>
            </Button>
            <Button
              variant="transparent"
              className="flex justify-center items-center p-2"
              onClick={handleLogout}
            >
              <img src="/icon_out.png" alt="registro" className="h-[50px]" />
              <span className="primary-text">SALIR</span>
            </Button>
            <div className="hidden xl:flex flex-col items-end mr-4 ml-2">
              <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/10">
                <div className="flex flex-col items-end">
                  <p className="text-xs font-semibold primary-text">
                    {user?.firstName.toUpperCase()} {user?.lastName.toUpperCase()}
                  </p>
                  <p className="text-xs primary-text opacity-80">
                    {user?.role === 'ADMIN' ? 'ADMINISTRADOR' : 'USUARIO'}
                  </p>
                  <p className="text-[10px] primary-text opacity-60">
                    {user?.username}
                  </p>
                </div>
                <div className="bg-white/20 rounded-full p-2">
                  <User className="h-6 w-6 text-white/80" />
                </div>
              </div>
            </div>
            <NotificationBell />
            <div className="ml-4 h-[90px] hidden xl:inline-block min-h-[1em] w-0.5 self-stretch separator-gradient"></div>
            <img src="/logo_batalla.png" alt="logo cvm" className="h-[90px] mx-4 xl:mr-11 hidden xl:block" />
          </div>
        </div>
      </div>
    </nav>
  );
};