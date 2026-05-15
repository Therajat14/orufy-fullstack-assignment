import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ROUTES } from '../constants/routes'
import AppLayout from '../components/layout/AppLayout'
import LoginPage from '../pages/LoginPage'
import OTPPage from '../pages/OTPPage'
import SignupPage from '../pages/SignupPage'
import HomePage from '../pages/HomePage'
import ProductsPage from '../pages/ProductsPage'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to={ROUTES.LOGIN} replace />
}

function GuestRoute({ children }) {
  const { user } = useAuth()
  return !user ? children : <Navigate to={ROUTES.HOME} replace />
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.ROOT} element={<Navigate to={ROUTES.LOGIN} replace />} />

      <Route path={ROUTES.LOGIN} element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path={ROUTES.VERIFY_OTP} element={<GuestRoute><OTPPage /></GuestRoute>} />
      <Route path={ROUTES.SIGNUP} element={<GuestRoute><SignupPage /></GuestRoute>} />

      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.PRODUCTS} element={<ProductsPage />} />
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  )
}
