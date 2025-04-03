import React from "react";
import { Box, Container, Typography, Grid } from "@mui/material";
import { motion } from "framer-motion";
import { ColorBars } from "../elements/ColorBars";
import BuildIcon from "@mui/icons-material/Build";
import SecurityIcon from "@mui/icons-material/Security";
import EngineeringIcon from "@mui/icons-material/Engineering";
import { useNavigate } from "react-router-dom";
import SEO from "../SEO";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
      duration: 0.8,
      ease: "easeInOut",
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeInOut" },
  },
};

const supercarServices = [
  {
    title: "Supercar Maintenance Services",
    icon: <BuildIcon sx={{ fontSize: 40, color: "#a70a0c" }} />,
    description:
      "Factory-trained technicians providing comprehensive maintenance for Ferrari, Lamborghini, McLaren, Porsche, Bentley, and Maserati.",
    features: [
      "Full Service",
      "Timing Belt Service",
      "Timing Belt Replacement",
      "Major Service",
      "Air Conditioning Re-Gas and Recharge",
    ],
  },
  {
    title: "Specialist Repairs",
    icon: <EngineeringIcon sx={{ fontSize: 40, color: "#a70a0c" }} />,
    description:
      "Expert repair and maintenance services for all high-performance and luxury vehicles.",
    features: [
      "Brake Disc Skimming",
      "Alloy Wheel Refurbishment",
      "Diagnostics and Fault Finding",
      "Clutch Replacement and Repair",
      "High Performance Upgrades",
    ],
  },
  {
    title: "Supercar Care & Enhancement",
    icon: <SecurityIcon sx={{ fontSize: 40, color: "#a70a0c" }} />,
    description:
      "Comprehensive care and enhancement services for prestigious vehicles.",
    features: [
      "Detailing and Specialist Valeting",
      "Paint Protection Services",
      "Interior Restoration",
      "Ceramic Coating",
      "Paint Correction",
    ],
  },
];

const ServicesPage: React.FC = () => {
  const navigate = useNavigate();

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Supercar Maintenance and Repairs",
    provider: {
      "@type": "AutoRepair",
      name: "JP Performance Cars",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Unit 10, Metal Products Business Park, Prospect Road",
        addressLocality: "Burntwood",
        addressRegion: "Staffordshire",
        postalCode: "WS7 0AE",
        addressCountry: "UK",
      },
    },
    areaServed: {
      "@type": "Place",
      name: "Staffordshire and West Midlands",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Supercar Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Ferrari Servicing",
            description:
              "Full service, timing belt replacement and major service for Ferrari vehicles",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Lamborghini Maintenance",
            description:
              "Specialist repair and maintenance for Lamborghini models",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "McLaren Servicing",
            description:
              "Factory-level maintenance and repairs for McLaren supercars",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Porsche Specialist Repairs",
            description:
              "Performance upgrades, diagnostics and repairs for Porsche vehicles",
          },
        },
      ],
    },
  };

  return (
    <>
      <SEO
        title="Supercar Services & Repairs | JP Performance Cars | Supercar Specialists"
        description="Expert supercar maintenance for Ferrari, Lamborghini, McLaren, Porsche and luxury vehicles in Staffordshire. Timing belt service, diagnostics, and specialist repairs."
        keywords="Ferrari servicing Staffordshire, Lamborghini repair specialist, McLaren maintenance Burntwood, Porsche service Midlands, supercar diagnostics, timing belt replacement"
        canonical="https://www.jpperformancecars.co.uk/services"
        structuredData={serviceSchema}
      />

      <Box sx={{ backgroundColor: "#fff", minHeight: "100vh" }}>
        <Container
          maxWidth="lg"
          sx={{
            marginTop: {
              xs: "20%",
              sm: "15%",
              md: "15%",
              lg: "14%",
              xl: "10%",
            },
          }}
        >
          {/* Title Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-150px" }}
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
                  color: "#000",
                }}
              >
                SUPERCAR SERVICES
              </Typography>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
                <ColorBars />
              </Box>
            </motion.div>
          </motion.div>

          {/* Services Grid */}
          <Grid container spacing={4}>
            {supercarServices.map((service, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Box
                    sx={{
                      backgroundColor: "#f5f5f5",
                      p: 4,
                      height: "100%",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      transition: "box-shadow 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
                      },
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "3px",
                        background: "#a70a0c",
                      },
                      position: "relative",
                    }}
                  >
                    <Box sx={{ textAlign: "center", mb: 3 }}>
                      {service.icon}
                    </Box>

                    <Typography
                      sx={{
                        fontFamily: "'Times New Roman', serif",
                        fontSize: "1.5rem",
                        mb: 2,
                        textAlign: "center",
                        color: "#000",
                        letterSpacing: "1px",
                      }}
                    >
                      {service.title}
                    </Typography>

                    <Typography
                      sx={{
                        fontFamily: "'Montserrat', sans-serif",
                        color: "#5f5f5f",
                        mb: 3,
                        textAlign: "center",
                        lineHeight: 1.8,
                      }}
                    >
                      {service.description}
                    </Typography>

                    <Box sx={{ mt: 3 }}>
                      {service.features.map((feature, idx) => (
                        <Typography
                          key={idx}
                          sx={{
                            fontFamily: "'Montserrat', sans-serif",
                            color: "#5f5f5f",
                            mb: 1,
                            pl: 2,
                            position: "relative",
                            "&::before": {
                              content: '"•"',
                              position: "absolute",
                              left: 0,
                              color: "#a70a0c",
                            },
                          }}
                        >
                          {feature}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* Ferrari Service Price Section */}
          <Box id="pricing-section" sx={{ mt: 8, mb: 4 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontFamily: "'Times New Roman', serif",
                  fontSize: "2rem",
                  mb: 3,
                  color: "#000",
                  letterSpacing: "1px",
                }}
              >
                Supercar Service Pricing
              </Typography>

              <Typography
                sx={{
                  fontFamily: "'Montserrat', sans-serif",
                  color: "#5f5f5f",
                  mb: 2,
                  lineHeight: 1.8,
                }}
              >
                For more information about our Servicing options, including
                prices and availability, call Jason on{" "}
                <Box
                  component="span"
                  sx={{
                    fontWeight: "bold",
                    color: "#000",
                  }}
                >
                  +44 (0)7391 710867
                </Box>{" "}
                or{" "}
                <Box
                  component="span"
                  sx={{
                    color: "#a70a0c",
                    cursor: "pointer",
                    "&:hover": { textDecoration: "underline" },
                  }}
                  onClick={() => {
                    navigate("/");
                    setTimeout(() => {
                      document
                        .getElementById("service-form")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }}
                >
                  contact us
                </Box>{" "}
                online and we'll get back to you.
              </Typography>
            </motion.div>
          </Box>

          {/* Additional Services List */}
          <Box sx={{ mt: 4, mb: 8 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: "'Times New Roman', serif",
                      fontSize: "1.5rem",
                      mb: 3,
                      color: "#000",
                      letterSpacing: "1px",
                    }}
                  >
                    Brands We Service
                  </Typography>
                  {[
                    "Ferrari",
                    "Lamborghini",
                    "McLaren",
                    "Porsche",
                    "Bentley",
                    "Maserati",
                    "Other Supercars",
                  ].map((brand, index) => (
                    <Typography
                      key={index}
                      sx={{
                        fontFamily: "'Montserrat', sans-serif",
                        color: "#5f5f5f",
                        mb: 1.5,
                        pl: 2,
                        position: "relative",
                        "&::before": {
                          content: '">"',
                          position: "absolute",
                          left: 0,
                          color: "#a70a0c",
                        },
                      }}
                    >
                      {brand}
                    </Typography>
                  ))}
                </motion.div>
              </Grid>
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: "'Times New Roman', serif",
                      fontSize: "1.5rem",
                      mb: 3,
                      color: "#000",
                      letterSpacing: "1px",
                    }}
                  >
                    Service Options
                  </Typography>
                  {[
                    "Full Service",
                    "Timing Belt Service",
                    "Timing Belt Replacement",
                    "Timing Belts and Major Service",
                    "Air Conditioning Re-Gas and Recharge",
                    "Brake Disc Skimming",
                    "Alloy Wheel Refurbishment",
                    "Diagnostics and Fault Finding",
                    "Detailing and Specialist Valeting",
                    "High Performance Upgrades",
                    "Clutch Replacement and Repair",
                  ].map((service, index) => (
                    <Typography
                      key={index}
                      sx={{
                        fontFamily: "'Montserrat', sans-serif",
                        color: "#5f5f5f",
                        mb: 1.5,
                        pl: 2,
                        position: "relative",
                        "&::before": {
                          content: '">"',
                          position: "absolute",
                          left: 0,
                          color: "#a70a0c",
                        },
                      }}
                    >
                      {service}
                    </Typography>
                  ))}
                </motion.div>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default ServicesPage;
