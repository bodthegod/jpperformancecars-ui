import { BrowserRouter, Routes, Route } from "react-router-dom";
import ContactPage from "./components/ContactPage";
import BackToTop from "./components/BackToTop";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/700.css";
import { HomePage } from "./components/HomePage";
import ScrollToTop from "./components/ScrollToTop";
import StoryPage from "./components/AboutPage/StoryPage";
import TeamPage from "./components/AboutPage/TeamPage";
import ServicesPage from "./components/ServicesPage/ServicesPage";
import NotFound from "./components/NotFound";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { initGA, logPageView } from "./analytics/analytics";

function App() {
  const location = useLocation();

  useEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    logPageView();
  }, [location]);

  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about/story" element={<StoryPage />} />
        <Route path="/about/team" element={<TeamPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <BackToTop />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
