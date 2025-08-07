import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Divider,
  Avatar,
  Breadcrumbs,
  Link,
  Skeleton,
  ImageList,
  ImageListItem,
  IconButton,
  Dialog,
  DialogContent,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  ArrowBack,
  ShoppingCart,
  ZoomIn,
  Close,
  CheckCircle,
  LocalShipping,
  Security,
  Build,
  Speed,
  Diamond,
  Verified,
  Image as ImageIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import { partsApi } from "../../lib/supabase";
import { Part } from "../../types/types";
import { useCart } from "../../contexts/CartContext";
import SEO from "../SEO";
import PageContainer from "../layout/PageContainer";
import { ColorBars } from "../elements/ColorBars";

const PartDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem, canAddToCart, getCartQuantity } = useCart();
  const [part, setPart] = useState<Part | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (slug) {
      loadPart(slug);
    }
  }, [slug]);

  const loadPart = async (partSlug: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await partsApi.getBySlug(partSlug);
      setPart(data);
    } catch (err: any) {
      setError(err.message || "Failed to load part details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (part) {
      // Check if we can add more to cart
      if (!canAddToCart(part)) {
        console.log("Cannot add more to cart:", part.name);
        return;
      }

      addItem(part);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    }
  };

  const getImages = () => {
    const partWithImages = part as any;
    return partWithImages?.images || [];
  };

  const getPrimaryImageIndex = () => {
    const partWithImages = part as any;
    return partWithImages?.primary_image_index || 0;
  };

  const getRarityColor = (rarity?: string) => {
    switch (rarity) {
      case "extremely_rare":
        return "#FFD700";
      case "rare":
        return "#C0C0C0";
      case "one_off":
        return "#FF6B6B";
      default:
        return "#4CAF50";
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "in_stock":
        return "#4CAF50";
      case "rare_find":
        return "#FFD700";
      case "out_of_stock":
        return "#F44336";
      default:
        return "#757575";
    }
  };

  const getAvailabilityText = (availability: string) => {
    return availability.replace("_", " ").toUpperCase();
  };

  if (isLoading) {
    return (
      <PageContainer>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Skeleton
                variant="rectangular"
                height={400}
                sx={{ borderRadius: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Skeleton variant="text" height={40} />
              <Skeleton variant="text" height={60} />
              <Skeleton variant="text" height={30} />
              <Skeleton variant="rectangular" height={200} />
            </Grid>
          </Grid>
        </Container>
      </PageContainer>
    );
  }

  if (error || !part) {
    return (
      <PageContainer>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 4 }}>
            {error || "Part not found"}
          </Alert>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate("/parts")}
          >
            Back to Parts
          </Button>
        </Container>
      </PageContainer>
    );
  }

  const images = getImages();
  const primaryImageIndex = getPrimaryImageIndex();

  return (
    <PageContainer>
      <SEO
        title={`${part.name} | Performance Parts | JP Performance Cars`}
        description={part.description}
        keywords={`${part.name}, performance parts, ${part.brand}, ${part.category}, supercar parts`}
      />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 4 }}>
          <Link component={RouterLink} to="/" color="inherit">
            Home
          </Link>
          <Link component={RouterLink} to="/parts" color="inherit">
            Parts
          </Link>
          <Typography color="text.primary">{part.name}</Typography>
        </Breadcrumbs>

        {/* Back Button */}
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate("/parts")}
          sx={{ mb: 4 }}
        >
          Back to Parts
        </Button>

        {/* Success Alert */}
        {addedToCart && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Alert
              severity="success"
              sx={{ mb: 4 }}
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => navigate("/checkout")}
                >
                  View Cart
                </Button>
              }
            >
              Part added to cart successfully!
            </Alert>
          </motion.div>
        )}

        <Grid container spacing={6}>
          {/* Image Gallery */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
                {images.length > 0 ? (
                  <>
                    {/* Main Image */}
                    <Box sx={{ position: "relative" }}>
                      <img
                        src={images[selectedImageIndex]}
                        alt={part.name}
                        style={{
                          width: "100%",
                          height: "400px",
                          objectFit: "cover",
                          cursor: "pointer",
                        }}
                        onClick={() => setImageDialogOpen(true)}
                      />
                      <IconButton
                        sx={{
                          position: "absolute",
                          top: 16,
                          right: 16,
                          backgroundColor: "rgba(0,0,0,0.5)",
                          color: "white",
                          "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
                        }}
                        onClick={() => setImageDialogOpen(true)}
                      >
                        <ZoomIn />
                      </IconButton>

                      {/* Primary Badge */}
                      {selectedImageIndex === primaryImageIndex && (
                        <Chip
                          label="Primary"
                          size="small"
                          sx={{
                            position: "absolute",
                            bottom: 16,
                            left: 16,
                            backgroundColor: "primary.main",
                            color: "white",
                            fontWeight: "bold",
                          }}
                        />
                      )}
                    </Box>

                    {/* Thumbnail Gallery */}
                    {images.length > 1 && (
                      <Box sx={{ p: 2 }}>
                        <ImageList cols={Math.min(images.length, 4)} gap={8}>
                          {images.map((image: string, index: number) => (
                            <ImageListItem key={index}>
                              <img
                                src={image}
                                alt={`${part.name} ${index + 1}`}
                                style={{
                                  height: "80px",
                                  objectFit: "cover",
                                  cursor: "pointer",
                                  borderRadius: "8px",
                                  border:
                                    selectedImageIndex === index
                                      ? "3px solid #DC143C"
                                      : "1px solid #e0e0e0",
                                }}
                                onClick={() => setSelectedImageIndex(index)}
                              />
                            </ImageListItem>
                          ))}
                        </ImageList>
                      </Box>
                    )}
                  </>
                ) : (
                  <Box
                    sx={{
                      height: 400,
                      backgroundColor: "#f5f5f5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    <ImageIcon sx={{ fontSize: 80, color: "#ccc" }} />
                    <Typography variant="h6" color="text.secondary">
                      No Images Available
                    </Typography>
                  </Box>
                )}
              </Card>
            </motion.div>
          </Grid>

          {/* Part Details */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Badges */}
              <Box sx={{ display: "flex", gap: 1, mb: 3, flexWrap: "wrap" }}>
                <Chip
                  label={getAvailabilityText(part.availability)}
                  sx={{
                    backgroundColor: getAvailabilityColor(part.availability),
                    color: "white",
                    fontWeight: "bold",
                  }}
                />
                {(part as any).rarity_level &&
                  (part as any).rarity_level !== "common" && (
                    <Chip
                      icon={<Diamond />}
                      label={(part as any).rarity_level
                        ?.replace("_", " ")
                        .toUpperCase()}
                      sx={{
                        backgroundColor: getRarityColor(
                          (part as any).rarity_level
                        ),
                        color: "white",
                        fontWeight: "bold",
                      }}
                    />
                  )}
                <Chip
                  icon={<Verified />}
                  label="Authentic"
                  color="primary"
                  sx={{ fontWeight: "bold" }}
                />
              </Box>

              {/* Brand & Category */}
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <Chip
                  avatar={<Avatar sx={{ bgcolor: "primary.main" }}>🏎️</Avatar>}
                  label={part.brand}
                  sx={{ fontWeight: "bold" }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ alignSelf: "center" }}
                >
                  {part.category}
                </Typography>
              </Box>

              {/* Part Name */}
              <Typography
                variant="h3"
                sx={{ fontWeight: "bold", mb: 2, lineHeight: 1.2 }}
              >
                {part.name}
              </Typography>

              {/* Price & Quantity */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: "bold",
                    color: "#a70a0c",
                    fontFamily: "Times New Roman, serif",
                    mb: 0.5,
                  }}
                >
                  £{part.price.toLocaleString()}
                </Typography>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Exclusive pricing for genuine performance parts
                  </Typography>
                  <Chip
                    label={`${(() => {
                      const cartQuantity = getCartQuantity(part.id);
                      const availableStock = part.quantity || 0;
                      const remainingInStock = availableStock - cartQuantity;
                      return `${remainingInStock} available`;
                    })()}`}
                    size="small"
                    sx={{
                      backgroundColor:
                        part.quantity > 0 ? "#e8f5e8" : "#ffebee",
                      color: part.quantity > 0 ? "#2e7d32" : "#c62828",
                      fontWeight: "bold",
                    }}
                  />
                </Box>
              </Box>

              {/* Description */}
              <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.7 }}>
                {part.description}
              </Typography>

              {/* Part Details */}
              <Card sx={{ mb: 4, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                    Part Details
                  </Typography>
                  <Grid container spacing={2}>
                    {part.part_number && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                          Part Number
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                          {part.part_number}
                        </Typography>
                      </Grid>
                    )}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Condition
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        {((part as any).condition || "new")
                          .replace("_", " ")
                          .toUpperCase()}
                      </Typography>
                    </Grid>
                    {(part as any).year_range && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                          Year Range
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                          {(part as any).year_range}
                        </Typography>
                      </Grid>
                    )}
                    {part.ferrari_models && part.ferrari_models.length > 0 && (
                      <Grid item xs={12}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          Compatible Vehicle Models
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                          {part.ferrari_models.map((model) => (
                            <Chip
                              key={model}
                              label={model}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>

              {/* Features */}
              <Card sx={{ mb: 4, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                    Why Choose This Part?
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <Verified color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="100% Authentic Performance Part"
                        secondary="Guaranteed genuine OEM or high-quality aftermarket"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Build color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Professional Installation Support"
                        secondary="Expert guidance and technical support included"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <LocalShipping color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Worldwide Shipping"
                        secondary="Secure packaging and insured delivery"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Security color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Quality Guarantee"
                        secondary="Full warranty and return policy protection"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCart />}
                  onClick={handleAddToCart}
                  disabled={!canAddToCart(part)}
                  sx={{
                    flex: 1,
                    py: 2,
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    borderRadius: 2,
                    backgroundColor: "#a70a0c",
                    "&:hover": {
                      backgroundColor: "#8B0000",
                    },
                    "&:disabled": {
                      backgroundColor: "#ccc",
                    },
                  }}
                >
                  {(() => {
                    const cartQuantity = getCartQuantity(part.id);
                    const availableStock = part.quantity || 0;
                    const remainingInStock = availableStock - cartQuantity;

                    if (availableStock <= 0) {
                      return "Out of Stock";
                    } else if (remainingInStock === 0) {
                      return "All in Cart";
                    } else if (remainingInStock === 1) {
                      return "Last One - Add to Cart!";
                    } else if (cartQuantity > 0) {
                      return `Add More (${remainingInStock} left)`;
                    } else {
                      return "Add to Cart";
                    }
                  })()}
                </Button>
              </Box>

              {/* Contact Info */}
              <Card sx={{ borderRadius: 2, backgroundColor: "#f8f9fa" }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                    Need Help?
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Our performance specialists are here to help with technical
                    questions and installation guidance.
                  </Typography>
                  <Button variant="outlined" size="small">
                    Contact Specialist
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* Image Dialog */}
      <Dialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={{ p: 0, position: "relative" }}>
          <IconButton
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              backgroundColor: "rgba(0,0,0,0.5)",
              color: "white",
              zIndex: 1,
              "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
            }}
            onClick={() => setImageDialogOpen(false)}
          >
            <Close />
          </IconButton>
          {images.length > 0 && (
            <img
              src={images[selectedImageIndex]}
              alt={part.name}
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "80vh",
                objectFit: "contain",
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default PartDetailPage;
