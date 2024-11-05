import React, { useState, useEffect } from "react";
import {
  AppBar,
  Typography,
  Button,
  Box,
  Container,
  Stack,
  IconButton,
  Drawer,
  Theme,
  useMediaQuery,
} from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import TwitterIcon from "@mui/icons-material/Twitter";
import PhoneIcon from "@mui/icons-material/Phone";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { motion } from "framer-motion";

const MotionIcon = motion.div;
const MotionStack = motion(Stack as any);
const MotionBox = motion(Box as any);

const topElementsVariants = {
  initial: {
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  scrolled: {
    y: 12,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const menuVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
  closed: {
    opacity: 0,
    y: 20,
    transition: { duration: 0.2 },
  },
};

export const iconHoverVariants = {
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

export interface SocialLink {
  platform: string;
  icon: React.ReactNode;
  url: string;
}

// Inside the component, add this array of social links
export const socialLinks: SocialLink[] = [
  {
    platform: "instagram",
    icon: <InstagramIcon sx={{ cursor: "pointer" }} />,
    url: "https://www.instagram.com/jpperformancecarsltd/?hl=en-gb",
  },
  {
    platform: "facebook",
    icon: <FacebookIcon sx={{ cursor: "pointer" }} />,
    url: "https://www.facebook.com/jpperformancecars/?locale=en_GB",
  },
  {
    platform: "youtube",
    icon: <YouTubeIcon sx={{ cursor: "pointer" }} />,
    url: "https://youtube.com/jpperformancecars",
  },
  {
    platform: "twitter",
    icon: <TwitterIcon sx={{ cursor: "pointer" }} />,
    url: "https://twitter.com/jpperformancecars",
  },
];

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

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
        height: isMobile ? "90px" : isScrolled ? "90px" : "175px",
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
            padding: isMobile ? "0" : isScrolled ? "0 24px" : "10px 24px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: isMobile ? 0 : isScrolled ? 0 : 3,
              mb: isMobile ? 0 : isScrolled ? -4 : 3,
              height: isMobile ? "80px" : isScrolled ? "60px" : "auto",
              transition: "all 0.3s ease-in-out",
            }}
          >
            {!isMobile && (
              <MotionStack
                direction="row"
                spacing={2}
                animate={isScrolled ? "scrolled" : "initial"}
                variants={topElementsVariants}
              >
                {socialLinks.map(({ platform, icon, url }) => (
                  <MotionIcon
                    key={platform}
                    variants={iconHoverVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.open(url, "_blank")}
                  >
                    {icon}
                  </MotionIcon>
                ))}
              </MotionStack>
            )}

            <Typography
              variant="h4"
              component="div"
              sx={{
                fontSize: isScrolled || isMobile ? "1.3rem" : "2.2rem",
                fontFamily: "'Times New Roman', sans-serif",
                fontWeight: "400",
                transition: "all 0.3s ease-in-out",
                letterSpacing: "2px",
                textAlign: "center",
                opacity: isMobile ? 1 : isScrolled ? 0 : 1,
                margin: isMobile ? "0 auto" : "0",
              }}
            >
              JPPERFORMANCECARS
            </Typography>

            {!isMobile && (
              <MotionBox
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
                animate={isScrolled ? "scrolled" : "initial"}
                variants={topElementsVariants}
              >
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
              </MotionBox>
            )}
          </Box>

          {!isMobile && (
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
          )}
        </Box>
      </Container>

      {isMobile && (
        <>
          <IconButton
            sx={{
              color: "white",
              position: "absolute",
              right: 20,
              top: 20,
            }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <MenuIcon />
          </IconButton>

          <Drawer
            anchor="right"
            open={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
            PaperProps={{
              sx: {
                width: "100%",
                backgroundColor: "black",
                opacity: 0.95,
                color: "white",
                padding: "20px",
              },
            }}
          >
            <IconButton
              sx={{
                color: "white",
                alignSelf: "flex-end",
                mb: 2,
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              <CloseIcon />
            </IconButton>

            <MotionBox
              initial="closed"
              animate="open"
              variants={menuVariants}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {["HOME", "SERVICES", "ABOUT", "CONTACT"].map((item) => (
                <Button
                  key={item}
                  color="inherit"
                  sx={{
                    fontWeight: 700,
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "1.2rem",
                    py: 2,
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </Button>
              ))}
            </MotionBox>
          </Drawer>
        </>
      )}
      <Box sx={{ display: "flex", height: "6px", gap: "30px", px: "20px" }}>
        <Box sx={{ flex: 1, backgroundColor: "#006620" }} />
        <Box sx={{ flex: 1, backgroundColor: "#e8e8e8" }} />
        <Box sx={{ flex: 1, backgroundColor: "#a70a0c" }} />
      </Box>
    </AppBar>
  );
};

export default Navbar;
