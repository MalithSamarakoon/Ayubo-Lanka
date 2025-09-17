import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
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
import AdminDashboard from "./pages/AdminDashboard";
import PatientForm from "./pages/PatientForm";
import PatientDetails from "./pages/PatientDetails";
import PatientUpdate from "./pages/PatientUpdate";
import Onlinepayment from "./pages/Onlinepayment";
import UserMgt from "./pages/UserMgt";
import ProductDashboard from "./pages/ProductDashboard";
import { useAuthStore } from "./store/authStore";
import UpdateUser from "./pages/UpdateUser";

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
    <div>
      {/* === Background layer (subtle, premium look) === */}
      <div />
      {/* soft vignette */}
      <div />
      {/* grid accent */}
      <div />
      {/* Navbar always visible (sticky for better UX) */}
      <header>
        <div>
          <Navbar />
        </div>
      </header>

      {/* Main content container */}
      <main className="relative">
        {/* decorative blur blobs */}
        <div className="pointer-events-none absolute -top-10 right-[-8%] h-[22rem] w-[22rem] rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="pointer-events-none absolute top-[35%] left-[-10%] h-[24rem] w-[24rem] rounded-full bg-amber-300/20 blur-3xl" />

        {/* page content wrapper */}
        <div className="mx-auto max-w-7xl w-full px-3 sm:px-6 lg:px-8 py-8">
          {/* page card (gives consistent spacing & elevation) */}
          <div className="rounded-2xl border border-emerald-100/60 bg-white/80 backdrop-blur-xl shadow-[0_10px_30px_rgba(16,185,129,0.08)]">
            <div className="p-4 sm:p-6 lg:p-8">
              <Routes>
                {/* Landing — keep or swap with <Home /> */}
                <Route path="/" element={<LoginPage />} />

                {/* Dashboards */}
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/user-management" element={<UserMgt />} />
                <Route path="/dashboard/:id" element={<UpdateUser />} />
                <Route
                  path="/product-dashboard"
                  element={<ProductDashboard />}
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
                <Route
                  path="/verify-email"
                  element={<EmailVerificationPage />}
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

                {/* Approval Pending */}
                <Route
                  path="/approval-pending"
                  element={<ApprovalPendingPage />}
                />

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
                <Route
                  path="/doctor/:docId/book/onlinepayment"
                  element={<Onlinepayment />}
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </div>
        </div>
      </main>

      {/* Toaster: refined look */}
      <Toaster
        toastOptions={{
          className:
            "rounded-xl bg-white/90 backdrop-blur-md shadow-lg border border-emerald-100 text-slate-800",
          style: { fontWeight: 600 },
        }}
        position="top-center"
      />
    </div>
  );
}

export default App;
