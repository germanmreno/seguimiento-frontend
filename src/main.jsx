import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { MainPage } from './MainPage.jsx'
import LoginPage from './LoginPage.jsx'
import { CreateForum } from './CreateForum'
import MemoTablePage from './MemoTablePage'

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
    path: "/createforum",
    element: (
      <CreateForum />
    ),
  },
  {
    path: "/memos",
    element: (
      <MemoTablePage />
    )
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
