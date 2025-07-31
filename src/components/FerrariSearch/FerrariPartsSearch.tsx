import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Card,
  CardContent,
  Grid,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Divider,
  Avatar,
} from "@mui/material";
import {
  Search,
  Speed,
  Star,
  LocalShipping,
  Verified,
  Diamond,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { partsApi } from "../../lib/supabase";
import { Part } from "../../types/types";
import { PART_CATEGORIES, FERRARI_MODELS } from "../../data/realisticParts";
import { useCart } from "../../contexts/CartContext";
import SEO from "../SEO";

const FerrariPartsSearch: React.FC = () => {
  const { addItem } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [parts, setParts] = useState<Part[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const filters = {
        search: searchQuery,
        category: selectedCategory,
        // Add Ferrari model filtering logic here
      };
      const results = await partsApi.search(filters);
      setParts(results);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (part: Part) => {
    addItem(part);
  };

  const getRarityColor = (rarity?: string) => {
    switch (rarity) {
      case "extremely_rare":
        return "#FFD700"; // Gold
      case "rare":
        return "#C0C0C0"; // Silver
      case "one_off":
        return "#FF6B6B"; // Red
      default:
        return "#4CAF50"; // Green
    }
  };

  const getConditionIcon = (condition?: string) => {
    switch (condition) {
      case "new":
        return "🆕";
      case "used_excellent":
        return "⭐";
      case "used_good":
        return "👍";
      case "refurbished":
        return "🔧";
      default:
        return "🔧";
    }
  };

  return (
    <>
      <SEO
        title="Ferrari Parts | JP Performance Cars"
        description="Exclusive Ferrari supercar parts. Genuine OEM and performance upgrades for 458, 488, F8, F12, 812 and more."
        canonical="https://www.jpperformancecars.co.uk/ferrari-parts"
      />

      <Container maxWidth="xl" sx={{ mt: { xs: "20%", sm: "15%", md: "10%" } }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Premium Header */}
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="h2"
              sx={{
                fontFamily: "Times New Roman, serif",
                fontWeight: "bold",
                color: "#DC143C",
                mb: 2,
                textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              🏎️ FERRARI PARTS
            </Typography>
            <Typography
              variant="h5"
              sx={{ color: "#666", mb: 1, fontStyle: "italic" }}
            >
              Exclusive Supercar Components
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "#888", maxWidth: 600, mx: "auto" }}
            >
              Genuine Ferrari OEM parts and premium performance upgrades.
              Carefully curated from our exclusive inventory.
            </Typography>
          </Box>

          {/* Premium Search Interface */}
          <Card
            sx={{
              mb: 4,
              background: "linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)",
              border: "2px solid #DC143C",
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Search Parts"
                    placeholder="Carbon fiber, brake discs, exhaust..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <Search sx={{ mr: 1, color: "#DC143C" }} />
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": { borderColor: "#DC143C" },
                        "&.Mui-focused fieldset": { borderColor: "#DC143C" },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Ferrari Model</InputLabel>
                    <Select
                      value={selectedModel}
                      label="Ferrari Model"
                      onChange={(e) => setSelectedModel(e.target.value)}
                    >
                      <MenuItem value="">All Models</MenuItem>
                      {FERRARI_MODELS.map((model) => (
                        <MenuItem key={model} value={model}>
                          {model}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={selectedCategory}
                      label="Category"
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <MenuItem value="">All Categories</MenuItem>
                      {Object.keys(PART_CATEGORIES).map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleSearch}
                    disabled={isLoading}
                    sx={{
                      backgroundColor: "#DC143C",
                      "&:hover": { backgroundColor: "#B12A37" },
                      py: 1.5,
                      fontWeight: "bold",
                    }}
                  >
                    {isLoading ? "Searching..." : "SEARCH"}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Premium Parts Display */}
          {parts.length > 0 && (
            <Grid container spacing={3}>
              {parts.map((part) => (
                <Grid item xs={12} sm={6} lg={4} key={part.id}>
                  <motion.div
                    whileHover={{
                      y: -8,
                      boxShadow: "0px 12px 35px rgba(220,20,60,0.2)",
                    }}
                    style={{ height: "100%" }}
                  >
                    <Card
                      sx={{
                        height: "100%",
                        position: "relative",
                        border: `2px solid ${
                          part.rarity_level === "extremely_rare"
                            ? "#FFD700"
                            : "#e0e0e0"
                        }`,
                        borderRadius: 3,
                        overflow: "visible",
                      }}
                    >
                      {/* Rarity Badge */}
                      {part.rarity_level && part.rarity_level !== "common" && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: -12,
                            right: 16,
                            backgroundColor: getRarityColor(part.rarity_level),
                            color: "white",
                            px: 2,
                            py: 0.5,
                            borderRadius: 2,
                            fontSize: "0.75rem",
                            fontWeight: "bold",
                            zIndex: 1,
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Diamond sx={{ fontSize: "0.8rem" }} />
                          {part.rarity_level?.replace("_", " ").toUpperCase()}
                        </Box>
                      )}

                      <CardContent sx={{ p: 3 }}>
                        {/* Brand & Condition */}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 2,
                          }}
                        >
                          <Chip
                            avatar={
                              <Avatar sx={{ bgcolor: "#DC143C" }}>🏎️</Avatar>
                            }
                            label={part.brand}
                            sx={{ fontWeight: "bold" }}
                          />
                          <Chip
                            label={`${getConditionIcon(
                              part.condition
                            )} ${part.condition
                              ?.replace("_", " ")
                              .toUpperCase()}`}
                            size="small"
                            variant="outlined"
                          />
                        </Box>

                        {/* Part Name */}
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: "bold",
                            mb: 1,
                            minHeight: 48,
                            color: "#333",
                          }}
                        >
                          {part.name}
                        </Typography>

                        {/* Ferrari Models */}
                        {part.ferrari_models &&
                          part.ferrari_models.length > 0 && (
                            <Box sx={{ mb: 2 }}>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ display: "block", mb: 0.5 }}
                              >
                                Compatible Models:
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 0.5,
                                }}
                              >
                                {part.ferrari_models
                                  .slice(0, 2)
                                  .map((model) => (
                                    <Chip
                                      key={model}
                                      label={model}
                                      size="small"
                                      variant="outlined"
                                    />
                                  ))}
                                {part.ferrari_models.length > 2 && (
                                  <Chip
                                    label={`+${
                                      part.ferrari_models.length - 2
                                    } more`}
                                    size="small"
                                  />
                                )}
                              </Box>
                            </Box>
                          )}

                        {/* Description */}
                        <Typography
                          variant="body2"
                          sx={{ mb: 2, minHeight: 60, color: "#666" }}
                        >
                          {part.description}
                        </Typography>

                        {/* Part Numbers */}
                        {part.ferrari_part_number && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block", mb: 1 }}
                          >
                            Ferrari P/N: {part.ferrari_part_number}
                          </Typography>
                        )}

                        {/* Price & Availability */}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2,
                          }}
                        >
                          <Box>
                            <Typography
                              variant="h5"
                              sx={{ fontWeight: "bold", color: "#DC143C" }}
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
                          <Chip
                            icon={
                              part.availability === "in_stock" ? (
                                <Verified />
                              ) : (
                                <LocalShipping />
                              )
                            }
                            label={
                              part.availability === "in_stock"
                                ? "IN STOCK"
                                : part.availability === "rare_find"
                                ? "RARE FIND"
                                : part.availability.toUpperCase()
                            }
                            color={
                              part.availability === "in_stock" ||
                              part.availability === "rare_find"
                                ? "success"
                                : "warning"
                            }
                            sx={{ fontWeight: "bold" }}
                          />
                        </Box>

                        {/* Provenance */}
                        {part.provenance && (
                          <Box
                            sx={{
                              backgroundColor: "#f9f9f9",
                              p: 1.5,
                              borderRadius: 1,
                              mb: 2,
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: "block", mb: 0.5 }}
                            >
                              Provenance:
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontStyle: "italic" }}
                            >
                              {part.provenance}
                            </Typography>
                          </Box>
                        )}

                        {/* Action Button */}
                        <Button
                          fullWidth
                          variant="contained"
                          size="large"
                          onClick={() => handleAddToCart(part)}
                          disabled={part.availability === "out_of_stock"}
                          sx={{
                            backgroundColor: "#DC143C",
                            "&:hover": { backgroundColor: "#B12A37" },
                            fontWeight: "bold",
                            py: 1.5,
                          }}
                        >
                          {part.availability === "out_of_stock"
                            ? "SOLD OUT"
                            : part.availability === "rare_find"
                            ? "SECURE THIS RARE FIND"
                            : "ADD TO CART"}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          )}

          {/* No Results */}
          {parts.length === 0 && !isLoading && (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                No parts found matching your criteria
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search terms or browse all categories
              </Typography>
            </Box>
          )}
        </motion.div>
      </Container>
    </>
  );
};

export default FerrariPartsSearch;
