// src/App.jsx
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

import Home from "./pages/Home";
import Collection from "./pages/Collection";
import Doctor from "./pages/Doctor";
import Support from "./pages/Support";
import About from "./pages/About";               // ← add this
import Appointment from "./pages/Appoinment";
import PatientForm from "./pages/PatientForm";
import PatientDetails from "./pages/PatientDetails";
import PatientUpdate from "./pages/PatientUpdate";
import Onlinepayment from "./pages/Onlinepayment";
import ProductDetail from "./pages/ProductDetail";
import ProductDashboard from "./pages/ProductDashboard";
import UpdateProduct from "./pages/UpdateProduct";

import UserMgt from "./pages/UserMgt";
import AdminDashboard from "./pages/AdminDashboard";
import UpdateUser from "./pages/UpdateUser";

import { useAuthStore } from "./store/authStore";

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

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <div className="min-h-screen min-w-screen bg-white relative overflow-hidden">
      <Navbar />

      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <Routes>
          {/* Auth entry */}
          <Route path="/" element={<LoginPage />} />

          {/* Dashboards */}
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/user-management" element={<UserMgt />} />
          <Route path="/dashboard/:id" element={<UpdateUser />} />
          <Route path="/product-dashboard" element={<ProductDashboard />} />

          {/* Role selection & signups */}
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

          {/* Approval Pending */}
          <Route path="/approval-pending" element={<ApprovalPendingPage />} />

          {/* Public pages */}
          <Route path="/home" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/product/:id" element={<ProductDetail />} />

          {/* ← Order here: Doctor → Support → About */}
          <Route path="/doctor" element={<Doctor />} />
          <Route path="/support" element={<Support />} />
          <Route path="/about" element={<About />} />

          {/* Doctor flows */}
          <Route path="/doctor/:docId" element={<Appointment />} />
          <Route path="/doctor/:docId/book/patientform" element={<PatientForm />} />
          <Route path="/doctor/:docId/book/patientdetails" element={<PatientDetails />} />
          <Route path="/doctor/:docId/book/patientupdate" element={<PatientUpdate />} />

          {/* Others */}
          <Route path="/update-product/:id" element={<UpdateProduct />} />
          <Route path="/onlinepayment" element={<Onlinepayment />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <Toaster />
    </div>
  );
}

export default App;
