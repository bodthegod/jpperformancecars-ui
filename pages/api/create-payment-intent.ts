import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

interface CreatePaymentIntentRequest {
  amount: number;
  currency?: string;
}

interface CreatePaymentIntentResponse {
  client_secret: string;
  payment_intent_id: string;
}

interface ErrorResponse {
  error: string;
  message?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreatePaymentIntentResponse | ErrorResponse>
) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { amount, currency = "gbp" }: CreatePaymentIntentRequest = req.body;

    // Validate required fields
    if (!amount || typeof amount !== "number") {
      return res.status(400).json({
        error: "Invalid amount",
        message: "Amount must be a valid number",
      });
    }

    // Validate minimum amount (50p for GBP)
    if (amount < 50) {
      return res.status(400).json({
        error: "Amount too small",
        message: "Minimum amount is 50p (£0.50)",
      });
    }

    // Validate maximum amount (£10,000 for safety)
    if (amount > 1000000) {
      // £10,000 in pence
      return res.status(400).json({
        error: "Amount too large",
        message: "Maximum amount is £10,000",
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Amount in pence
      currency: currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        source: "jp-performance-cars-ui",
        created_at: new Date().toISOString(),
      },
    });

    // Return client secret for frontend
    res.status(200).json({
      client_secret: paymentIntent.client_secret!,
      payment_intent_id: paymentIntent.id,
    });
  } catch (error: any) {
    console.error("Payment intent creation error:", error);

    // Handle Stripe-specific errors
    if (error.type === "StripeCardError") {
      return res.status(400).json({
        error: "Card error",
        message: error.message,
      });
    }

    if (error.type === "StripeInvalidRequestError") {
      return res.status(400).json({
        error: "Invalid request",
        message: error.message,
      });
    }

    // Generic error response
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to create payment intent",
    });
  }
}
