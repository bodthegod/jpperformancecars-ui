// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ContactPage from "./components/ContactPage";
import BackToTop from "./components/BackToTop";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/700.css";
import { HomePage } from "./components/HomePage";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
      <BackToTop />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
