const year = new Date().getFullYear();

export const Footer = () => {
  return (
    <footer className="mt-auto w-full min-h-[125px] p-4 flex justify-center border-t-4 border-gray-950 navbar-gradient">
      <div className="w-full md:w-[90%] lg:w-[80%] flex flex-col items-center">
        <div className="flex h-[40px] gap-2">
          <a target="_blank" href="https://www.facebook.com/CVMVenezuela/?locale=es_LA" className="hover:opacity-80 transition-opacity">
            <img src="/button_fb.png" alt="logo facebook" className="h-[40px]" />
          </a>
          <a target="_blank" href="https://www.instagram.com/cvm.venezuela/?hl=es" className="hover:opacity-80 transition-opacity">
            <img src="/button_ig.png" alt="logo instagram" className="h-[40px]" />
          </a>
          <a target="_blank" href="https://t.me/CVMVenezuela" className="hover:opacity-80 transition-opacity">
            <img src="/button_telegram.png" alt="logo telegram" className="h-[40px]" />
          </a>
        </div>
        <div className="flex text-center mt-4">
          <div className="flex flex-col text-center justify-center text-white">
            <span className="primary-text text-sm">CORPORACIÓN VENEZOLANA DE MINERÍA</span>
            <span className="secondary-text text-xs px-4">Calle Cali entre Av. Veracruz y Av. Orinoco - Las Mercedes - Caracas - Venezuela.</span>
            <span className="secondary-text text-xs">Todos los derechos reservados. © COPYRIGHT {year}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}