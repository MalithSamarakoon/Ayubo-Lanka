// src/App.jsx
import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ErrorBoundary } from "react-error-boundary";

import Navbar from "./Component/Navbar";
import Footer from "./Component/Fotter"; // keep path as your file name
import LoadingSpinner from "./components/LoadingSpinner";

import { useAuthStore } from "./store/authStore";

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

import Home from "./pages/Home";
import Collection from "./pages/Collection";
import Doctor from "./pages/Doctor";
import Support from "./pages/Support";
import About from "./pages/About";
import Appointment from "./pages/Appoinment";
import PatientForm from "./pages/PatientForm";
import PatientDetails from "./pages/PatientDetails";
import PatientUpdate from "./pages/PatientUpdate";
import UploadSlip from "./pages/UploadSlip";
import Onlinepayment from "./pages/Onlinepayment";
import ProductDetail from "./pages/ProductDetail";
import ProductDashboard from "./pages/ProductDashboard";
import UpdateProduct from "./pages/UpdateProduct";

import UserMgt from "./pages/UserMgt";
import AdminDashboard from "./pages/AdminDashboard";
import UpdateUser from "./pages/UpdateUser";
import CheckAppoinments from "./pages/CheckAppoinments";
import MyAppoinment from "./pages/MyAppoinment";

// ---------- helpers ----------
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user?.isVerified) return <Navigate to="/verify-email" replace />;
  return children;
};

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated && user?.isVerified) return <Navigate to="/" replace />;
  return children;
};

function AppErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div style={{ padding: 16 }}>
      <h2>Something went wrong</h2>
      <pre style={{ whiteSpace: "pre-wrap" }}>
        {error?.stack || String(error)}
      </pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

// ---------- app ----------
function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <div className="min-h-screen w-full bg-white relative">
      <Navbar />
      <ErrorBoundary
        FallbackComponent={AppErrorFallback}
        onReset={() => window.location.reload()}
      >
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/support" element={<Support />} />
            <Route path="/about" element={<About />} />

            {/* Doctor */}
            <Route path="/doctor" element={<Doctor />} />
            <Route path="/doctor/:docId" element={<Appointment />} />
            <Route path="/doctor/:docId/book/patientform" element={<PatientForm />} />
            <Route path="/doctor/:docId/book/patientdetails" element={<PatientDetails />} />
            <Route
              path="/doctor/:docId/book/patientdetails/slip"
              element={<UploadSlip />}
            />
            <Route path="/doctor/:docId/book/patientupdate" element={<PatientUpdate />} />

            {/* Auth helpers */}
            <Route path="/verify-email" element={<EmailVerificationPage />} />
            <Route
              path="/login"
              element={
                <RedirectAuthenticatedUser>
                  <LoginPage />
                </RedirectAuthenticatedUser>
              }
            />
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

            {/* Sign-ups */}
            <Route
              path="/signup"
              element={
                <RedirectAuthenticatedUser>
                  <RoleSelection />
                </RedirectAuthenticatedUser>
              }
            />
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

            {/* Dashboards / protected */}
            <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
            <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/user-management" element={<ProtectedRoute><UserMgt /></ProtectedRoute>} />
            <Route path="/dashboard/:id" element={<ProtectedRoute><UpdateUser /></ProtectedRoute>} />
            <Route path="/product-dashboard" element={<ProtectedRoute><ProductDashboard /></ProtectedRoute>} />
            <Route path="/update-product/:id" element={<ProtectedRoute><UpdateProduct /></ProtectedRoute>} />
            <Route path="/CheckAppoinments" element={<ProtectedRoute><CheckAppoinments /></ProtectedRoute>} />
            <Route path="/my_appoinments" element={<ProtectedRoute><MyAppoinment /></ProtectedRoute>} />

            {/* Misc */}
            <Route path="/onlinepayment" element={<Onlinepayment />} />
            <Route path="/approval-pending" element={<ApprovalPendingPage />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </ErrorBoundary>
      <Toaster />
      <Footer />
    </div>
  );
}

export default App;
