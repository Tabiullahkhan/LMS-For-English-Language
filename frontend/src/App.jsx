import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import CourseList from "./pages/CourseList";
import CourseDetail from "./pages/CourseDetail";
import Enroll from "./pages/Enroll";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Terms from "./pages/Terms";
import RefundPolicy from "./pages/RefundPolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";
import { ProtectedRoute, AdminRoute } from "./components/RouteGuards";
import ChatWidget from "./components/ChatWidget";
import InstallBanner from "./components/InstallBanner";
import IOSInstallBanner from "./components/IOSInstallBanner";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-cream dark:bg-ink text-ink dark:text-cream transition-colors">
      <Navbar />
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<CourseList />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />

          <Route path="/enroll/:id" element={<ProtectedRoute><Enroll /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

          {/* Catch-all - must stay last, matches any URL not handled above */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
      <ChatWidget />
      <InstallBanner />
      <IOSInstallBanner />
    </div>
  );
}

export default App;
