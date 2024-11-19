import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "../components/ui/button"
import { ImageCarousel } from "../components/custom"
import { Layout } from "../layout/layout"
import { useAuth } from "../contexts/AuthContext";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog"
import { CheckCircle2 } from "lucide-react";
import { useViewTransition } from '../hooks/useViewTransition';

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

  const handleNavigation = (path) => {
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

      <ImageCarousel />
      <div className="flex space-x-16 justify-center items-center w-full mt-12">
        <Button
          variant="outline"
          className="flex flex-col h-36 w-52 rounded-lg p-1 button-gradient shadow-xl hover:scale-105 transition-transform"
          onClick={() => handleNavigation("/forums")}
        >
          <img src="/button_forums.png" alt="registro" className="h-[80px]" />
          <h1 className="primary-text text-lg mb-2">Foros</h1>
        </Button>
        <Button
          variant="outline"
          className="flex flex-col h-36 w-52 rounded-lg p-1 button-gradient shadow-xl hover:scale-105 transition-transform"
          onClick={() => handleNavigation("/memos")}
        >
          <img src="/button_add.png" alt="registro" className="h-[80px]" />
          <h2 className="primary-text text-lg mb-2">Oficios</h2>
        </Button>
      </div>
    </Layout>
  );
};
