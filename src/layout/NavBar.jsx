import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";

export const NavBar = () => {
  const navigate = useNavigate()

  return (
    <nav className="navbar navbar-light navbar-gradient m-0 min-w-[400px] lg:w-[100%] h-auto xl:h-[125px] p-2 flex justify-center border-b-4 border-gray-950 ">
      <div className="w-[80%] flex flex-col xl:flex-row justify-between items-center">
        <div className="flex xl:ml-11">
          <img src="/logo_gob.png" alt="logo gobierno" className="h-[90px] mx-4" />
          <div
            className="inline-block h-[90px] min-h-[1em] w-0.5 self-stretch separator-gradient"></div>
          <img src="/logo_cvm.png" alt="logo cvm" className="h-[90px] mx-4" />
          <div
            className="inline-block h-[90px] xl:hidden  min-h-[1em] w-0.5 self-stretch separator-gradient "></div>
          <img src="/logo_batalla.png" alt="logo cvm" className="h-[90px] mx-4 mr-11 xl:hidden " />

        </div>
        <div className="flex mt-8 xl:mt-0 lg:mr-11 text-center justify-center items-end text-white">
          <div className="flex flex-col lg:flex-row text-center justify-center items-end text-white p-0">
            <Button variant="transparent" className="flex justify-center items-center p-2" onClick={() => navigate("/home")}>
              <img src="/icon_home.png" alt="registro" className="h-[50px]" />
              <span className="primary-text">INICIO</span>
            </Button>
            <Button variant="transparent" className="flex justify-center items-center p-2" onClick={() => navigate("/")}>
              <img src="/icon_out.png" alt="registro" className="h-[50px]" />
              <span className="primary-text">SALIR</span>
            </Button>
            <Button variant="transparent" className="flex justify-center items-center p-2 xl:pr-6" >
              <img src="/icon_support.png" alt="registro" className="h-[50px]" />
              <span className="primary-text">SOPORTE</span>
            </Button>
          </div>

          <div
            className=" h-[90px] hidden xl:inline-block  min-h-[1em] w-0.5 self-stretch separator-gradient "></div>
          <img src="/logo_batalla.png" alt="logo cvm" className="h-[90px] mx-4 xl:mr-11 hidden xl:block " />
        </div>
      </div>
    </nav>
  );
}