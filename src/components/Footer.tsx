import { Box, Container, Grid, Typography, Stack, styled } from "@mui/material";
import { Instagram, Facebook, YouTube, Twitter } from "@mui/icons-material";
import { motion } from "framer-motion";
import { iconHoverVariants } from "./Navbar";
import { useNavigate, useLocation } from "react-router-dom";

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

const FooterText = styled(Typography)({
  "& span": {
    cursor: "pointer",
    position: "relative",
    "&::after": {
      content: '""',
      position: "absolute",
      width: "100%",
      height: "1px",
      bottom: -2,
      left: 0,
      backgroundColor: "#ffffff",
      transform: "scaleX(0)",
      transformOrigin: "bottom right",
      transition: "transform 0.3s ease",
    },
    "&:hover::after": {
      transform: "scaleX(1)",
      transformOrigin: "bottom left",
    },
  },
});

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleTestimonialsClick = () => {
    if (location.pathname !== "/about/story") {
      navigate("/about/story", { state: { scrollToTestimonials: true } });
    } else {
      const testimonialsSection = document.querySelector(
        "[data-testimonials-section]"
      );
      testimonialsSection?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <Box sx={{ bgcolor: "black", color: "white", py: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            md={2}
            sx={{
              textAlign: { xs: "center", md: "left" },
              order: { xs: 4, md: 3 },
            }}
          >
            <FooterSection>
              <FooterHeading variant="h6">SERVICES</FooterHeading>
              <Box
                className="section-lines"
                sx={{ mx: { xs: "auto", md: "0" } }}
              >
                <Box
                  sx={{
                    backgroundColor: "#006620",
                  }}
                />
              </Box>
              <Stack spacing={1}>
                <FooterText variant="body2">
                  <span onClick={() => navigate("/services")}>
                    Supercar Services
                  </span>
                </FooterText>
                <FooterText variant="body2">
                  <span
                    onClick={() => {
                      navigate("/services");
                      setTimeout(() => {
                        const yOffset = -100;
                        const element =
                          document.getElementById("pricing-section");
                        if (element) {
                          const y =
                            element.getBoundingClientRect().top +
                            window.pageYOffset +
                            yOffset;
                          window.scrollTo({ top: y, behavior: "smooth" });
                        }
                      }, 100);
                    }}
                  >
                    Pricing
                  </span>
                </FooterText>
              </Stack>
            </FooterSection>
          </Grid>

          {/* About Section */}
          <Grid
            item
            xs={12}
            md={2}
            sx={{
              textAlign: { xs: "center", md: "left" },
              order: { xs: 4, md: 3 },
            }}
          >
            <FooterSection>
              <FooterHeading variant="h6">ABOUT</FooterHeading>
              <Box
                className="section-lines"
                sx={{ mx: { xs: "auto", md: "0" } }}
              >
                <Box
                  sx={{
                    backgroundColor: "#e8e8e8",
                  }}
                />
              </Box>
              <Stack spacing={1}>
                <FooterText variant="body2">
                  <span onClick={() => navigate("/about/story")}>
                    Our Story
                  </span>
                </FooterText>
                <FooterText variant="body2">
                  <span onClick={() => navigate("/about/team")}>Team</span>
                </FooterText>
                <FooterText variant="body2">
                  <span onClick={handleTestimonialsClick}>Testimonials</span>
                </FooterText>
              </Stack>
            </FooterSection>
          </Grid>

          {/* Contact Section */}
          <Grid
            item
            xs={12}
            md={5}
            sx={{
              textAlign: { xs: "center", md: "left" },
              order: { xs: 4, md: 3 },
            }}
          >
            <FooterSection>
              <FooterHeading variant="h6">CONTACT</FooterHeading>
              <Box
                className="section-lines"
                sx={{ mx: { xs: "auto", md: "0" } }}
              >
                <Box
                  sx={{
                    backgroundColor: "#a70a0c",
                  }}
                />
              </Box>
              <Stack spacing={1}>
                <FooterText variant="body2">
                  <span onClick={() => navigate("/contact")}>
                    How To Find Us
                  </span>
                </FooterText>
                <FooterText variant="body2">T +44 (0)7391 710867</FooterText>
                <FooterText variant="body2">
                  E jpperformancecarsuk@gmail.com
                </FooterText>
              </Stack>
            </FooterSection>
          </Grid>

          {/* Logo and Social Icons */}
          <Grid
            item
            xs={12}
            md={3}
            sx={{
              textAlign: { xs: "center", md: "left" },
              order: { xs: 1, md: 4 },
              mb: { xs: 4, md: 0 },
            }}
          >
            <Box sx={{ display: "inline-block" }}>
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
            <Stack
              direction="row"
              spacing={2}
              sx={{
                justifyContent: { xs: "center", md: "flex-start" },
              }}
            >
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
          sx={{
            mt: 4,
            pt: 4,
            borderTop: "1px solid rgba(255,255,255,0.1)",
            textAlign: { xs: "center", md: "left" },
          }}
        >
          <Grid container spacing={2} justifyContent="space-between">
            <Grid item>
              <Stack direction="row" spacing={2}>
                <FooterText variant="body2" color="gray">
                  <span onClick={() => navigate("/contact")}>Contact Us</span>
                </FooterText>
                <Typography variant="body2" color="gray">
                  |
                </Typography>
                <FooterText variant="body2" color="gray">
                  <span
                    onClick={() =>
                      window.open(
                        "https://joeplaydon-portfolio.vercel.app/",
                        "_blank"
                      )
                    }
                  >
                    Website by Joe Playdon
                  </span>
                </FooterText>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
