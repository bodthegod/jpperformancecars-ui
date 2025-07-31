import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Alert,
  CircularProgress,
} from "@mui/material";
import { ArrowBack, ShoppingCart } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { ColorBars } from "../elements/ColorBars";
import SEO from "../SEO";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "United Kingdom",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (state.items.length === 0) {
      return;
    }

    setIsProcessing(true);

    try {
      // Here you would integrate with Stripe and create the order
      // For now, we'll just simulate the process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Clear cart after successful order
      clearCart();

      // Navigate to success page or show success message
      alert("Order placed successfully! (This is a demo)");
      navigate("/");
    } catch (error) {
      console.error("Checkout error:", error);
      alert("There was an error processing your order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPrice = (price: number) => {
    return `£${price.toFixed(2)}`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  if (state.items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ mt: { xs: "20%", sm: "15%", md: "10%" } }}>
        <Alert severity="info" sx={{ mb: 4 }}>
          Your cart is empty. Please add some items before checkout.
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/diagnostic")}
          variant="outlined"
        >
          Back to Diagnostic Lookup
        </Button>
      </Container>
    );
  }

  // SEO structured data
  const checkoutSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Checkout - JP Performance Cars",
    description: "Complete your parts purchase securely.",
    url: "https://www.jpperformancecars.co.uk/checkout",
  };

  return (
    <>
      <SEO
        title="Checkout | JP Performance Cars"
        description="Complete your parts purchase securely with our checkout process."
        keywords="checkout, parts purchase, secure payment, automotive parts"
        canonical="https://www.jpperformancecars.co.uk/checkout"
        structuredData={checkoutSchema}
      />

      <Box>
        <Container
          maxWidth="lg"
          sx={{ mt: { xs: "20%", sm: "15%", md: "10%" } }}
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Header */}
            <motion.div variants={itemVariants}>
              <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate("/diagnostic")}
                variant="outlined"
                sx={{ mb: 3 }}
              >
                Back to Diagnostic Lookup
              </Button>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Typography
                variant="h3"
                align="center"
                sx={{
                  mb: 1,
                  fontFamily: "Times New Roman, sans-serif",
                  padding: "2.5rem 0",
                  fontSize: "34px",
                  letterSpacing: "2px",
                  lineHeight: "1.2",
                }}
              >
                CHECKOUT
              </Typography>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
                <ColorBars />
              </Box>
            </motion.div>

            <Grid container spacing={4}>
              {/* Order Summary */}
              <Grid item xs={12} md={5}>
                <motion.div variants={itemVariants}>
                  <Card sx={{ height: "fit-content" }}>
                    <CardContent>
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 2,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <ShoppingCart />
                        Order Summary
                      </Typography>

                      <List>
                        {state.items.map((item) => (
                          <ListItem key={item.part.id} sx={{ px: 0 }}>
                            <ListItemText
                              primary={item.part.name}
                              secondary={`${item.part.brand} • Qty: ${item.quantity}`}
                            />
                            <Typography variant="body2" fontWeight="bold">
                              {formatPrice(item.part.price * item.quantity)}
                            </Typography>
                          </ListItem>
                        ))}
                      </List>

                      <Divider sx={{ my: 2 }} />

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="h6" fontWeight="bold">
                          Total:
                        </Typography>
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          color="primary"
                        >
                          {formatPrice(state.total)}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>

              {/* Checkout Form */}
              <Grid item xs={12} md={7}>
                <motion.div variants={itemVariants}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 3 }}>
                        Shipping Information
                      </Typography>

                      <Box component="form" onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              name="firstName"
                              label="First Name"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              name="lastName"
                              label="Last Name"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              name="email"
                              label="Email"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              name="phone"
                              label="Phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              required
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              name="address"
                              label="Address"
                              value={formData.address}
                              onChange={handleInputChange}
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              name="city"
                              label="City"
                              value={formData.city}
                              onChange={handleInputChange}
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              name="postalCode"
                              label="Postal Code"
                              value={formData.postalCode}
                              onChange={handleInputChange}
                              required
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              name="country"
                              label="Country"
                              value={formData.country}
                              onChange={handleInputChange}
                              required
                            />
                          </Grid>
                        </Grid>

                        <Box sx={{ mt: 4 }}>
                          <Alert severity="info" sx={{ mb: 2 }}>
                            This is a demo checkout. In a real implementation,
                            you would integrate with Stripe for secure payment
                            processing.
                          </Alert>

                          <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            fullWidth
                            disabled={isProcessing}
                            sx={{
                              backgroundColor: "#006620",
                              "&:hover": {
                                backgroundColor: "#004d1a",
                              },
                              py: 1.5,
                            }}
                          >
                            {isProcessing ? (
                              <>
                                <CircularProgress
                                  size={20}
                                  sx={{ mr: 1, color: "white" }}
                                />
                                Processing...
                              </>
                            ) : (
                              `Complete Order - ${formatPrice(state.total)}`
                            )}
                          </Button>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        </Container>
      </Box>
    </>
  );
};

export default CheckoutPage;
