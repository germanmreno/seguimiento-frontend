import { Toaster } from "@/components/ui/sonner"
import { Footer } from "./Footer"
import { NavBar } from "./NavBar"
import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"

export const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/home";

  const handleBack = () => {
    // Check if we're in a forum detail page
    if (location.pathname.startsWith('/forums/') && location.pathname !== '/forums') {
      navigate('/forums', { replace: true }); // Use replace to remove the current page from history
    } else if (location.pathname === '/forums') {
      navigate('/home', { replace: true }); // When in forums list, go home
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={`min-h-[100vh] w-full bg-cover bg-scroll bg-no-repeat bg-center`} style={{ backgroundImage: `url(/background_logo.png)` }} >
      <NavBar />
      {!isHomePage && (
        <div className="container mx-auto pt-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeOut"
            }}
          >
            <Button
              variant="ghost"
              className="group relative flex items-center gap-3 px-4 py-2 text-primary-blue 
                         hover:text-primary-blue hover:bg-primary-blue/5 
                         transition-all duration-300 ease-in-out
                         shadow-sm hover:shadow-md
                         border border-primary-blue/20 hover:border-primary-blue/40
                         rounded-lg"
              onClick={handleBack}
            >
              <motion.span
                className="inline-block"
                initial={{ x: 0 }}
                whileHover={{ x: -4 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowLeft className="h-5 w-5" />
              </motion.span>
              <span className="font-medium">Volver</span>
            </Button>
          </motion.div>
        </div>
      )}
      {children}
      <Toaster />
      <Footer />
    </div>
  )
}