import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import ForgotPassword from "./pages/auth/ForgotPassword"
import ResetPassword from "./pages/auth/ResetPassword"
import ProfessorDashboard from "./pages/professor/ProfessorDashboard"
import StudentDashboard from "./pages/student/StudentDashboard"
import SessionChat from "./pages/chat/SessionChat"
import ProtectedRoute from "./components/ProtectedRoute"
import { AuthProvider } from "./context/AuthContext"
import AdminLayout from "./pages/admin/AdminLayout"
import ProfileVerification from "./pages/admin/ProfileVerification"
import UserManagement from "./pages/admin/UserManagement"
import Analytics from "./pages/admin/Analytics"
import Settings from "./pages/admin/Settings"
import AdminLogs from "./pages/admin/AdminLogs"
import ProfessorOnboarding from "./pages/professor/ProfessorOnboarding"
import StudentOnboarding from "./pages/student/StudentOnboarding"
import VerificationPending from "./pages/VerificationPending"
import ProfessorApproval from "./pages/admin/ProfessorApproval";
import AdminDashboard from "./pages/admin/AdminDashboard";
import RegisterStudent from "./pages/auth/RegisterStudent";
import RegisterProfessor from "./pages/auth/RegisterProfessor";
import AdminLogin from "./pages/auth/AdminLogin";
import Careers from "./pages/Careers";
import PaymentPage from "./pages/payment/PaymentPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/student" element={<RegisterStudent />} />
          <Route path="/register/professor" element={<RegisterProfessor />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verification-pending" element={<VerificationPending />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/professor/onboarding" element={<ProfessorOnboarding />} />
          <Route path="/student/onboarding" element={<StudentOnboarding />} />

          {/* Student */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute role="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          {/* Professor */}
          <Route
            path="/professor/dashboard"
            element={
              <ProtectedRoute role="professor">
                <ProfessorDashboard />
              </ProtectedRoute>
            }
          />

          {/* Chat */}
          <Route
            path="/chat/:sessionId"
            element={
              <ProtectedRoute>
                <SessionChat />
              </ProtectedRoute>
            }
          />

          {/* Admin — nested layout */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="logs" element={<AdminLogs />} />
            <Route path="verify" element={<ProfileVerification />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Admin professor approval */}
          <Route
            path="/admin/professors"
            element={
              <ProtectedRoute role="admin">
                <ProfessorApproval />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
