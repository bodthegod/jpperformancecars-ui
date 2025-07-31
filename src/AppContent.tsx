import { useEffect } from "react";
import { useLocation, Routes, Route } from "react-router-dom";
import { initGA, logPageView } from "./analytics/analytics";
import ContactPage from "./components/ContactPage";
import BackToTop from "./components/BackToTop";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { HomePage } from "./components/HomePage";
import ScrollToTop from "./components/ScrollToTop";
import StoryPage from "./components/AboutPage/StoryPage";
import TeamPage from "./components/AboutPage/TeamPage";
import ServicesPage from "./components/ServicesPage/ServicesPage";
import NotFound from "./components/NotFound";
import BlogListingPage from "./components/BlogPage/BlogListingPage";
import BlogPostPage from "./components/BlogPage/BlogPostPage";
import DiagnosticLookup from "./components/DiagnosticPage/DiagnosticLookup";
import OBDCodePage from "./components/DiagnosticPage/OBDCodePage";
import CheckoutPage from "./components/CheckoutPage/CheckoutPage";
import ProtectedAdminRoute from "./components/AdminPage/ProtectedAdminRoute";
import { CartProvider } from "./contexts/CartContext";

export function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    logPageView();
  }, [location]);

  return (
    <CartProvider>
      <ScrollToTop />
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about/story" element={<StoryPage />} />
        <Route path="/about/team" element={<TeamPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/blog" element={<BlogListingPage />} />
        <Route path="/blog/:postId" element={<BlogPostPage />} />
        <Route path="/diagnostic" element={<DiagnosticLookup />} />
        <Route path="/diagnostic/:code" element={<OBDCodePage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/admin" element={<ProtectedAdminRoute />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAdminRoute && <BackToTop />}
      {!isAdminRoute && <Footer />}
    </CartProvider>
  );
}
