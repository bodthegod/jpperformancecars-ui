import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  DirectionsCar,
  Build,
  ShoppingCart,
  ExpandMore,
  CheckCircle,
  Warning,
  Error,
  ArrowBack,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { obdCodesApi } from "../../lib/supabase";
import { OBDCode, Solution, Part } from "../../types/types";
import { ColorBars } from "../elements/ColorBars";
import SEO from "../SEO";
import { useCart } from "../../contexts/CartContext";
import OBDFAQSection from "./OBDFAQSection";
import PageContainer from "../layout/PageContainer";

interface OBDCodeWithSolutions extends OBDCode {
  solutions: (Solution & {
    solution_parts: Array<{
      parts: Part;
    }>;
  })[];
}

const OBDCodePage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [obdCode, setObdCode] = useState<OBDCodeWithSolutions | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOBDCode = async () => {
      if (!code) return;

      setIsLoading(true);
      setError(null);

      try {
        const data = await obdCodesApi.getByCode(code.toUpperCase());
        setObdCode(data);
      } catch (err) {
        setError("Failed to load diagnostic code information.");
        console.error("Error fetching OBD code:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOBDCode();
  }, [code]);

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

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <Error />;
      case "medium":
        return <Warning />;
      case "low":
        return <CheckCircle />;
      default:
        return <CheckCircle />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "success";
      case "medium":
        return "warning";
      case "hard":
        return "error";
      default:
        return "default";
    }
  };

  const handleAddToCart = (part: Part) => {
    addItem(part);
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

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !obdCode) {
    return (
      <Container maxWidth="lg" sx={{ mt: { xs: "20%", sm: "15%", md: "10%" } }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error || "Diagnostic code not found."}
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

  // Enhanced SEO structured data for better Google visibility
  const codeSchema = {
    "@context": "https://schema.org",
    "@type": ["WebPage", "TechArticle"],
    name: `${obdCode.code} OBD Code: ${obdCode.description} | Ferrari Parts & Solutions`,
    description: `Complete guide to ${obdCode.code} diagnostic trouble code. Causes, solutions, and genuine Ferrari parts for ${obdCode.description}. Professional repair solutions available.`,
    url: `https://www.jpperformancecars.co.uk/diagnostic/${obdCode.code.toLowerCase()}`,
    mainEntity: {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: `What does OBD code ${obdCode.code} mean?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: obdCode.description,
          },
        },
        {
          "@type": "Question",
          name: `What causes ${obdCode.code} error code?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: obdCode.common_causes.join(", "),
          },
        },
      ],
    },
    about: {
      "@type": "Thing",
      name: `OBD Code ${obdCode.code}`,
      description: obdCode.description,
    },
    publisher: {
      "@type": "Organization",
      name: "JP Performance Cars",
      url: "https://www.jpperformancecars.co.uk",
    },
    dateModified: new Date().toISOString(),
    keywords: `${obdCode.code}, ${obdCode.description}, Ferrari diagnostic, OBD trouble code, Ferrari parts, supercar repair, ${obdCode.code} fix, Ferrari ${obdCode.code}`,
  };

  return (
    <>
      <SEO
        title={`${obdCode.code} OBD Code: ${obdCode.description} | Ferrari Parts & Repair Solutions`}
        description={`Fix ${
          obdCode.code
        } error code in your Ferrari. Expert diagnosis, genuine parts, and professional repair solutions. Common causes: ${obdCode.common_causes
          .slice(0, 2)
          .join(", ")}. Next-day delivery available.`}
        keywords={`${obdCode.code}, ${obdCode.code} Ferrari, ${obdCode.code} fix, ${obdCode.description}, Ferrari diagnostic, OBD trouble code, Ferrari parts, supercar repair, ${obdCode.code} solution, Ferrari OBD codes, diagnostic trouble code ${obdCode.code}`}
        canonical={`https://www.jpperformancecars.co.uk/diagnostic/${obdCode.code.toLowerCase()}`}
        structuredData={codeSchema}
      />

      <PageContainer maxWidth="lg" additionalSpacing={20}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Back Button */}
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

          {/* Header */}
          <motion.div variants={itemVariants}>
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography
                variant="h2"
                sx={{
                  fontFamily: "Times New Roman, sans-serif",
                  fontSize: { xs: "2rem", md: "3rem" },
                  letterSpacing: "2px",
                  lineHeight: "1.2",
                  mb: 2,
                }}
              >
                {obdCode.code}
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                <ColorBars />
              </Box>
              <Typography
                variant="h5"
                sx={{ color: "#666", maxWidth: 800, mx: "auto", mb: 3 }}
              >
                {obdCode.description}
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                <Chip
                  icon={getSeverityIcon(obdCode.severity)}
                  label={`Severity: ${obdCode.severity.toUpperCase()}`}
                  color={getSeverityColor(obdCode.severity) as any}
                  size="medium"
                />
              </Box>
            </Box>
          </motion.div>

          <Grid container spacing={4}>
            {/* Common Causes */}
            <Grid item xs={12} md={6}>
              <motion.div variants={itemVariants}>
                <Card sx={{ height: "100%" }}>
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
                      <Warning color="warning" />
                      Common Causes
                    </Typography>
                    <List>
                      {obdCode.common_causes.map((cause, index) => (
                        <ListItem key={index} sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <CheckCircle color="success" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={cause} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* Solutions */}
            <Grid item xs={12} md={6}>
              <motion.div variants={itemVariants}>
                <Card sx={{ height: "100%" }}>
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
                      <Build color="primary" />
                      Solutions ({obdCode.solutions.length})
                    </Typography>
                    {obdCode.solutions.map((solution, index) => (
                      <Accordion key={index} sx={{ mb: 1 }}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                              width: "100%",
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: "bold" }}
                            >
                              Solution {index + 1}
                            </Typography>
                            <Chip
                              label={solution.difficulty.toUpperCase()}
                              color={
                                getDifficultyColor(solution.difficulty) as any
                              }
                              size="small"
                            />
                            <Typography variant="body2" color="text.secondary">
                              Est. Time: {solution.estimated_time}
                            </Typography>
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography variant="body1" sx={{ mb: 2 }}>
                            {solution.description}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: "bold", mb: 1 }}
                          >
                            Steps:
                          </Typography>
                          <List dense>
                            {solution.steps.map((step, stepIndex) => (
                              <ListItem key={stepIndex} sx={{ py: 0.5 }}>
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                  <Typography
                                    variant="body2"
                                    color="primary"
                                    fontWeight="bold"
                                  >
                                    {stepIndex + 1}.
                                  </Typography>
                                </ListItemIcon>
                                <ListItemText primary={step} />
                              </ListItem>
                            ))}
                          </List>

                          {/* Related Parts */}
                          {solution.solution_parts.length > 0 && (
                            <>
                              <Divider sx={{ my: 2 }} />
                              <Typography
                                variant="subtitle2"
                                sx={{ fontWeight: "bold", mb: 1 }}
                              >
                                Related Parts:
                              </Typography>
                              <Grid container spacing={1}>
                                {solution.solution_parts.map(
                                  ({ parts: part }, partIndex) => (
                                    <Grid item xs={12} key={partIndex}>
                                      <Card variant="outlined" sx={{ p: 1 }}>
                                        <Box
                                          sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                          }}
                                        >
                                          <Box>
                                            <Typography
                                              variant="body2"
                                              fontWeight="bold"
                                            >
                                              {part.name}
                                            </Typography>
                                            <Typography
                                              variant="caption"
                                              color="text.secondary"
                                            >
                                              {part.brand} • {part.category}
                                            </Typography>
                                            <Typography
                                              variant="body2"
                                              fontWeight="bold"
                                              color="primary"
                                            >
                                              £{part.price.toFixed(2)}
                                            </Typography>
                                          </Box>
                                          <Box
                                            sx={{
                                              display: "flex",
                                              gap: 1,
                                              flexDirection: "column",
                                            }}
                                          >
                                            <Button
                                              size="small"
                                              variant="contained"
                                              startIcon={<ShoppingCart />}
                                              onClick={() =>
                                                handleAddToCart(part)
                                              }
                                              sx={{
                                                backgroundColor: "#006620",
                                                "&:hover": {
                                                  backgroundColor: "#004d1a",
                                                },
                                              }}
                                              disabled={
                                                part.availability !== "in_stock"
                                              }
                                            >
                                              {part.availability === "in_stock"
                                                ? "Add to Cart"
                                                : "Out of Stock"}
                                            </Button>
                                            {part.availability ===
                                              "in_stock" && (
                                              <Typography
                                                variant="caption"
                                                color="success.main"
                                                sx={{ textAlign: "center" }}
                                              >
                                                ✓ In Stock - Next Day Delivery
                                              </Typography>
                                            )}
                                            {part.availability ===
                                              "backorder" && (
                                              <Typography
                                                variant="caption"
                                                color="warning.main"
                                                sx={{ textAlign: "center" }}
                                              >
                                                ⏱ Backorder - 3-5 Days
                                              </Typography>
                                            )}
                                          </Box>
                                        </Box>
                                      </Card>
                                    </Grid>
                                  )
                                )}
                              </Grid>
                            </>
                          )}
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>

          {/* All Related Parts Section - Eurospares Inspired */}
          {obdCode.solutions.some((s) => s.solution_parts.length > 0) && (
            <motion.div variants={itemVariants}>
              <Box sx={{ mt: 4 }}>
                <Box sx={{ textAlign: "center", mb: 4 }}>
                  <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
                    RECOMMENDED PARTS FOR {obdCode.code}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    Genuine & Quality Aftermarket Parts • Next Day Delivery
                    Available
                  </Typography>
                </Box>

                <Grid container spacing={3}>
                  {obdCode.solutions
                    .flatMap((s) => s.solution_parts.map((sp) => sp.parts))
                    .filter(
                      (part, index, self) =>
                        self.findIndex((p) => p.id === part.id) === index
                    )
                    .map((part) => (
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

                            <CardContent sx={{ pb: 1 }}>
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

                              {/* Price and Availability Row */}
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

                              {part.availability === "backorder" && (
                                <Box
                                  sx={{
                                    backgroundColor: "#fff3e0",
                                    p: 1,
                                    borderRadius: 1,
                                    mb: 2,
                                  }}
                                >
                                  <Typography
                                    variant="caption"
                                    color="warning.dark"
                                    sx={{ fontWeight: "bold" }}
                                  >
                                    ⏱ Expected: 3-5 Working Days
                                  </Typography>
                                </Box>
                              )}

                              {/* Action Buttons */}
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: 1,
                                  flexDirection: "column",
                                }}
                              >
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

                                {part.availability !== "out_of_stock" && (
                                  <Button
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                      borderColor: "#006620",
                                      color: "#006620",
                                      "&:hover": {
                                        backgroundColor: "#f5f5f5",
                                      },
                                    }}
                                  >
                                    View Details
                                  </Button>
                                )}
                              </Box>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </Grid>
                    ))}
                </Grid>

                {/* Call to Action - Inspired by Eurospares */}
                <Box
                  sx={{
                    mt: 4,
                    textAlign: "center",
                    p: 3,
                    backgroundColor: "#f5f5f5",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Can't find the right part?
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Our specialists can help you find the exact part for your
                    vehicle
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#006620",
                      "&:hover": { backgroundColor: "#004d1a" },
                      px: 4,
                      py: 1.5,
                    }}
                  >
                    Contact Our Parts Experts
                  </Button>
                </Box>
              </Box>
            </motion.div>
          )}

          {/* FAQ Section for Enhanced SEO */}
          <OBDFAQSection obdCode={obdCode} />
        </motion.div>
      </PageContainer>
    </>
  );
};

export default OBDCodePage;
