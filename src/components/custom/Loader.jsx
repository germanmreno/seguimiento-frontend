export const Loader = ({ message = "CARGANDO..." }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[9999]">
      <div className="bg-white/90 rounded-lg p-8 shadow-2xl flex flex-col items-center max-w-sm w-full mx-4">
        <div className="relative w-40 h-40 mb-4">
          <div className="absolute inset-0 animate-spin">
            <img
              src="/spin_loader.webp"
              alt="Spinning gear"
              width={256}
              height={256}
              className="w-full h-full"
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="/logo_loader.webp"
              alt="CVM Logo"
              width={200}
              height={200}
              className="w-3/4 h-3/4"
            />
          </div>
        </div>
        <p className="text-lg font-semibold primary-text text-center">{message}</p>
      </div>
    </div>
  );
};
