import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { MainPage, LoginPage, RegisterMemoPage, MemoTablePage } from './pages'
import { CreateForumPage } from './pages/CreateForumPage'
import { ForumPage } from './pages/ForumPage'
import { CheckForumPage } from './pages/CheckForumPage'

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/home",
    element: (
      <MainPage />
    ),
  },
  {
    path: "/memos",
    element: (
      <MemoTablePage />
    )
  },
  {
    path: "/register-memo",
    element: (
      <RegisterMemoPage />
    )
  },
  {
    path: "/create-forum/:id",
    element: (
      <CreateForumPage />
    )
  },
  {
    path: "/forums/:id",
    element: (
      <ForumPage />
    )
  },
  {
    path: "/check-forum/:id",
    element: (
      <CheckForumPage />
    )
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
