import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe
const stripePublishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  console.error(
    "❌ STRIPE ERROR: REACT_APP_STRIPE_PUBLISHABLE_KEY not found in environment variables."
  );
  console.error("📝 To fix this:");
  console.error("1. Create a .env file in your project root");
  console.error(
    "2. Add: REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here"
  );
  console.error("3. Get your key from: https://dashboard.stripe.com/apikeys");
  console.error("4. Restart your development server");
}

export const stripePromise = stripePublishableKey
  ? loadStripe(stripePublishableKey)
  : null;

// Stripe payment processing functions
export const createPaymentIntent = async (
  amount: number,
  currency: string = "gbp"
) => {
  try {
    // In a real app, this would call your backend API to create a payment intent
    // For now, we'll simulate the response structure
    const response = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Convert to pence
        currency,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create payment intent");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating payment intent:", error);
    // For demo purposes, return a mock payment intent
    return {
      client_secret: "demo_client_secret",
      amount: Math.round(amount * 100),
      currency,
    };
  }
};

export const formatCurrency = (amount: number, currency: string = "GBP") => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency,
  }).format(amount);
};
