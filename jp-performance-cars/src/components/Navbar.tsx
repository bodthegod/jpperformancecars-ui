import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
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
            padding: isScrolled ? "0 24px" : "10px 24px",
          }}
        >
          {/* Top Row */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 6,
            }}
          >
            {/* Social Icons */}
            <Stack direction="row" spacing={2}>
              <InstagramIcon sx={{ cursor: "pointer" }} />
              <FacebookIcon sx={{ cursor: "pointer" }} />
              <YouTubeIcon sx={{ cursor: "pointer" }} />
              <TwitterIcon sx={{ cursor: "pointer" }} />
            </Stack>

            {/* Logo */}
            <Typography
              variant="h4"
              component="div"
              sx={{
                fontSize: isScrolled ? "1.8rem" : "2.2rem",
                transition: "all 0.3s ease-in-out",
                fontWeight: "bold",
                letterSpacing: "2px",
                textAlign: "center",
              }}
            >
              Jp
            </Typography>

            {/* Phone Number */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PhoneIcon />
              <Typography>+44 (0)1234 567890</Typography>
            </Box>
          </Box>

          {/* Navigation Links */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              mt: "15px",
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
      <Box sx={{ display: "flex", height: "6px", gap: "30px", px: "30px" }}>
        <Box sx={{ flex: 1, backgroundColor: "#006620" }} />
        <Box sx={{ flex: 1, backgroundColor: "#e8e8e8" }} />
        <Box sx={{ flex: 1, backgroundColor: "#a70a0c" }} />
      </Box>
    </AppBar>
  );
};

export default Navbar;
