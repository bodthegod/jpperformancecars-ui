import React from "react";
import { Box, Typography } from "@mui/material";
import styled from "@emotion/styled";
import { motion } from "framer-motion";

const HeroContainer = styled(Box)`
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const VideoBackground = styled.video`
  position: absolute;
  right: 0;
  bottom: 0;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  z-index: -1;
  object-fit: cover;
`;

const ContentOverlay = styled(Box)`
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.4); // Optional: adds a slight dark overlay
`;

const HeroText = styled(Typography)`
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  font-family: "Montserrat", sans-serif;
`;

const HeroSection: React.FC = () => {
  return (
    <HeroContainer>
      <VideoBackground
        autoPlay
        muted
        loop
        playsInline
        poster="/path-to-fallback-image.jpg" // Optional: fallback image while video loads
      >
        <source src="/path-to-your-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </VideoBackground>

      <ContentOverlay>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <HeroText
            variant="h5"
            sx={{
              fontWeight: 500,
              fontSize: { xs: "1.2rem", md: "1.5rem" },
            }}
          >
            Specialist supercar servicing and maintenance in the heart of the
            Midlands.
          </HeroText>
        </motion.div>
      </ContentOverlay>
    </HeroContainer>
  );
};

export default HeroSection;
