# 🚀 Stripe Payment Setup Guide

## Overview

Your application already has a complete Stripe payment system implemented! This guide will help you get it fully operational.

## ✅ What's Already Implemented

### Frontend Components

- ✅ **CheckoutPage** - Complete checkout flow with shipping and payment
- ✅ **StripePaymentForm** - Stripe Elements integration
- ✅ **CartDrawer** - Shopping cart with checkout button
- ✅ **CartContext** - State management for cart items
- ✅ **Stripe Configuration** - Proper setup in App.tsx

### Backend API

- ✅ **Payment Intent API** - `/pages/api/create-payment-intent.ts`
- ✅ **Order Management** - Integration with Supabase orders table

### Dependencies

- ✅ **@stripe/react-stripe-js** - React Stripe components
- ✅ **@stripe/stripe-js** - Stripe JavaScript SDK
- ✅ **stripe** - Node.js Stripe library

## 🔧 Setup Steps

### 1. Environment Variables

Create a `.env` file in your project root:

```bash
# Stripe Configuration
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here

# Supabase Configuration (if not already set)
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Get Your Stripe Keys

1. **Sign up/Login** to [Stripe Dashboard](https://dashboard.stripe.com/)
2. **Go to Developers** → **API Keys**
3. **Copy your keys**:
   - **Publishable key** (starts with `pk_test_` or `pk_live_`)
   - **Secret key** (starts with `sk_test_` or `sk_live_`)

### 3. Test Card Numbers

Use these test card numbers for testing:

| Card Type  | Number              | Expiry          | CVC          |
| ---------- | ------------------- | --------------- | ------------ |
| Visa       | 4242 4242 4242 4242 | Any future date | Any 3 digits |
| Mastercard | 5555 5555 5555 4444 | Any future date | Any 3 digits |
| Declined   | 4000 0000 0000 0002 | Any future date | Any 3 digits |

### 4. Database Setup

Ensure your Supabase database has the `orders` table:

```sql
-- Check if orders table exists
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  shipping_info JSONB NOT NULL,
  items JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
```

## 🧪 Testing the Payment Flow

### 1. Add Items to Cart

- Navigate to `/parts`
- Click "Add to Cart" on any part
- Cart icon should show item count

### 2. Open Cart

- Click the cart icon in the navbar
- Verify items are displayed correctly
- Click "Proceed to Checkout"

### 3. Complete Checkout

- Fill in shipping information
- Click "Continue to Payment"
- Enter test card details
- Complete payment

### 4. Verify Order

- Check Supabase dashboard for new order
- Verify payment in Stripe dashboard

## 🔍 Troubleshooting

### Common Issues

#### 1. "Stripe has not loaded" Error

**Solution**: Check your `REACT_APP_STRIPE_PUBLISHABLE_KEY` environment variable

#### 2. "Failed to create payment intent" Error

**Solution**:

- Verify `STRIPE_SECRET_KEY` is set
- Check Stripe dashboard for API errors
- Ensure amount is between 50p and £10,000

#### 3. Cart Not Persisting

**Solution**: Cart is stored in localStorage, check browser console for errors

#### 4. Payment Declined

**Solution**: Use correct test card numbers (see above)

### Debug Steps

1. **Check Console Logs**:

   ```javascript
   // Add to browser console
   console.log("Stripe Key:", process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
   ```

2. **Verify API Endpoint**:

   ```bash
   # Test payment intent creation
   curl -X POST http://localhost:3000/api/create-payment-intent \
     -H "Content-Type: application/json" \
     -d '{"amount": 1000, "currency": "gbp"}'
   ```

3. **Check Network Tab**:
   - Open browser dev tools
   - Go to Network tab
   - Complete a test payment
   - Look for API calls to `/api/create-payment-intent`

## 🚀 Production Deployment

### 1. Update Environment Variables

```bash
# Production Stripe keys
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key
STRIPE_SECRET_KEY=sk_live_your_live_key
```

### 2. Enable Webhook (Recommended)

Set up Stripe webhooks for better payment tracking:

```bash
# Webhook endpoint
https://yourdomain.com/api/stripe-webhook
```

### 3. Security Checklist

- ✅ Use HTTPS in production
- ✅ Never expose secret keys in frontend
- ✅ Validate payment amounts server-side
- ✅ Implement proper error handling
- ✅ Add payment confirmation emails

## 📱 Mobile Testing

The payment form is fully responsive and works on:

- ✅ iOS Safari
- ✅ Android Chrome
- ✅ Mobile Stripe Elements

## 🎯 Next Steps

Once basic payments are working, consider adding:

1. **Payment Confirmation Emails**
2. **Order Tracking**
3. **Refund Processing**
4. **Subscription Payments**
5. **Multiple Payment Methods**
6. **Tax Calculation**
7. **Shipping Integration**

## 📞 Support

If you encounter issues:

1. **Check Stripe Dashboard** for payment status
2. **Review browser console** for JavaScript errors
3. **Check network tab** for API failures
4. **Verify environment variables** are loaded correctly

---

**Ready to test?** Start by setting up your environment variables and try a test payment! 🎉
