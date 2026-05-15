import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import OTPPage from './pages/OTPPage'
import AppLayout from './components/layout/AppLayout'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function GuestRoute({ children }) {
  const { user } = useAuth()
  return !user ? children : <Navigate to="/home" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/login" element={
            <GuestRoute><LoginPage /></GuestRoute>
          } />
          <Route path="/verify-otp" element={
            <GuestRoute><OTPPage /></GuestRoute>
          } />

          <Route element={
            <ProtectedRoute><AppLayout /></ProtectedRoute>
          }>
            <Route path="/home" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
