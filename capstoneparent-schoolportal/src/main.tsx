import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Announcements } from './pages/Announcements'
import { ForgotPassword } from './pages/ForgotPassword'
import { HomePage } from './pages/HomePage'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { usePageTitle } from './hooks/usePageTitle'
import './styles/index.css'

const App = () => {
  usePageTitle()

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/announcements" element={<Announcements />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)