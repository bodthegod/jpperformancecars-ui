// src/App.tsx
import BackToTop from "./components/BackToTop";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/700.css";
import ServiceForm from "./components/ServiceForm";

function App() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <ServiceForm />
      <BackToTop />
      <Footer />
    </div>
  );
}

export default App;
