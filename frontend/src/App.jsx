import { Navigate, Route, Routes } from 'react-router-dom';
import FloatingShape from "./components/FloatingShape";
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import EmailVerificationPage from './pages/EmailVerificationPage';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';
import UserDashboard from './pages/UserDashboard';
import LoadingSpinner from './components/LoadingSpinner';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import RoleSelection from './pages/RoleSelection';
import DoctorSignUpPage from "./pages/DoctorSignUpPage";
import SupplierSignUpPage from "./pages/SupplierSignUpPage";
import ApprovalPendingPage from './pages/ApprovalPendingPage';

// Protected route: only authenticated and verified users can access
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user?.isVerified) return <Navigate to="/verify-email" replace />;

  return children;
};

// Redirect authenticated users away from auth pages
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user?.isVerified) return <Navigate to="/" replace />;

  return children;
};

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 relative overflow-hidden flex items-center justify-center">
      {/* Floating background shapes */}
      <FloatingShape color="bg-green-500" size="w-64 h-64" top="-5%" left="10%" delay={0} />
      <FloatingShape color="bg-emerald-500" size="w-48 h-48" top="70%" left="80%" delay={5} />
      <FloatingShape color="bg-lime-500" size="w-32 h-32" top="40%" left="-10%" delay={2} />

      <Routes>
        {/* Default Dashboard */}
        <Route
          path="/"
          element={
            // <ProtectedRoute>
              <UserDashboard />
            // </ProtectedRoute>
          }
        />

        {/* Role Selection */}
        <Route
          path="/signup"
          element={
            <RedirectAuthenticatedUser>
              <RoleSelection />
            </RedirectAuthenticatedUser>
          }
        />

        {/* Signups */}
        <Route
          path="/signup/user"
          element={
            <RedirectAuthenticatedUser>
              <SignUpPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/signup/doctor"
          element={
            <RedirectAuthenticatedUser>
              <DoctorSignUpPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/signup/supplier"
          element={
            <RedirectAuthenticatedUser>
              <SupplierSignUpPage />
            </RedirectAuthenticatedUser>
          }
        />

        {/* Auth */}
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <LoginPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route
          path="/forgot-password"
          element={
            <RedirectAuthenticatedUser>
              <ForgotPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <RedirectAuthenticatedUser>
              <ResetPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />

        {/* Approval Pending */}
        <Route path="/approval-pending" element={<ApprovalPendingPage />} />

        {/* Fallback route for unmatched paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
