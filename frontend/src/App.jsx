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
import Doctor from "./pages/Doctor";
import Home from "./pages/Home";
import Appointment from "./pages/Appoinment"; // keep spelling as in your file
import AdminDashboard from "./pages/AdminDashboard";
import PatientForm from "./pages/PatientForm";
import PatientDetails from "./pages/PatientDetails";
import PatientUpdate from "./pages/PatientUpdate";
import Onlinepayment from "./pages/Onlinepayment";
import UserMgt from "./pages/UserMgt";
import ProductDashboard from "./pages/ProductDashboard";
import UpdateProduct from "./pages/UpdateProduct";
import UpdateUser from "./pages/UpdateUser";
import UploadSlip from "./pages/UploadSlip";
import CheckAppoinments from "./pages/CheckAppoinments";
import MyAppoinment from "./pages/MyAppoinment";
import Footer from "./Component/Fotter";
import Collection from "./pages/Collection";
import ProductDetail from "./pages/ProductDetail";
import OrderForm from "./pages/OrderForm";
import OrdersList from "./pages/OrdersList";
import Cart from "./pages/Cart";
import OrderSuccess from "./pages/OrderSuccess";
import OrderDisplay from "./pages/OrderDisplay";
import OrdersupdateUser from "./pages/OrdersupdateUser";
import { useAuthStore } from "./store/authStore";

// ------- Guards -------
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user?.isVerified) return <Navigate to="/verify-email" replace />;
  return children;
};

// Redirect authenticated users away from auth pages → to /home
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated && user?.isVerified) return <Navigate to="/home" replace />;
  return children;
};

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <div className="min-h-screen w-full bg-white relative">
      <Navbar />

      <div className="flex flex-col w-full items-center justify-center min-h-screen px-4">
        <Routes>
          {/* Auth entry */}
          <Route
            path="/"
            element={
              <RedirectAuthenticatedUser>
                <LoginPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/login"
            element={
              <RedirectAuthenticatedUser>
                <LoginPage />
              </RedirectAuthenticatedUser>
            }
          />

          {/* Public / main browse pages (login not strictly required) */}
          <Route path="/collection" element={<Collection />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/doctor" element={<Doctor />} />

          {/* Home (protected landing after login) */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* Dashboards */}
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

          {/* Orders */}
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
          {/* Order success can be public (e.g., payment gateway return) */}
          <Route path="/order-success" element={<OrderSuccess />} />

          {/* Role Selection & Signups */}
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

          {/* Doctor booking (protect forms) */}
          <Route
            path="/doctor/:docId"
            element={
              <ProtectedRoute>
                <Appointment />
              </ProtectedRoute>
            }
          />
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
          <Route
            path="/onlinepayment"
            element={
              <ProtectedRoute>
                <Onlinepayment />
              </ProtectedRoute>
            }
          />

          {/* Appointments overview */}
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

          {/* Cart (usually public) */}
          <Route path="/cart" element={<Cart />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Toasts + Footer */}
      <Toaster position="top-right" />
      <Footer />
    </div>
  );
}

export default App;
