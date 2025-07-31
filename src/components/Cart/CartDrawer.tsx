import React from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Divider,
  Chip,
  TextField,
  Alert,
} from "@mui/material";
import {
  Close,
  ShoppingCart,
  Add,
  Remove,
  Delete,
  ShoppingBasket,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useCart } from "../../contexts/CartContext";
import { useNavigate } from "react-router-dom";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ open, onClose }) => {
  const { state, removeItem, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  const handleQuantityChange = (partId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(partId);
    } else {
      updateQuantity(partId, newQuantity);
    }
  };

  const formatPrice = (price: number) => {
    return `£${price.toFixed(2)}`;
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 400 },
          backgroundColor: "#fafafa",
        },
      }}
    >
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: 1,
            borderColor: "divider",
            backgroundColor: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ShoppingCart color="primary" />
            <Typography variant="h6" fontWeight="bold">
              Shopping Cart
            </Typography>
            {state.itemCount > 0 && (
              <Chip
                label={state.itemCount}
                size="small"
                color="primary"
                sx={{ ml: 1 }}
              />
            )}
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>

        {/* Cart Items */}
        <Box sx={{ flex: 1, overflow: "auto" }}>
          {state.items.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                p: 3,
                textAlign: "center",
              }}
            >
              <ShoppingBasket
                sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                Your cart is empty
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add some parts to get started
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {state.items.map((item, index) => (
                <motion.div
                  key={item.part.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ListItem
                    sx={{
                      borderBottom: 1,
                      borderColor: "divider",
                      backgroundColor: "white",
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                      },
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" fontWeight="bold">
                            {item.part.name}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {item.part.brand} • {item.part.category}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="primary"
                              fontWeight="bold"
                            >
                              {formatPrice(item.part.price)} each
                            </Typography>
                            <Chip
                              label={item.part.availability
                                .replace("_", " ")
                                .toUpperCase()}
                              color={
                                item.part.availability === "in_stock"
                                  ? "success"
                                  : "warning"
                              }
                              size="small"
                              sx={{ mt: 0.5 }}
                            />
                          </Box>
                        }
                      />
                    </Box>
                    <ListItemSecondaryAction>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {/* Quantity Controls */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleQuantityChange(
                                item.part.id,
                                item.quantity - 1
                              )
                            }
                            disabled={item.part.availability !== "in_stock"}
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                          <TextField
                            value={item.quantity}
                            onChange={(e) => {
                              const newQuantity = parseInt(e.target.value) || 0;
                              handleQuantityChange(item.part.id, newQuantity);
                            }}
                            size="small"
                            sx={{
                              width: 60,
                              "& .MuiInputBase-input": {
                                textAlign: "center",
                                py: 0.5,
                              },
                            }}
                            disabled={item.part.availability !== "in_stock"}
                          />
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleQuantityChange(
                                item.part.id,
                                item.quantity + 1
                              )
                            }
                            disabled={item.part.availability !== "in_stock"}
                          >
                            <Add fontSize="small" />
                          </IconButton>
                        </Box>

                        {/* Remove Button */}
                        <IconButton
                          size="small"
                          onClick={() => removeItem(item.part.id)}
                          color="error"
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                </motion.div>
              ))}
            </List>
          )}
        </Box>

        {/* Footer */}
        {state.items.length > 0 && (
          <Box
            sx={{
              p: 2,
              borderTop: 1,
              borderColor: "divider",
              backgroundColor: "white",
            }}
          >
            {/* Clear Cart Button */}
            <Button
              fullWidth
              variant="outlined"
              onClick={clearCart}
              sx={{ mb: 2 }}
              color="error"
            >
              Clear Cart
            </Button>

            {/* Total */}
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="h6" fontWeight="bold">
                Total:
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="primary">
                {formatPrice(state.total)}
              </Typography>
            </Box>

            {/* Checkout Button */}
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleCheckout}
              disabled={state.items.some(
                (item) => item.part.availability !== "in_stock"
              )}
              sx={{
                backgroundColor: "#006620",
                "&:hover": {
                  backgroundColor: "#004d1a",
                },
                "&:disabled": {
                  backgroundColor: "#ccc",
                },
              }}
            >
              Proceed to Checkout
            </Button>

            {/* Out of Stock Warning */}
            {state.items.some(
              (item) => item.part.availability !== "in_stock"
            ) && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                Some items are out of stock and cannot be purchased
              </Alert>
            )}
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default CartDrawer;
