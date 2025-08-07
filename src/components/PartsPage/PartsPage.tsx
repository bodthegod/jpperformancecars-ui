import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Button,
  Divider,
  Avatar,
  Skeleton,
  Alert,
  Snackbar,
  Pagination,
} from "@mui/material";
import {
  Search,
  FilterList,
  Speed,
  Star,
  LocalShipping,
  Verified,
  Diamond,
  Image as ImageIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { partsApi } from "../../lib/supabase";
import { Part } from "../../types/types";
import { GENERAL_PART_CATEGORIES } from "../../data/generalParts";
import { useCart } from "../../contexts/CartContext";
import SEO from "../SEO";
import PageContainer from "../layout/PageContainer";
import { ColorBars } from "../elements/ColorBars";

const PartsPage: React.FC = () => {
  const navigate = useNavigate();
  const { addItem, canAddToCart, getCartQuantity } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [availability, setAvailability] = useState("");
  const [parts, setParts] = useState<Part[]>([]);
  const [filteredParts, setFilteredParts] = useState<Part[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [brands, setBrands] = useState<string[]>([]);
  const [addedToCartPart, setAddedToCartPart] = useState<Part | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); // Show 12 items per page

  useEffect(() => {
    loadParts();
  }, []);

  useEffect(() => {
    filterParts();
    setCurrentPage(1); // Reset to first page when filters change
  }, [
    searchQuery,
    selectedCategory,
    selectedBrand,
    priceRange,
    availability,
    parts,
  ]);

  const loadParts = async () => {
    try {
      setIsLoading(true);
      const data = await partsApi.getAll();
      setParts(data);

      // Extract unique brands
      const uniqueBrands = Array.from(
        new Set(data.map((part: Part) => part.brand))
      )
        .filter(Boolean)
        .sort();
      setBrands(uniqueBrands);
    } catch (error) {
      console.error("Failed to load parts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterParts = () => {
    let filtered = parts;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (part: Part) =>
          part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          part.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          part.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (part.part_number &&
            part.part_number.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(
        (part: Part) => part.category === selectedCategory
      );
    }

    // Brand filter
    if (selectedBrand) {
      filtered = filtered.filter((part: Part) => part.brand === selectedBrand);
    }

    // Price range filter
    if (priceRange) {
      const [min, max] = priceRange.split("-").map(Number);
      filtered = filtered.filter((part: Part) => {
        if (max) {
          return part.price >= min && part.price <= max;
        } else {
          return part.price >= min;
        }
      });
    }

    // Availability filter
    if (availability) {
      filtered = filtered.filter(
        (part: Part) => part.availability === availability
      );
    }

    setFilteredParts(filtered);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredParts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredParts.length / itemsPerPage);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePartClick = (part: Part) => {
    navigate(`/parts/${part.slug}`);
  };

  const handleAddToCart = (part: Part, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking add to cart

    // Check if we can add more to cart
    if (!canAddToCart(part)) {
      console.log("Cannot add more to cart:", part.name);
      return;
    }

    addItem(part);
    setAddedToCartPart(part);
    console.log("Added to cart:", part.name); // Debug log
    // Clear notification after 3 seconds
    setTimeout(() => setAddedToCartPart(null), 3000);
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

  const getPrimaryImage = (part: Part) => {
    const partWithImages = part as any;
    if (partWithImages.images && partWithImages.images.length > 0) {
      const primaryIndex = partWithImages.primary_image_index || 0;
      return partWithImages.images[primaryIndex];
    }
    return null;
  };

  return (
    <PageContainer>
      <SEO
        title="Performance Parts Catalog | JP Performance Cars"
        description="Browse our exclusive collection of authentic performance parts. Rare and bespoke components for discerning automotive enthusiasts."
        keywords="performance parts, authentic automotive components, rare car parts, bespoke modifications, supercar parts"
      />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="h3"
              sx={{
                mb: 1,
                fontFamily: "Times New Roman, sans-serif",
                padding: "2.5rem 0",
                fontSize: "34px",
                letterSpacing: "2px",
                lineHeight: "1.2",
                color: "#000",
              }}
            >
              PARTS CATALOG
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
              <ColorBars />
            </Box>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mb: 4, maxWidth: 600, mx: "auto", fontStyle: "italic" }}
            >
              Exclusive collection of authentic performance parts and bespoke
              components
            </Typography>
          </Box>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card sx={{ mb: 4, borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <FilterList sx={{ mr: 1, color: "primary.main" }} />
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Filter Parts
                </Typography>
              </Box>

              <Grid container spacing={3}>
                {/* Search */}
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    placeholder="Search parts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Category */}
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={selectedCategory}
                      label="Category"
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <MenuItem value="">All Categories</MenuItem>
                      {Object.keys(GENERAL_PART_CATEGORIES).map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Brand */}
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Brand</InputLabel>
                    <Select
                      value={selectedBrand}
                      label="Brand"
                      onChange={(e) => setSelectedBrand(e.target.value)}
                    >
                      <MenuItem value="">All Brands</MenuItem>
                      {brands.map((brand) => (
                        <MenuItem key={brand} value={brand}>
                          {brand}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Price Range */}
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Price Range</InputLabel>
                    <Select
                      value={priceRange}
                      label="Price Range"
                      onChange={(e) => setPriceRange(e.target.value)}
                    >
                      <MenuItem value="">All Prices</MenuItem>
                      <MenuItem value="0-500">£0 - £500</MenuItem>
                      <MenuItem value="500-1000">£500 - £1,000</MenuItem>
                      <MenuItem value="1000-2500">£1,000 - £2,500</MenuItem>
                      <MenuItem value="2500-5000">£2,500 - £5,000</MenuItem>
                      <MenuItem value="5000">£5,000+</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Availability */}
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Availability</InputLabel>
                    <Select
                      value={availability}
                      label="Availability"
                      onChange={(e) => setAvailability(e.target.value)}
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="in_stock">In Stock</MenuItem>
                      <MenuItem value="rare_find">Rare Find</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Clear Filters */}
                <Grid item xs={12} md={1}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("");
                      setSelectedBrand("");
                      setPriceRange("");
                      setAvailability("");
                    }}
                    sx={{ height: "56px" }}
                  >
                    Clear
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Count */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" color="text.secondary">
            {isLoading
              ? "Loading..."
              : totalPages > 1
              ? `Showing ${indexOfFirstItem + 1}-${Math.min(
                  indexOfLastItem,
                  filteredParts.length
                )} of ${filteredParts.length} parts`
              : `${filteredParts.length} parts found`}
          </Typography>
        </Box>

        {/* Parts Grid */}
        {isLoading ? (
          <Grid container spacing={3}>
            {[...Array(6)].map((_, index) => (
              <Grid item xs={12} sm={6} lg={4} key={index}>
                <Card sx={{ borderRadius: 3 }}>
                  <Skeleton variant="rectangular" height={250} />
                  <CardContent>
                    <Skeleton variant="text" height={32} />
                    <Skeleton variant="text" height={20} />
                    <Skeleton variant="text" height={20} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={3}>
            {currentItems.map((part, index) => {
              const primaryImage = getPrimaryImage(part);

              return (
                <Grid item xs={12} sm={6} lg={4} key={part.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{
                      y: -8,
                      boxShadow: "0px 16px 40px rgba(220,20,60,0.15)",
                    }}
                    style={{ height: "100%" }}
                  >
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: 2,
                        border: "1px solid #e0e0e0",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        "&:hover": {
                          borderColor: "#a70a0c",
                          boxShadow: "0 4px 20px rgba(167,10,12,0.15)",
                          transform: "translateY(-4px)",
                        },
                      }}
                      onClick={() => handlePartClick(part)}
                    >
                      {/* Image */}
                      <Box sx={{ position: "relative" }}>
                        {primaryImage ? (
                          <CardMedia
                            component="img"
                            height="250"
                            image={primaryImage}
                            alt={part.name}
                            sx={{ objectFit: "cover" }}
                          />
                        ) : (
                          <Box
                            sx={{
                              height: 250,
                              backgroundColor: "#f5f5f5",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexDirection: "column",
                              gap: 1,
                            }}
                          >
                            <ImageIcon sx={{ fontSize: 48, color: "#ccc" }} />
                            <Typography variant="body2" color="text.secondary">
                              No Image Available
                            </Typography>
                          </Box>
                        )}

                        {/* Availability Badge */}
                        <Chip
                          label={getAvailabilityText(part.availability)}
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 12,
                            left: 12,
                            backgroundColor: getAvailabilityColor(
                              part.availability
                            ),
                            color: "white",
                            fontWeight: "bold",
                          }}
                        />

                        {/* Rarity Badge */}
                        {(part as any).rarity_level &&
                          (part as any).rarity_level !== "common" && (
                            <Chip
                              icon={<Diamond sx={{ fontSize: "0.8rem" }} />}
                              label={(part as any).rarity_level
                                ?.replace("_", " ")
                                .toUpperCase()}
                              size="small"
                              sx={{
                                position: "absolute",
                                top: 12,
                                right: 12,
                                backgroundColor: getRarityColor(
                                  (part as any).rarity_level
                                ),
                                color: "white",
                                fontWeight: "bold",
                              }}
                            />
                          )}
                      </Box>

                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        {/* Brand & Category */}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 2,
                          }}
                        >
                          <Chip
                            avatar={
                              <Avatar sx={{ bgcolor: "primary.main" }}>
                                🏎️
                              </Avatar>
                            }
                            label={part.brand}
                            size="small"
                            sx={{ fontWeight: "bold" }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {part.category}
                          </Typography>
                        </Box>

                        {/* Part Name */}
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: "bold",
                            mb: 1,
                            minHeight: 48,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {part.name}
                        </Typography>

                        {/* Description */}
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 2,
                            minHeight: 40,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {part.description}
                        </Typography>

                        {/* Part Number */}
                        {part.part_number && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block", mb: 2 }}
                          >
                            Part #: {part.part_number}
                          </Typography>
                        )}

                        <Divider sx={{ my: 2 }} />

                        {/* Price & Actions */}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Box>
                            <Typography
                              variant="h5"
                              sx={{
                                fontWeight: "bold",
                                color: "#a70a0c",
                                fontFamily: "Times New Roman, serif",
                              }}
                            >
                              £{part.price.toLocaleString()}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Exclusive Price
                            </Typography>
                          </Box>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={(e) => handleAddToCart(part, e)}
                            disabled={!canAddToCart(part)}
                            sx={{
                              borderRadius: 1,
                              px: 2,
                              fontWeight: "bold",
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
                              const remainingInStock =
                                availableStock - cartQuantity;

                              if (availableStock <= 0) {
                                return "Out of Stock";
                              } else if (remainingInStock === 0) {
                                return "All in Cart";
                              } else if (remainingInStock === 1) {
                                return "Last One!";
                              } else if (cartQuantity > 0) {
                                return `Add More (${remainingInStock} left)`;
                              } else {
                                return `Add to Cart (${remainingInStock} left)`;
                              }
                            })()}
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              );
            })}
          </Grid>
        )}

        {/* Pagination */}
        {!isLoading && filteredParts.length > 0 && totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Box
              sx={{ display: "flex", justifyContent: "center", mt: 6, mb: 4 }}
            >
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
                sx={{
                  "& .MuiPaginationItem-root": {
                    fontSize: "1rem",
                    fontWeight: "bold",
                    borderRadius: 2,
                    mx: 0.5,
                  },
                  "& .Mui-selected": {
                    backgroundColor: "#a70a0c !important",
                    color: "white !important",
                  },
                }}
              />
            </Box>
          </motion.div>
        )}

        {/* No Results */}
        {!isLoading && filteredParts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
                No parts found
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Try adjusting your filters or search terms
              </Typography>
            </Box>
          </motion.div>
        )}
      </Container>

      {/* Add to Cart Notification */}
      <Snackbar
        open={!!addedToCartPart}
        autoHideDuration={3000}
        onClose={() => setAddedToCartPart(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ zIndex: 9999 }}
      >
        <Alert
          onClose={() => setAddedToCartPart(null)}
          severity="success"
          variant="filled"
          sx={{
            minWidth: 300,
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            borderRadius: 2,
          }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => navigate("/checkout")}
              sx={{ fontWeight: "bold" }}
            >
              View Cart
            </Button>
          }
        >
          {addedToCartPart && (
            <>
              <strong>{addedToCartPart.name}</strong> added to cart!
            </>
          )}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default PartsPage;
