// src/App.jsx
<<<<<<< HEAD
=======
import { Navigate, Route, Routes } from "react-router-dom";
>>>>>>> 8df4ad40e6c47cffec270f62c8e554f43c5ed8ea
import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
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
<<<<<<< HEAD
import Collection from "./pages/Collection";
import Doctor from "./pages/Doctor";
import Support from "./pages/support";
import About from "./pages/About";
import Appointment from "./pages/Appoinment";
=======
import Appointment from "./pages/Appoinment"; // keep your spelling
import AdminDashboard from "./pages/AdminDashboard";
>>>>>>> 8df4ad40e6c47cffec270f62c8e554f43c5ed8ea
import PatientForm from "./pages/PatientForm";
import PatientDetails from "./pages/PatientDetails";
import PatientUpdate from "./pages/PatientUpdate";
import UploadSlip from "./pages/UploadSlip";
import Onlinepayment from "./pages/Onlinepayment";
import ProductDetail from "./pages/ProductDetail";
import ProductDashboard from "./pages/ProductDashboard";
import UpdateProduct from "./pages/UpdateProduct";
<<<<<<< HEAD

import UserMgt from "./pages/UserMgt";
import AdminDashboard from "./pages/AdminDashboard";
=======
>>>>>>> 8df4ad40e6c47cffec270f62c8e554f43c5ed8ea
import UpdateUser from "./pages/UpdateUser";
import CheckAppoinments from "./pages/CheckAppoinments";
import MyAppoinment from "./pages/MyAppoinment";
<<<<<<< HEAD
import AdminSupportCenter from "./pages/AdminSupportCenter";
// Review pages
import TicketReview from "./pages/TicketReview";
import SupportReview from "./pages/SupportReview";
import FeedbackReview from "./pages/FeedbackReview";

// ---------- helpers ----------
=======
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

// ---------- Auth Guards ----------
>>>>>>> 8df4ad40e6c47cffec270f62c8e554f43c5ed8ea
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user?.isVerified) return <Navigate to="/verify-email" replace />;
  return children;
};

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated && user?.isVerified) return <Navigate to="/home" replace />;
  return children;
};

<<<<<<< HEAD
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
=======
// ---------- Main App ----------
>>>>>>> 8df4ad40e6c47cffec270f62c8e554f43c5ed8ea
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
<<<<<<< HEAD
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

<Route path="/admin/support-center" element={<ProtectedRoute><AdminSupportCenter /></ProtectedRoute>} />

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
<Route
  path="/admin/support-center"
  element={
    <ProtectedRoute>
      <AdminSupportCenter />
    </ProtectedRoute>
  }
/>
            {/* Dashboards / protected */}
            <Route
              path="/dashboard"
              element={<ProtectedRoute><UserDashboard /></ProtectedRoute>}
            />
            <Route
              path="/admin-dashboard"
              element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}
            />
            <Route
              path="/user-management"
              element={<ProtectedRoute><UserMgt /></ProtectedRoute>}
            />
            <Route
              path="/dashboard/:id"
              element={<ProtectedRoute><UpdateUser /></ProtectedRoute>}
            />
            <Route
              path="/product-dashboard"
              element={<ProtectedRoute><ProductDashboard /></ProtectedRoute>}
            />
            <Route
              path="/update-product/:id"
              element={<ProtectedRoute><UpdateProduct /></ProtectedRoute>}
            />
            <Route
              path="/CheckAppoinments"
              element={<ProtectedRoute><CheckAppoinments /></ProtectedRoute>}
            />
            <Route
              path="/my_appoinments"
              element={<ProtectedRoute><MyAppoinment /></ProtectedRoute>}
            />

            {/* Review pages (after submit redirects) */}
            <Route path="/tickets/review/:id" element={<TicketReview />} />
            <Route path="/support/review/:id" element={<SupportReview />} />
            <Route path="/feedback/review/:id" element={<FeedbackReview />} />

            {/* Misc */}
            <Route path="/onlinepayment" element={<Onlinepayment />} />
            <Route path="/approval-pending" element={<ApprovalPendingPage />} />

            {/* Fallback (keep this LAST) */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      <Toaster />
=======
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

          {/* Public browse pages */}
          <Route path="/collection" element={<Collection />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/doctor" element={<Doctor />} />

          {/* Home (protected after login) */}
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

          {/* -------- Orders & Payments -------- */}
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
          {/* Payment success page (public) */}
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

          {/* Doctor appointment & patient routes */}
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

          {/* Cart (usually public) */}
          <Route path="/cart" element={<Cart />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <Toaster position="top-right" />
>>>>>>> 8df4ad40e6c47cffec270f62c8e554f43c5ed8ea
      <Footer />
    </div>
  );
}

export default App;
