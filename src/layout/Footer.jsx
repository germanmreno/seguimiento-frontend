const year = new Date().getFullYear();

export const Footer = () => {
  return (
    <footer className="sticky top-[100vh] navbar-gradient w-[100%] h-[125px]min-w-[400px] lg:w-[100%] h-auto xl:h-[125px] p-2 flex justify-center border-t-4 border-gray-950 ">
      <div className="w-[80%] flex flex-col items-center">
        <div className="flex h-[40px]">
          <a target="_blank" href="https://www.facebook.com/CVMVenezuela/?locale=es_LA"><img src="/button_fb.png" alt="logo facebook" className="h-[40px] mx-1" /></a>
          <a target="_blank" href="https://www.instagram.com/cvm.venezuela/?hl=es"><img src="/button_ig.png" alt="logo instagram" className="h-[40px] mx-1" /></a>
          <a target="_blank" href="https://t.me/CVMVenezuela"><img src="/button_telegram.png" alt="logo telegram" className="h-[40px] mx-1" /></a>
        </div>
        <div className="flex text-center mt-2">
          <div className="flex flex-col text-center justify-center text-white p-0">
            <span className="primary-text text-sm ">CORPORACIÓN VENEZOLANA DE MINERÍA</span>
            <span className="secondary-text text-xs">Calle Cali entre Av. Veracruz y Av. Orinoco - Las Mercedes - Caracas - Venezuela.</span>
            <span className="secondary-text text-xs">Todos los derechos reservados. © COPYRIGHT {year}</span>
          </div>

        </div >

      </div >
    </footer >
  );
}