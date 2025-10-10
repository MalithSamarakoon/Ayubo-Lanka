// src/App.jsx
import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { ErrorBoundary } from "react-error-boundary";

import Navbar from "./Component/Navbar";
import Footer from "./Component/Fotter";
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
import Support from "./pages/support";
import About from "./pages/About";
import Appointment from "./pages/Appoinment"; // keep your spelling
import AdminDashboard from "./pages/AdminDashboard";

import PatientForm from "./pages/PatientForm";
import PatientDetails from "./pages/PatientDetails";
import PatientUpdate from "./pages/PatientUpdate";
import UploadSlip from "./pages/UploadSlip";
import Onlinepayment from "./pages/Onlinepayment";

import ProductDetail from "./pages/ProductDetail";
import ProductDashboard from "./pages/ProductDashboard";
import UpdateProduct from "./pages/UpdateProduct";

import UserMgt from "./pages/UserMgt";
import UpdateUser from "./pages/UpdateUser";
import CheckAppoinments from "./pages/CheckAppoinments";
import MyAppoinment from "./pages/MyAppoinment";
import AdminSupportCenter from "./pages/AdminSupportCenter";
// Review pages
import TicketReview from "./pages/TicketReview";
import SupportReview from "./pages/SupportReview";
import FeedbackReview from "./pages/FeedbackReview";

// Orders & Cart pages
import OrderForm from "./pages/OrderForm";
import OrdersList from "./pages/OrdersList";
import Cart from "./pages/Cart";
import OrderSuccess from "./pages/OrderSuccess";
import OrderDisplay from "./pages/OrderDisplay";
import OrdersupdateUser from "./pages/OrdersupdateUser";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user?.isVerified) return <Navigate to="/verify-email" replace />;
  return children;
};

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated && user?.isVerified)
    return <Navigate to="/home" replace />;
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

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <ErrorBoundary FallbackComponent={AppErrorFallback}>
      <div className="min-h-screen w-full bg-white relative">
        <Navbar />

        <div className="flex flex-col w-full items-center justify-center min-h-screen px-4">
          <Routes>
            {/* Auth entry */}
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={
                <RedirectAuthenticatedUser>
                  <LoginPage />
                </RedirectAuthenticatedUser>
              }
            />
            <Route
              path="/signup"
              element={
                <RedirectAuthenticatedUser>
                  <SignUpPage />
                </RedirectAuthenticatedUser>
              }
            />
            {/* Role-driven signup aliases */}
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
            <Route
              path="/role-selection"
              element={
                <RedirectAuthenticatedUser>
                  <RoleSelection />
                </RedirectAuthenticatedUser>
              }
            />
            <Route
              path="/doctor-signup"
              element={
                <RedirectAuthenticatedUser>
                  <DoctorSignUpPage />
                </RedirectAuthenticatedUser>
              }
            />
            <Route
              path="/supplier-signup"
              element={
                <RedirectAuthenticatedUser>
                  <SupplierSignUpPage />
                </RedirectAuthenticatedUser>
              }
            />

            {/* Public browse pages */}
            <Route path="/home" element={<Home />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/support" element={<Support />} />
            <Route path="/about" element={<About />} />
            <Route path="/doctor" element={<Doctor />} />
            {/* doctor public entry */}
            <Route path="/doctor/:docId" element={<Appointment />} />

            {/* Dashboards / protected */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-management"
              element={
                <ProtectedRoute>
                  <UserMgt />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/:id"
              element={
                <ProtectedRoute>
                  <UpdateUser />
                </ProtectedRoute>
              }
            />

            {/* Products */}
            <Route
              path="/product-dashboard"
              element={
                <ProtectedRoute>
                  <ProductDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/update-product/:id"
              element={
                <ProtectedRoute>
                  <UpdateProduct />
                </ProtectedRoute>
              }
            />

            {/* Orders & Payments */}
            <Route
              path="/order-form"
              element={
                <ProtectedRoute>
                  <OrderForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <OrdersList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orderdisplay/:id"
              element={
                <ProtectedRoute>
                  <OrderDisplay />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orderupdateuser/:id"
              element={
                <ProtectedRoute>
                  <OrdersupdateUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onlinepayment"
              element={
                <ProtectedRoute>
                  <Onlinepayment />
                </ProtectedRoute>
              }
            />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/cart" element={<Cart />} />

            {/* Auth helpers */}
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
            <Route path="/approval-pending" element={<ApprovalPendingPage />} />

            {/* Doctor nested protected */}
            <Route
              path="/doctor/:docId/book/patientform"
              element={
                <ProtectedRoute>
                  <PatientForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/:docId/book/patientdetails"
              element={
                <ProtectedRoute>
                  <PatientDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/:docId/book/patientdetails/slip"
              element={
                <ProtectedRoute>
                  <UploadSlip />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/:docId/book/patientupdate"
              element={
                <ProtectedRoute>
                  <PatientUpdate />
                </ProtectedRoute>
              }
            />

            {/* Appointment overviews */}
            <Route
              path="/CheckAppoinments"
              element={
                <ProtectedRoute>
                  <CheckAppoinments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my_appoinments"
              element={
                <ProtectedRoute>
                  <MyAppoinment />
                </ProtectedRoute>
              }
            />

            {/* Support admin center */}
            <Route
              path="/admin/support-center"
              element={
                <ProtectedRoute>
                  <AdminSupportCenter />
                </ProtectedRoute>
              }
            />

            {/* Review pages (after submit redirects) */}
            <Route path="/tickets/review/:id" element={<TicketReview />} />
            <Route path="/support/review/:id" element={<SupportReview />} />
            <Route path="/feedback/review/:id" element={<FeedbackReview />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        <Toaster position="top-right" />
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;
