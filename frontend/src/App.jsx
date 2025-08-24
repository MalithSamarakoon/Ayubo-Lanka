import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import FloatingShape from "./components/FloatingShape";
import Navbar from "./Component/Navbar";
import LoadingSpinner from "./components/LoadingSpinner";

import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import UserDashboard from "./pages/UserDashboard";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import RoleSelection from "./pages/RoleSelection";
import DoctorSignUpPage from "./pages/DoctorSignUpPage";
import SupplierSignUpPage from "./pages/SupplierSignUpPage";
import ApprovalPendingPage from "./pages/ApprovalPendingPage";

import Doctor from "./pages/Doctor";
import Home from "./pages/Home";
import Appointment from "./pages/Appoinment";
import PatientForm from "./pages/PatientForm";
import PatientDetails from "./pages/PatientDetails";
import PatientUpdate from "./pages/PatientUpdate";
import Onlinepayment from "./pages/Onlinepayment";

import { useAuthStore } from "./store/authStore";

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
    <div className="min-h-screen min-w-screen bg-gradient-to-br from-white via-green-100 to-emerald-300 relative overflow-hidden">
      {/* Floating background shapes */}
      <FloatingShape
        color="bg-green-500"
        size="w-64 h-64"
        top="-5%"
        left="10%"
        delay={0}
      />
      <FloatingShape
        color="bg-emerald-500"
        size="w-48 h-48"
        top="70%"
        left="80%"
        delay={5}
      />
      <FloatingShape
        color="bg-lime-500"
        size="w-32 h-32"
        top="40%"
        left="-10%"
        delay={2}
      />

      {/* Navbar always visible */}
      <Navbar />

      {/* Main content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <Routes>
          <Route path="/" element={<div>test</div>} />

          {/*  Dashboard */}
          <Route path="/dashboard" element={<UserDashboard />} />

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

          {/* Other Pages */}
          <Route path="/home" element={<Home />} />
          <Route path="/doctor" element={<Doctor />} />
          <Route path="/doctor/:docId" element={<Appointment />} />
          <Route
            path="/doctor/:docId/book/patientform"
            element={<PatientForm />}
          />
          <Route
            path="/doctor/:docId/book/patientdetails"
            element={<PatientDetails />}
          />
          <Route
            path="/doctor/:docId/book/patientupdate"
            element={<PatientUpdate />}
          />
          <Route path="/onlinepayment" element={<Onlinepayment />} />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <Toaster />
    </div>
  );
}

export default App;
