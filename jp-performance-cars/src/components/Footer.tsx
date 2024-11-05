import { Box, Container, Grid, Typography, Stack, styled } from "@mui/material";
import { Instagram, Facebook, YouTube, Twitter } from "@mui/icons-material";
import { motion } from "framer-motion";
import { iconHoverVariants } from "./Navbar";

const MotionIcon = motion.div;
const FooterHeading = styled(Typography)({
  marginBottom: "16px",
  letterSpacing: "4px",
  color: "white",
  fontSize: "14px",
  fontWeight: 600,
});

const FooterSection = styled(Box)({
  "& .section-lines": {
    display: "flex",
    gap: "10px",
    width: "40px",
    marginTop: "8px",
    marginBottom: "16px",
    "& > div": {
      height: "2px",
      flex: 1,
    },
  },
});

const Footer = () => {
  return (
    <Box sx={{ bgcolor: "black", color: "white", py: 4 }}>
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* Showroom Section */}
          <Grid item xs={12} md={3}>
            <FooterSection>
              <FooterHeading variant="h6">SERVICES</FooterHeading>
              <Box className="section-lines">
                <Box sx={{ backgroundColor: "#006620" }} />
              </Box>
              <Stack spacing={1}>
                <Typography variant="body2">Specialist Services</Typography>
                <Typography variant="body2">General Services</Typography>
                <Typography variant="body2">Previous Work</Typography>
              </Stack>
            </FooterSection>
          </Grid>

          {/* About Section */}
          <Grid item xs={12} md={3}>
            <FooterSection>
              <FooterHeading variant="h6">ABOUT</FooterHeading>
              <Box className="section-lines">
                <Box sx={{ backgroundColor: "#e8e8e8" }} />
              </Box>
              <Stack spacing={1}>
                <Typography variant="body2">Our Story</Typography>
                <Typography variant="body2">Why JP FAQ</Typography>
                <Typography variant="body2">Testimonials</Typography>
              </Stack>
            </FooterSection>
          </Grid>

          {/* Contact Section */}
          <Grid item xs={12} md={3}>
            <FooterSection>
              <FooterHeading variant="h6">CONTACT</FooterHeading>
              <Box className="section-lines">
                <Box sx={{ backgroundColor: "#a70a0c" }} />
              </Box>
              <Stack spacing={1}>
                <Typography variant="body2">How To Find Us</Typography>
                <Typography variant="body2">T +44 (0)1543 682388</Typography>
                <Typography variant="body2">
                  E sales@jpperformancecars.com
                </Typography>
              </Stack>
            </FooterSection>
          </Grid>

          {/* Logo and Social Icons */}
          <Grid item xs={12} md={3}>
            <Box sx={{ display: "inline-block" }}>
              {" "}
              {/* This will make the container shrink to content width */}
              <Box
                sx={{
                  display: "flex",
                  height: "2px",
                  gap: "0px",
                  mb: -1.5,
                  width: "100%",
                }}
              >
                <Box sx={{ flex: 1, backgroundColor: "#006620" }} />
                <Box sx={{ flex: 1, backgroundColor: "#e8e8e8" }} />
                <Box sx={{ flex: 1, backgroundColor: "#a70a0c" }} />
              </Box>
              <Typography
                variant="h4"
                sx={{
                  mb: 2,
                  fontSize: "4rem",
                  fontFamily: "'Times New Roman', serif",
                  letterSpacing: 2,
                  color: "white",
                }}
              >
                JP
              </Typography>
            </Box>
            <Stack direction="row" spacing={2}>
              {[
                {
                  icon: <Instagram />,
                  url: "https://www.instagram.com/jpperformancecarsltd/?hl=en-gb",
                },
                {
                  icon: <Facebook />,
                  url: "https://www.facebook.com/jpperformancecars/?locale=en_GB",
                },
                { icon: <Twitter />, link: "#" },
                { icon: <YouTube />, link: "#" },
              ].map((social, index) => (
                <MotionIcon
                  style={{ cursor: "pointer" }}
                  key={index}
                  variants={iconHoverVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.open(social.url, "_blank")}
                >
                  {social.icon}
                </MotionIcon>
              ))}
            </Stack>
          </Grid>
        </Grid>

        {/* Bottom Section */}
        <Box
          sx={{ mt: 4, pt: 4, borderTop: "1px solid rgba(255,255,255,0.1)" }}
        >
          <Grid container spacing={2} justifyContent="space-between">
            <Grid item>
              <Stack direction="row" spacing={2}>
                <Typography variant="body2" color="gray">
                  Terms & Conditions
                </Typography>
                <Typography variant="body2" color="gray">
                  |
                </Typography>
                <Typography variant="body2" color="gray">
                  Privacy Policy
                </Typography>
                <Typography variant="body2" color="gray">
                  |
                </Typography>
                <Typography variant="body2" color="gray">
                  Contact Us
                </Typography>
                <Typography variant="body2" color="gray">
                  |
                </Typography>
                <Typography variant="body2" color="gray">
                  Website by Joe Playdon
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
