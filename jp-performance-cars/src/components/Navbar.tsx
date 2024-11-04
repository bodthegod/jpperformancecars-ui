import React, { useState, useEffect } from "react";
import {
  AppBar,
  Typography,
  Button,
  Box,
  Container,
  Stack,
} from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import TwitterIcon from "@mui/icons-material/Twitter";
import PhoneIcon from "@mui/icons-material/Phone";
import { motion } from "framer-motion";

const MotionIcon = motion.div;

const iconHoverVariants = {
  initial: {
    scale: 1,
    y: 0,
    color: "#ffffff",
  },
  hover: {
    scale: 1.1,
    y: -2,
    color: "#e0e0e0",
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "black",
        transition: "all 0.3s ease-in-out",
        height: isScrolled ? "90px" : "175px",
        boxShadow: "none",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            padding: isScrolled ? "0 24px" : "10px 2px",
          }}
        >
          {/* Top Row */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: isScrolled ? -4 : 6,
              height: isScrolled ? "60px" : "auto",
              opacity: isScrolled ? 0 : 1,
              transition: "all 0.3s ease-in-out",
            }}
          >
            {/* Social Icons */}
            <Stack direction="row" spacing={2}>
              {["instagram", "facebook", "youtube", "twitter"].map(
                (platform) => (
                  <MotionIcon
                    key={platform}
                    variants={iconHoverVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap={{ scale: 0.95 }}
                  >
                    {platform === "instagram" && (
                      <InstagramIcon sx={{ cursor: "pointer" }} />
                    )}
                    {platform === "facebook" && (
                      <FacebookIcon sx={{ cursor: "pointer" }} />
                    )}
                    {platform === "youtube" && (
                      <YouTubeIcon sx={{ cursor: "pointer" }} />
                    )}
                    {platform === "twitter" && (
                      <TwitterIcon sx={{ cursor: "pointer" }} />
                    )}
                  </MotionIcon>
                )
              )}
            </Stack>

            {/* Logo */}
            <Typography
              variant="h4"
              component="div"
              sx={{
                fontSize: isScrolled ? "1.8rem" : "2.2rem",
                fontFamily: "'Times New Roman', sans-serif",
                fontWeight: "400",
                transition: "all 0.3s ease-in-out",
                letterSpacing: "2px",
                textAlign: "center",
              }}
            >
              JPPERFORMANCECARS
            </Typography>

            {/* Phone Number */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PhoneIcon />
              <Typography
                sx={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 700,
                  letterSpacing: "0.5px",
                }}
              >
                +44 (0)1543 682388
              </Typography>
            </Box>
          </Box>

          {/* Navigation Links */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: "35px",
              mt: "auto",
              paddingBottom: "15px",
              "& .MuiButton-root": {
                fontWeight: 700,
                fontFamily: "'Montserrat', sans-serif",
              },
            }}
          >
            <Button color="inherit">HOME</Button>
            <Button color="inherit">SHOWROOM</Button>
            <Button color="inherit">SELL YOUR CAR</Button>
            <Button color="inherit">SERVICES</Button>
            <Button color="inherit">ABOUT</Button>
            <Button color="inherit">CONTACT</Button>
          </Box>
        </Box>
      </Container>

      {/* Colored lines at bottom */}
      <Box sx={{ display: "flex", height: "6px", gap: "30px", px: "20px" }}>
        <Box sx={{ flex: 1, backgroundColor: "#006620" }} />
        <Box sx={{ flex: 1, backgroundColor: "#e8e8e8" }} />
        <Box sx={{ flex: 1, backgroundColor: "#a70a0c" }} />
      </Box>
    </AppBar>
  );
};

export default Navbar;
