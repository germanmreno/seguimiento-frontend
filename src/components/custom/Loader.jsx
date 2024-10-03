export const Loader = () => {

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80">
      <div className="flex flex-col items-center">
        <div className="relative w-52 h-52 mb-4">
          <div className="absolute inset-0 animate-spin">
            <img
              src="/spin_loader.png"
              alt="Spinning gear"
              width={256}
              height={256}
              className="w-full h-full"
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="/logo_loader.png"
              alt="CVM Logo"
              width={200}
              height={200}
              className="w-3/4 h-3/4"
            />
          </div>
        </div>
        <p className="text-lg primary-text">CARGANDO...</p>
      </div>
    </div >
  )
}
