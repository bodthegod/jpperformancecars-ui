// src/App.tsx
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/700.css";

function App() {
  return (
    <div>
      <Navbar />
      <HeroSection />
    </div>
  );
}

export default App;
