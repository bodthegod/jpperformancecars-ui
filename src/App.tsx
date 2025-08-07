import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Elements } from "@stripe/react-stripe-js";
import { AppContent } from "./AppContent";
import { stripePromise } from "./lib/stripe";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/700.css";

function App() {
  return (
    <HelmetProvider>
      <Elements stripe={stripePromise}>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <AppContent />
        </BrowserRouter>
      </Elements>
    </HelmetProvider>
  );
}

export default App;
