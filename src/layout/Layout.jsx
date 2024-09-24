import { Footer } from "@/Footer"
import { NavBar } from "@/NavBar"


export const Layout = ({ children, background = "bg-cover" }) => {
  return (
    <div className={`min-h-[100vh] w-full ${background} bg-no-repeat bg-center`} style={{ backgroundImage: `url(/background_logo.png)` }} >
      <NavBar />
      {children}
      <Footer />
    </div>
  )
}
