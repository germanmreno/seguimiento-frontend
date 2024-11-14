import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { MainPage, LoginPage, RegisterMemoPage, MemoTablePage } from './pages'
import { CreateForumPage } from './pages/CreateForumPage'
import { ForumPage } from './pages/ForumPage'
import { CheckForumPage } from './pages/CheckForumPage'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'

// Create a wrapper component to provide auth context
const AppWrapper = ({ children }) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <AppWrapper>
          <MainPage />
        </AppWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: "/memos",
    element: (
      <AppWrapper>
        <MemoTablePage />
      </AppWrapper>
    )
  },
  {
    path: "/register-memo",
    element: (
      <AppWrapper>
        <RegisterMemoPage />
      </AppWrapper>
    )
  },
  {
    path: "/create-forum/:id",
    element: (
      <AppWrapper>
        <CreateForumPage />
      </AppWrapper>
    )
  },
  {
    path: "/forums/:id",
    element: (
      <ProtectedRoute>
        <AppWrapper>
          <ForumPage />
        </AppWrapper>
      </ProtectedRoute>
    )
  },
  {
    path: "/check-forum/:id",
    element: (
      <AppWrapper>
        <CheckForumPage />
      </AppWrapper>
    )
  }
]);

// Wrap the RouterProvider with AuthProvider to make auth available globally
const App = () => (
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);

createRoot(document.getElementById('root')).render(<App />);
