import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import './index.css'
import { MainPage, LoginPage, RegisterMemoPage } from './pages'
import { CreateForumPage } from './pages/CreateForumPage'
import { ForumPage } from './pages/ForumPage'
import { CheckForumPage } from './pages/CheckForumPage'
import { AssignInstructionPage } from './pages/AssignInstructionPage'
import { AuthProvider } from './contexts/AuthContext'
import { PrivateRouter } from './components/PrivateRouter'
import { ForumsPage } from './pages/ForumsPage'
import { AdministrationPanel } from './pages/AdministrationPanel'
import { MemoTabs } from './components/admin/MemoTabs'
import { MemoDetailsPage } from './pages/MemoDetailsPage'
import { MemoExcelPage } from './pages/MemoExcelPage'
import { ErrorBoundary } from './components/ErrorBoundary'
import { SendMemoPage } from './pages/SendMemoPage'
import { VerifyMemoPage } from './pages/VerifyMemoPage'
import { PuntosCuentaPage } from './pages/PuntosCuentaPage'
import { RegisterPuntoCuentaPage } from './pages/RegisterPuntoCuentaPage'
import { OficiosPresidenciaPage } from './pages/OficiosPresidenciaPage'
import { RegisterOficioPresidenciaPage } from './pages/RegisterOficioPresidenciaPage'

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    element: <PrivateRouter />,
    children: [
      {
        path: "/home",
        element: <MainPage />
      },
      {
        path: "/memos",
        element: <MemoTabs />
      },
      {
        path: "/memos/:id/details",
        element: <MemoDetailsPage />,
      },
      {
        path: "/register-memo",
        element: <RegisterMemoPage />
      },
      {
        path: "/send-memo",
        element: <SendMemoPage />
      },
      {
        path: "/memos/:id/assign-instruction",
        element: <AssignInstructionPage />
      },
      {
        path: "/create-forum/:id",
        element: <CreateForumPage />
      },
      {
        path: "/forums/:id",
        element: <ForumPage />
      },
      {
        path: "/check-forum/:id",
        element: <CheckForumPage />
      },
      {
        path: "/forums",
        element: <ForumsPage />
      },
      {
        path: "/admin",
        element: <AdministrationPanel />
      },
      {
        path: "/memos/:id/excel",
        element: <MemoExcelPage />
      },
      {
        path: "/puntos-cuenta",
        element: <PuntosCuentaPage />
      },
      {
        path: "/register-punto-cuenta",
        element: <RegisterPuntoCuentaPage />
      },
      {
        path: "/oficios-presidencia",
        element: <OficiosPresidenciaPage />
      },
      {
        path: "/register-oficio-presidencia",
        element: <RegisterOficioPresidenciaPage />
      }
    ]
  },
  {
    path: "/verify/:id",
    element: <VerifyMemoPage />
  },
  {
    path: "*",
    element: <Navigate to="/" replace />
  }
]);

export const App = () => (
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>
);

createRoot(document.getElementById('root')).render(<App />);
