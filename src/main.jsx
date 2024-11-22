import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import './index.css'
import { MainPage, LoginPage, RegisterMemoPage, MemoTablePage } from './pages'
import { CreateForumPage } from './pages/CreateForumPage'
import { ForumPage } from './pages/ForumPage'
import { CheckForumPage } from './pages/CheckForumPage'
import { AssignInstructionPage } from './pages/AssignInstructionPage'
import { AuthProvider } from './contexts/AuthContext'
import { PrivateRouter } from './components/PrivateRouter'
import { ForumsPage } from './pages/ForumsPage'
import { AdministrationPanel } from './pages/AdministrationPanel'

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
        element: <MemoTablePage />
      },
      {
        path: "/register-memo",
        element: <RegisterMemoPage />
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
      }
    ]
  },
  {
    path: "*",
    element: <Navigate to="/" replace />
  }
]);

export const App = () => (
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);

createRoot(document.getElementById('root')).render(<App />);
