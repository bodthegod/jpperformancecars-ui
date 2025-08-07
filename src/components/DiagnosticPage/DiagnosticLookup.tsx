import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Divider,
} from "@mui/material";
import {
  Search,
  DirectionsCar,
  Build,
  Speed,
  ShoppingCart,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { obdCodesApi, vehiclesApi, partsApi } from "../../lib/supabase";
import { OBDCode, VehicleMake, VehicleModel, Part } from "../../types/types";
import { ColorBars } from "../elements/ColorBars";
import SEO from "../SEO";
import { useCart } from "../../contexts/CartContext";
import PageContainer from "../layout/PageContainer";
import OBDSubmissionForm from "./OBDSubmissionForm";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`search-tabpanel-${index}`}
      aria-labelledby={`search-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const DiagnosticLookup: React.FC = () => {
  const { addItem } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<OBDCode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Vehicle selection
  const [selectedMake, setSelectedMake] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<number | "">("");
  const [makes, setMakes] = useState<VehicleMake[]>([]);
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [vehicleParts, setVehicleParts] = useState<Part[]>([]);

  // Tab management
  const [tabValue, setTabValue] = useState(0);

  // OBD submission form
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Load vehicle makes on component mount
  useEffect(() => {
    const loadMakes = async () => {
      try {
        const makesData = await vehiclesApi.getMakes();
        setMakes(makesData);
      } catch (err) {
        console.error("Error loading makes:", err);
      }
    };
    loadMakes();
  }, []);

  // Load models when make changes
  useEffect(() => {
    const loadModels = async () => {
      if (selectedMake) {
        try {
          const modelsData = await vehiclesApi.getModels(selectedMake);
          setModels(modelsData);
          setSelectedModel("");
          setSelectedYear("");
        } catch (err) {
          console.error("Error loading models:", err);
        }
      } else {
        setModels([]);
        setSelectedModel("");
        setSelectedYear("");
      }
    };
    loadModels();
  }, [selectedMake]);

  // Load vehicle-specific parts when vehicle is selected
  useEffect(() => {
    const loadVehicleParts = async () => {
      if (selectedMake && selectedModel && selectedYear) {
        try {
          // First, get or create the vehicle
          let vehicle;
          try {
            vehicle = await vehiclesApi.getByMakeModelYear(
              selectedMake,
              selectedModel,
              selectedYear as number
            );
          } catch {
            // Vehicle doesn't exist, create it
            vehicle = await vehiclesApi.create({
              make: selectedMake,
              model: selectedModel,
              year: selectedYear as number,
            });
          }

          // Get all parts (since admin doesn't link parts to specific vehicles yet)
          const parts = await partsApi.getAll();
          setVehicleParts(parts);
        } catch (err) {
          console.error("Error loading vehicle parts:", err);
        }
      } else {
        setVehicleParts([]);
      }
    };
    loadVehicleParts();
  }, [selectedMake, selectedModel, selectedYear]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const results = await obdCodesApi.search(query.trim());
      setSearchResults(results);

      // Add to recent searches
      const updatedSearches = [
        query.trim(),
        ...recentSearches.filter((s) => s !== query.trim()),
      ].slice(0, 5);
      setRecentSearches(updatedSearches);
      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
    } catch (err) {
      setError("Failed to search for diagnostic codes. Please try again.");
      console.error("Search error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "default";
    }
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

  const diagnosticSchema = {
    "@context": "https://schema.org",
    "@type": ["WebPage", "WebApplication"],
    name: "Ferrari OBD Diagnostic Code Lookup | Supercar Parts & Solutions",
    description:
      "Professional Ferrari diagnostic code lookup tool. Search OBD trouble codes, find genuine parts, and get expert repair solutions. Over 60,000 parts in stock with next-day delivery.",
    url: "https://www.jpperformancecars.co.uk/diagnostic",
    applicationCategory: "AutomotiveApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      description: "Professional Ferrari diagnostic and parts services",
      seller: {
        "@type": "Organization",
        name: "JP Performance Cars",
        url: "https://www.jpperformancecars.co.uk",
      },
    },
    keywords:
      "Ferrari OBD codes, diagnostic trouble codes, Ferrari parts, supercar diagnostic, OBD code lookup, Ferrari repair, DTC codes",
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddToCart = (part: Part) => {
    addItem(part);
  };

  return (
    <>
      <SEO
        title="Ferrari OBD Diagnostic Code Lookup | Supercar Parts & Solutions | JP Performance Cars"
        description="Professional Ferrari OBD code lookup & diagnostic tool. Search trouble codes, find genuine parts, and get expert repair solutions. 60,000+ parts in stock. Next-day delivery available."
        keywords="Ferrari OBD codes, Ferrari diagnostic, supercar OBD codes, Ferrari trouble codes, OBD code lookup, Ferrari parts, diagnostic trouble codes, Ferrari repair, DTC codes, Ferrari OBD scanner, supercar diagnostic"
        canonical="https://www.jpperformancecars.co.uk/diagnostic"
        structuredData={diagnosticSchema}
      />

      <PageContainer maxWidth="lg" additionalSpacing={30}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
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
              DIAGNOSTIC CODE LOOKUP
            </Typography>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
              <ColorBars />
            </Box>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Typography
              variant="h6"
              align="center"
              sx={{ mb: 2, color: "#666", maxWidth: 600, mx: "auto" }}
            >
              Find diagnostic codes and compatible parts for your specific
              vehicle
            </Typography>
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography
                variant="body2"
                color="primary"
                sx={{ fontWeight: "bold" }}
              ></Typography>
              <Typography variant="body2" color="text.secondary">
                Want to help the community? Submit a new OBD code!
              </Typography>

              {/* Add OBD Code Button */}
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={() => setShowSubmissionForm(true)}
                  sx={{
                    borderColor: "#006620",
                    color: "#006620",
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                      borderColor: "#004d1a",
                    },
                    px: 3,
                    py: 1,
                  }}
                >
                  🚀 Submit New OBD Code
                </Button>
                <Typography
                  variant="caption"
                  display="block"
                  sx={{ mt: 1, opacity: 0.8 }}
                ></Typography>
              </Box>
            </Box>
          </motion.div>

          {/* Search Tabs */}
          <motion.div variants={itemVariants}>
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
              <Tabs value={tabValue} onChange={handleTabChange} centered>
                <Tab
                  icon={<DirectionsCar />}
                  label="OBD Code Search"
                  iconPosition="start"
                />
                <Tab
                  icon={<Build />}
                  label="Vehicle Parts"
                  iconPosition="start"
                />
              </Tabs>
            </Box>
          </motion.div>

          {/* OBD Code Search Tab */}
          <TabPanel value={tabValue} index={0}>
            <motion.div variants={itemVariants}>
              <Box component="form" onSubmit={handleSubmit} sx={{ mb: 6 }}>
                <Grid container spacing={2} justifyContent="center">
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      value={searchQuery}
                      onChange={(e) =>
                        setSearchQuery(e.target.value.toUpperCase())
                      }
                      placeholder="Enter OBD Code (e.g., P0123)"
                      variant="outlined"
                      size="medium"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <DirectionsCar />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            {isLoading && <CircularProgress size={20} />}
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          fontSize: "1.1rem",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={isLoading || !searchQuery.trim()}
                      startIcon={<Search />}
                      sx={{
                        borderRadius: 2,
                        px: 4,
                        py: 1.5,
                        fontSize: "1.1rem",
                        backgroundColor: "#006620",
                        "&:hover": {
                          backgroundColor: "#004d1a",
                        },
                      }}
                    >
                      {isLoading ? "Searching..." : "Search"}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </motion.div>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <motion.div variants={itemVariants}>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Recent Searches:
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {recentSearches.map((search, index) => (
                      <Chip
                        key={index}
                        label={search}
                        onClick={() => {
                          setSearchQuery(search);
                          handleSearch(search);
                        }}
                        variant="outlined"
                        sx={{ cursor: "pointer" }}
                      />
                    ))}
                  </Box>
                </Box>
              </motion.div>
            )}

            {error && (
              <motion.div variants={itemVariants}>
                <Alert severity="error" sx={{ mb: 4 }}>
                  {error}
                </Alert>
              </motion.div>
            )}

            {/* Search Results */}
            {searchResults.length > 0 && (
              <motion.div variants={itemVariants}>
                <Typography variant="h5" sx={{ mb: 3 }}>
                  Search Results ({searchResults.length})
                </Typography>
                <Grid container spacing={3}>
                  {searchResults.map((code) => (
                    <Grid item xs={12} md={6} key={code.id}>
                      <Card
                        component={motion.div}
                        whileHover={{ y: -5 }}
                        sx={{
                          height: "100%",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            boxShadow: 4,
                          },
                        }}
                        onClick={() => {
                          window.location.href = `/diagnostic/${code.code.toLowerCase()}`;
                        }}
                      >
                        <CardContent>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              mb: 2,
                            }}
                          >
                            <Typography variant="h5" fontWeight="bold">
                              {code.code}
                            </Typography>
                            <Chip
                              label={code.severity.toUpperCase()}
                              color={getSeverityColor(code.severity)}
                              size="small"
                            />
                          </Box>
                          <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                          >
                            {code.description}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Click to view detailed solutions and parts
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            )}
          </TabPanel>

          {/* Vehicle Parts Tab */}
          <TabPanel value={tabValue} index={1}>
            <motion.div variants={itemVariants}>
              <Box sx={{ textAlign: "center", mb: 4 }}>
                <Typography variant="h5" sx={{ mb: 1, fontWeight: "bold" }}>
                  SELECT YOUR VEHICLE
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Browse our automotive parts catalog
                </Typography>
              </Box>

              <Grid container spacing={3} justifyContent="center">
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Make</InputLabel>
                    <Select
                      value={selectedMake}
                      label="Make"
                      onChange={(e) => setSelectedMake(e.target.value)}
                    >
                      {makes.map((make) => (
                        <MenuItem key={make.id} value={make.id}>
                          {make.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth disabled={!selectedMake}>
                    <InputLabel>Model</InputLabel>
                    <Select
                      value={selectedModel}
                      label="Model"
                      onChange={(e) => setSelectedModel(e.target.value)}
                    >
                      {models.map((model) => (
                        <MenuItem key={model.id} value={model.name}>
                          {model.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth disabled={!selectedModel}>
                    <InputLabel>Year</InputLabel>
                    <Select
                      value={selectedYear}
                      label="Year"
                      onChange={(e) =>
                        setSelectedYear(e.target.value as number)
                      }
                    >
                      {selectedModel &&
                        models
                          .find((m) => m.name === selectedModel)
                          ?.years.map((year) => (
                            <MenuItem key={year} value={year}>
                              {year}
                            </MenuItem>
                          ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {vehicleParts.length > 0 && (
                <motion.div variants={itemVariants}>
                  <Box sx={{ mt: 4 }}>
                    <Box sx={{ textAlign: "center", mb: 4 }}>
                      <Typography
                        variant="h4"
                        sx={{ mb: 1, fontWeight: "bold" }}
                      >
                        AUTOMOTIVE PARTS CATALOG
                      </Typography>
                      <Typography variant="h6" color="primary">
                        {vehicleParts.length} Parts Available • Professional
                        Quality Parts
                      </Typography>
                    </Box>

                    <Grid container spacing={3}>
                      {vehicleParts.map((part) => (
                        <Grid item xs={12} sm={6} md={4} key={part.id}>
                          <motion.div
                            whileHover={{
                              y: -8,
                              boxShadow: "0px 8px 25px rgba(0,0,0,0.15)",
                            }}
                            style={{ height: "100%" }}
                          >
                            <Card
                              sx={{
                                height: "100%",
                                transition: "all 0.3s ease",
                                border:
                                  part.availability === "in_stock"
                                    ? "2px solid #4caf50"
                                    : "1px solid #e0e0e0",
                                position: "relative",
                                overflow: "visible",
                              }}
                            >
                              {/* Stock Badge */}
                              {part.availability === "in_stock" && (
                                <Box
                                  sx={{
                                    position: "absolute",
                                    top: -8,
                                    right: 16,
                                    backgroundColor: "#4caf50",
                                    color: "white",
                                    px: 2,
                                    py: 0.5,
                                    borderRadius: 2,
                                    fontSize: "0.75rem",
                                    fontWeight: "bold",
                                    zIndex: 1,
                                  }}
                                >
                                  ✓ IN STOCK
                                </Box>
                              )}

                              <CardContent>
                                <Typography
                                  variant="h6"
                                  sx={{
                                    mb: 1,
                                    fontWeight: "bold",
                                    minHeight: 48,
                                  }}
                                >
                                  {part.name}
                                </Typography>

                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    mb: 1,
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    color="primary"
                                    fontWeight="bold"
                                  >
                                    {part.brand}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mx: 1 }}
                                  >
                                    •
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {part.category}
                                  </Typography>
                                </Box>

                                {part.part_number && (
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ display: "block", mb: 1 }}
                                  >
                                    Part #: {part.part_number}
                                  </Typography>
                                )}

                                <Typography
                                  variant="body2"
                                  sx={{ mb: 2, minHeight: 40 }}
                                >
                                  {part.description}
                                </Typography>

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
                                      color="primary"
                                      fontWeight="bold"
                                    >
                                      £{part.price.toFixed(2)}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      Ex. VAT
                                    </Typography>
                                  </Box>
                                  <Chip
                                    label={
                                      part.availability === "in_stock"
                                        ? "IN STOCK"
                                        : part.availability === "backorder"
                                        ? "BACKORDER"
                                        : "OUT OF STOCK"
                                    }
                                    color={
                                      part.availability === "in_stock"
                                        ? "success"
                                        : part.availability === "backorder"
                                        ? "warning"
                                        : "error"
                                    }
                                    size="small"
                                    sx={{ fontWeight: "bold" }}
                                  />
                                </Box>

                                {/* Delivery Info */}
                                {part.availability === "in_stock" && (
                                  <Box
                                    sx={{
                                      backgroundColor: "#e8f5e8",
                                      p: 1,
                                      borderRadius: 1,
                                      mb: 2,
                                    }}
                                  >
                                    <Typography
                                      variant="caption"
                                      color="success.dark"
                                      sx={{ fontWeight: "bold" }}
                                    >
                                      🚚 Next Day Delivery Available
                                    </Typography>
                                  </Box>
                                )}

                                <Button
                                  fullWidth
                                  variant="contained"
                                  size="large"
                                  startIcon={<ShoppingCart />}
                                  onClick={() => handleAddToCart(part)}
                                  disabled={
                                    part.availability === "out_of_stock"
                                  }
                                  sx={{
                                    backgroundColor:
                                      part.availability === "in_stock"
                                        ? "#006620"
                                        : "#ff9800",
                                    "&:hover": {
                                      backgroundColor:
                                        part.availability === "in_stock"
                                          ? "#004d1a"
                                          : "#f57c00",
                                    },
                                    fontWeight: "bold",
                                    py: 1.5,
                                  }}
                                >
                                  {part.availability === "in_stock"
                                    ? "ADD TO BASKET"
                                    : part.availability === "backorder"
                                    ? "ORDER (3-5 DAYS)"
                                    : "OUT OF STOCK"}
                                </Button>
                              </CardContent>
                            </Card>
                          </motion.div>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </motion.div>
              )}

              {selectedMake &&
                selectedModel &&
                selectedYear &&
                vehicleParts.length === 0 && (
                  <motion.div variants={itemVariants}>
                    <Alert severity="info" sx={{ mt: 4 }}>
                      No compatible parts found for this vehicle. Please check
                      back later or contact us for assistance.
                    </Alert>
                  </motion.div>
                )}
            </motion.div>
          </TabPanel>
        </motion.div>

        {/* OBD Submission Form Modal */}
        {showSubmissionForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 1300,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
              overflow: "auto",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowSubmissionForm(false);
              }
            }}
          >
            <Box
              sx={{
                maxWidth: 900,
                width: "100%",
                maxHeight: "90vh",
                overflow: "auto",
              }}
            >
              <OBDSubmissionForm
                onSubmit={(submission) => {
                  console.log("OBD submission:", submission);
                  // Here you would typically send to your API
                }}
                onClose={() => setShowSubmissionForm(false)}
              />
            </Box>
          </motion.div>
        )}
      </PageContainer>
    </>
  );
};

export default DiagnosticLookup;
