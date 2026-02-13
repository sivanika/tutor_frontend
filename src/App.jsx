import { BrowserRouter, Routes, Route } from "react-router-dom"
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
import StudentDashboardUI from "./components/student/StudentDashboardUI"
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
// import RegisterRole from "./pages/auth/RegisterRole";
import RegisterStudent from "./pages/auth/RegisterStudent";
import RegisterProfessor from "./pages/auth/RegisterProfessor";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Auth */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPassword />}
          />

          Student
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



          {/* Admin */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="logs" element={<AdminLogs />} />

            <Route path="verify" element={<ProfileVerification />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>



          <Route
            path="/chat/:sessionId"
            element={
              <ProtectedRoute>
                <SessionChat />
              </ProtectedRoute>
            }
          />
          {/* <Route path="/student/my-sessions" element={<MySessions />} /> */}
          <Route
            path="/chat/:sessionId"
            element={
              <ProtectedRoute>
                <SessionChat />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<StudentDashboard />} />
          {/* <Route path="/tutors/:id" element={<TutorProfilePage />} /> */}
          {/* <Route path="/chat" element={<ChatBot />} /> */}
          <Route
            path="/student/dashboard-ui"
            element={
              <ProtectedRoute role="student">
                <StudentDashboardUI />
              </ProtectedRoute>
            }
          />
          <Route path="/professor/onboarding" element={<ProfessorOnboarding />} />
          <Route path="/student/onboarding" element={<StudentOnboarding />} />

          <Route path="/verification-pending" element={<VerificationPending />} />

          <Route path="/professor/dashboard" element={<ProfessorDashboard />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route
            path="/admin/professors"
            element={
              <ProtectedRoute role="admin">
                <ProfessorApproval />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* <Route path="/register" element={<RegisterRole />} /> */}
          <Route path="/register/student" element={<RegisterStudent />} />
          <Route path="/register/professor" element={<RegisterProfessor />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
