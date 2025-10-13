import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import Navbar from "./Component/Navbar";
import Footer from "./Component/Fotter";
import LoadingSpinner from "./components/LoadingSpinner";
import Chatbot from "./components/Chatbot";

import { useAuthStore } from "./store/authStore";

// Pages
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
import DoctorPage from "./pages/DoctorPage";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import Support from "./pages/support";
import About from "./pages/About";
import Appointment from "./pages/Appoinment";
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

import TicketReview from "./pages/TicketReview";
import SupportReview from "./pages/SupportReview";
import FeedbackReview from "./pages/FeedbackReview";

import OrderForm from "./pages/OrderForm";
import OrdersList from "./pages/OrdersList";
import Cart from "./pages/Cart";
import OrderSuccess from "./pages/OrderSuccess";
import OrderDisplay from "./pages/OrderDisplay";
import OrdersupdateUser from "./pages/OrdersupdateUser";

// -------------------- Route Protection --------------------
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated && user?.isVerified)
    return <Navigate to="/home" replace />;
  return children;
};

// -------------------- Error Fallback --------------------

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

// -------------------- Main App --------------------
function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  const hideNavbarPaths = [
    "/login",
    "/signup",
    "/role-selection",
    "/doctor-signup",
    "/supplier-signup",
    "/verify-email",
    "/forgot-password",
    "/reset-password",
    "/approval-pending",
    "/admin-dashboard",
    "/user-management",
    "/dashboard/",
    "/product-dashboard",
    "/update-product",
    "/CheckAppoinments",
    "/admin/support-center",
    "/tickets/review",
    "/support/review",
    "/feedback/review",
  ];

  // Check if current path starts with any of the hidden paths
  const hideNavbar = hideNavbarPaths.some((path) =>
    location.pathname.startsWith(path.replace(/:.*$/, ""))
  );

  return (
    <div className="min-h-screen w-full bg-white relative">
      {!hideNavbar && <Navbar />}

      <div className="flex flex-col w-full items-center justify-center min-h-screen px-4">
        <Routes>
          {/* ---------- Public Routes ---------- */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/support" element={<Support />} />
          <Route path="/about" element={<About />} />
          <Route path="/doctor" element={<DoctorPage />} />
          <Route path="/doctor/:docId" element={<Appointment />} />

          {/* ---------- Auth Routes ---------- */}
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

          {/* ---------- Protected Dashboards ---------- */}
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

          {/* ---------- Product Management ---------- */}
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

          {/* ---------- Orders & Payments ---------- */}
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

          {/* ---------- Doctor Booking ---------- */}
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

          {/* ---------- Appointment Lists ---------- */}
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

          {/* ---------- Support & Reviews ---------- */}
          <Route
            path="/admin/support-center"
            element={
              <ProtectedRoute>
                <AdminSupportCenter />
              </ProtectedRoute>
            }
          />
          <Route path="/tickets/review/:id" element={<TicketReview />} />
          <Route path="/support/review/:id" element={<SupportReview />} />
          <Route path="/feedback/review/:id" element={<FeedbackReview />} />
          <Chatbot />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <Toaster position="top-right" />
      {!hideNavbar && <Footer />}
    </div>
  );
}

export default App;
