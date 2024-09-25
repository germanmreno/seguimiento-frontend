import { Footer } from "./Footer"
import { NavBar } from "./NavBar"


export const Layout = ({ children }) => {
  return (
    <div className={`min-h-[100vh] w-full bg-cover bg-scroll bg-no-repeat bg-center`} style={{ backgroundImage: `url(/background_logo.png)` }} >
      <NavBar />
      {children}
      <Footer />
    </div>
  )
}
