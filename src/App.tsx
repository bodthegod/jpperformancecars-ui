import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AppContent } from "./AppContent";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/700.css";

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <AppContent />
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
