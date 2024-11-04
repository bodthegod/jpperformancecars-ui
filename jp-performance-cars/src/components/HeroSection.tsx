// src/components/HeroSection.tsx
import React from "react";
import { Box, Typography } from "@mui/material";
import styled from "@emotion/styled";
import { motion } from "framer-motion";

const HeroContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url("https://example.com/hero-bg.jpg");
  background-size: cover;
  background-position: center;
`;

const HeroText = styled(Typography)`
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

const HeroSection: React.FC = () => {
  return (
    <HeroContainer>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <HeroText variant="h2">Welcome to JPPerformanceCars</HeroText>
        <HeroText variant="body1">
          Specializing in Ferraris, Lamborghinis, and Maseratis
        </HeroText>
      </motion.div>
    </HeroContainer>
  );
};

export default HeroSection;
