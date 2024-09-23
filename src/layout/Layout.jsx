import { Footer } from "@/Footer"
import { NavBar } from "@/NavBar"


export const Layout = ({ children }) => {
  return (
    <div className="h-screen w-full bg-cover bg-no-repeat" style={{ backgroundImage: `url(/background_logo.png)` }} >
      <NavBar />
      {children}
      <Footer />
    </div>
  )
}
