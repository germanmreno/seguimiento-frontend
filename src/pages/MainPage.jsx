import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "../components/ui/button"
import { ImageCarousel } from "../components/custom"
import { Layout } from "../layout/layout"
import { useAuth } from "../contexts/AuthContext";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog"
import { CheckCircle2 } from "lucide-react";
import { useViewTransition } from '../hooks/useViewTransition';
import { memosService } from "@/services/memos.service";

export const MainPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [showDialog, setShowDialog] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const { startViewTransition } = useViewTransition();

  useEffect(() => {
    if (location.state?.showWelcome) {
      setWelcomeMessage(`¡Bienvenido ${location.state.userName}!`);
      setShowDialog(true);

      // Clear the location state
      window.history.replaceState({}, document.title);

      // Auto close after 2 seconds
      const timer = setTimeout(() => {
        setShowDialog(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [location]);

  const handleNavigation = async (path) => {
    if (path === "/memos" && user.role === 'ADMIN') {
      try {
        // Pre-fetch memos data before navigation
        await memosService.getAllMemosWithFilters(user);
      } catch (error) {
        console.error('Error pre-fetching memos:', error);
      }
    }

    startViewTransition(() => {
      navigate(path);
    });
  };

  return (
    <Layout>
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent className="max-w-[350px] text-center">
          <div className="flex flex-col items-center gap-4 py-4">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">
                Éxito
              </h2>
              <p className="text-gray-500">
                {welcomeMessage}
              </p>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex flex-col min-h-[calc(100vh-250px)]">
        <div className="flex-none w-full">
          <ImageCarousel />
        </div>

        <div className="flex-1 flex items-center justify-center w-full px-2">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-6 w-full max-w-[1200px]">
            <Button
              variant="outline"
              className="flex flex-col h-16 sm:h-32 md:h-36 
                       w-full sm:w-44 md:w-52 max-w-[280px]
                       rounded-lg p-1 button-gradient shadow-xl 
                       hover:scale-105 transition-transform"
              onClick={() => handleNavigation("/forums")}
            >
              <img
                src="/button_forums.png"
                alt="registro"
                className="h-[30px] sm:h-[60px] md:h-[80px] object-contain"
              />
              <h1 className="primary-text text-xs sm:text-base md:text-lg mb-1">
                Foros
              </h1>
            </Button>

            <Button
              variant="outline"
              className="flex flex-col h-16 sm:h-32 md:h-36 
                       w-full sm:w-44 md:w-72 max-w-[280px]
                       rounded-lg p-1 button-gradient shadow-xl 
                       hover:scale-105 transition-transform"
              onClick={() => handleNavigation("/memos")}
            >
              <img
                src="/button_add.png"
                alt="registro"
                className="h-[30px] sm:h-[60px] md:h-[80px] object-contain"
              />
              <h2 className="primary-text text-xs sm:text-base md:text-lg mb-1">
                Correspondencias
              </h2>
            </Button>

            {user.role === 'ADMIN' && (
              <Button
                variant="outline"
                className="flex flex-col h-16 sm:h-32 md:h-36 
                         w-full sm:w-44 md:w-52 max-w-[280px]
                         rounded-lg p-1 button-gradient shadow-xl 
                         hover:scale-105 transition-transform"
                onClick={() => handleNavigation("/admin")}
              >
                <img
                  src="/icon_support.png"
                  alt="admin"
                  className="h-[30px] sm:h-[60px] md:h-[80px] object-contain"
                />
                <h2 className="primary-text text-xs sm:text-base md:text-lg mb-1">
                  Administración
                </h2>
              </Button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};
