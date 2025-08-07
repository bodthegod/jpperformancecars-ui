import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { formatCurrency } from "../../lib/stripe";

interface StripePaymentFormProps {
  amount: number;
  onSuccess: (paymentIntent: any) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  amount,
  onSuccess,
  onError,
  disabled = false,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debug Stripe loading
  React.useEffect(() => {
    console.log("Stripe status:", { stripe: !!stripe, elements: !!elements });
    if (!stripe) {
      console.warn(
        "Stripe has not loaded yet. Check your REACT_APP_STRIPE_PUBLISHABLE_KEY environment variable."
      );
    }
  }, [stripe, elements]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError("Card element not found");
      setIsProcessing(false);
      return;
    }

    try {
      // Step 1: Create Payment Intent via Next.js API
      const paymentIntentResponse = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to pence
          currency: "gbp",
        }),
      });

      if (!paymentIntentResponse.ok) {
        throw new Error("Failed to create payment intent");
      }

      const { client_secret } = await paymentIntentResponse.json();

      // Step 2: Confirm payment with card details
      const { error: confirmError, paymentIntent: confirmedPayment } =
        await stripe.confirmCardPayment(client_secret, {
          payment_method: {
            card: cardElement,
          },
        });

      if (confirmError) {
        setError(confirmError.message || "Payment confirmation failed");
        setIsProcessing(false);
        return;
      }

      if (confirmedPayment?.status === "succeeded") {
        onSuccess(confirmedPayment);
      } else {
        throw new Error("Payment was not successful");
      }
    } catch (err: any) {
      const errorMessage = err?.message || "An unexpected error occurred";
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#9e2146",
      },
    },
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Payment Details
      </Typography>

      {!stripe && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Payment system is loading... If this persists, please check that
          Stripe is configured properly.
        </Alert>
      )}

      <Box
        sx={{
          p: 2,
          border: "1px solid #e0e0e0",
          borderRadius: 1,
          mb: 2,
          backgroundColor: "#fafafa",
        }}
      >
        <CardElement options={cardElementOptions} />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Button
        type="submit"
        variant="contained"
        size="large"
        fullWidth
        disabled={!stripe || isProcessing || disabled}
        sx={{
          backgroundColor: "#006620",
          "&:hover": {
            backgroundColor: "#004d1a",
          },
          "&:disabled": {
            backgroundColor: "#cccccc",
            color: "#666666",
          },
          py: 1.5,
        }}
      >
        {isProcessing ? (
          <>
            <CircularProgress size={20} sx={{ mr: 1, color: "white" }} />
            Processing Payment...
          </>
        ) : !stripe ? (
          "Loading Payment System..."
        ) : (
          `Pay ${formatCurrency(amount)}`
        )}
      </Button>

      <Typography
        variant="body2"
        sx={{
          mt: 1,
          textAlign: "center",
          color: "#424770",
          fontWeight: 500,
        }}
      >
        🔒 Your payment is secured by Stripe
      </Typography>
    </Box>
  );
};

export default StripePaymentForm;
