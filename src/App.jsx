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
import AdminStudents from "./pages/admin/AdminStudents";
import AdminProfessors from "./pages/admin/AdminProfessors";
import AdminEarnings from "./pages/admin/AdminEarnings";
import AdminAnnouncements from "./pages/admin/AdminAnnouncements";
import AdminSubscriptions from "./pages/admin/AdminSubscriptions";
import RegisterStudent from "./pages/auth/RegisterStudent";
import RegisterProfessor from "./pages/auth/RegisterProfessor";
import AdminLogin from "./pages/auth/AdminLogin";
import Careers from "./pages/Careers";
import PaymentPage from "./pages/payment/PaymentPage";
import TutorProfilePage from "./pages/student/TutorProfilePage";
import LegalHub from "./pages/legal/LegalHub";
import Terms from "./pages/legal/Terms";
import Privacy from "./pages/legal/Privacy";
import RefundPolicy from "./pages/legal/RefundPolicy";
import CookiePolicy from "./pages/legal/DataCookies";
import TutorAgreementPage from "./pages/legal/TutorAgreement";
import InstitutionAgreement from "./pages/legal/InstitutionAgreement";
import StudentProfilePage from "./pages/professor/StudentProfilePage";

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
          <Route path="/tutor/:id" element={<TutorProfilePage />} />
          <Route path="/student/:id" element={<StudentProfilePage />} />
          <Route path="/professor/onboarding" element={<ProfessorOnboarding />} />
          <Route path="/student/onboarding" element={<StudentOnboarding />} />

          {/* Legal */}
          <Route path="/legal" element={<LegalHub />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/tutor-agreement" element={<TutorAgreementPage />} />
          <Route path="/institution-agreement" element={<InstitutionAgreement />} />

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
            <Route path="students" element={<AdminStudents />} />
            <Route path="professors" element={<AdminProfessors />} />
            <Route path="earnings" element={<AdminEarnings />} />
            <Route path="subscriptions" element={<AdminSubscriptions />} />
            <Route path="announcements" element={<AdminAnnouncements />} />
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
