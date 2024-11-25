import React from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ColorBars } from "./elements/ColorBars";
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
  hidden: {
    opacity: 0,
    y: 15,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeInOut",
    },
  },
};

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ backgroundColor: "#fff", minHeight: "100vh" }}>
      <Container
        maxWidth="lg"
        sx={{
          marginTop: {
            xs: "20%",
            sm: "15%",
            md: "15%",
            lg: "14%",
            xl: "14%",
          },
          textAlign: "center",
        }}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <Typography
              variant="h1"
              sx={{
                fontFamily: "'Times New Roman', serif",
                fontSize: { xs: "120px", md: "180px" },
                color: "#000",
                mb: 2,
                letterSpacing: "2px",
              }}
            >
              404
            </Typography>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Typography
              sx={{
                fontFamily: "'Times New Roman', serif",
                color: "#a70a0c",
                fontSize: "1.5rem",
                mb: 3,
                letterSpacing: "2px",
              }}
            >
              PAGE NOT FOUND
            </Typography>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
              <ColorBars />
            </Box>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Typography
              sx={{
                fontFamily: "'Montserrat', sans-serif",
                color: "#5f5f5f",
                mb: 6,
                maxWidth: "600px",
                mx: "auto",
                lineHeight: 1.8,
                letterSpacing: "0.5px",
              }}
            >
              The page you're looking for seems to have taken a detour. Let our
              expert team guide you back to the main showroom, where our
              precision engineering and exceptional service await.
            </Typography>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Button
              onClick={() => navigate("/")}
              sx={{
                background: "#000",
                color: "#fff",
                padding: "12px 40px",
                borderRadius: "0",
                fontSize: "14px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                boxShadow: "none",
                border: "3px solid #4e4e4e",
                transition: "all 0.3s ease",
                fontWeight: 500,
                "&:hover": {
                  background: "#a70a0c",
                  borderColor: "#a70a0c",
                  boxShadow: "none",
                },
                "&:active": {
                  transform: "translateY(1px)",
                },
              }}
            >
              Return to Homepage
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
};

export default NotFound;
