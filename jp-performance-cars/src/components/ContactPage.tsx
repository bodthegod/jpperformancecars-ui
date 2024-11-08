import React from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  styled,
  Divider,
} from "@mui/material";
import { ContactFormData } from "../types/types";
import { ColorBars } from "./elements/ColorBars";
import contactImage from "../assets/images/JP1.jpg";
import { easeInOut, motion } from "framer-motion";

const ContactPage: React.FC = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values: ContactFormData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      message: formData.get("message") as string,
    };
    console.log("Form submitted:", values);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
        duration: 0.8,
        ease: easeInOut,
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
        ease: easeInOut,
      },
    },
  };

  return (
    <Box>
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
              }}
            >
              CONTACT US
            </Typography>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
              <ColorBars />
            </Box>
          </motion.div>
        </motion.div>
      </Container>

      {/* Map Section - Outside Container for full width */}
      <Box
        sx={{
          width: "100%",
          height: "400px",
          mb: 4,
          position: "relative",
          backgroundColor: "#f5f5f5",
        }}
      >
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d9675.918571283357!2d-1.9166357!3d52.6784054!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4870a0a2df0b162d%3A0xcf2f105f5bbbe1d3!2sJP%20Performance%20Cars%20Ltd!5e0!3m2!1sen!2suk!4v1731071724037!5m2!1sen!2suk"
          width="100%"
          height="100%"
          style={{
            border: 0,
            position: "absolute",
            top: 0,
            left: 0,
          }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </Box>

      {/* Content Grid */}
      <Container maxWidth="lg" sx={{ mb: 10 }}>
        <Grid container spacing={4}>
          {/* Form Section */}
          <Grid item xs={12} md={5}>
            <ContactHeading variant="h5" sx={{ mb: 3 }}>
              GET IN TOUCH
            </ContactHeading>

            <Box
              sx={{
                display: "flex",
                width: "40px",
                height: "2px",
                marginTop: "8px",
                marginBottom: "16px",
              }}
            >
              <Box sx={{ flex: 1, backgroundColor: "#006620" }} />
              <Box sx={{ flex: 1, backgroundColor: "#e8e8e8" }} />
              <Box sx={{ flex: 1, backgroundColor: "#a70a0c" }} />
            </Box>

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                name="name"
                placeholder="Name *"
                margin="normal"
                required
              />
              <TextField
                fullWidth
                name="email"
                placeholder="Email *"
                margin="normal"
                required
                type="email"
              />
              <TextField
                fullWidth
                name="phone"
                placeholder="Phone *"
                margin="normal"
                required
              />
              <TextField
                fullWidth
                name="message"
                placeholder="Message *"
                margin="normal"
                required
                multiline
                rows={6}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{
                  mt: 2,
                  bgcolor: "black",
                  color: "white",
                  "&:hover": {
                    bgcolor: "#333",
                  },
                }}
              >
                SEND
              </Button>
            </Box>
          </Grid>

          {/* Vertical Divider */}
          <Grid
            item
            md={1}
            sx={{
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
              alignItems: "stretch",
            }}
          >
            <Divider
              orientation="vertical"
              flexItem
              sx={{
                height: "100%",
                borderColor: "rgba(0, 0, 0, 0.1)",
                borderRightWidth: 1,
              }}
            />
          </Grid>

          {/* Contact Info Section */}
          <Grid item xs={12} md={5}>
            <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
              <Paper
                sx={{
                  height: 250,
                  mb: 4,
                  backgroundImage: `url(${contactImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />

              <InfoSection>
                <InfoSectionHeader variant="h6">Phone</InfoSectionHeader>
                <Typography>+44</Typography>
              </InfoSection>

              <InfoSection>
                <InfoSectionHeader variant="h6">Email</InfoSectionHeader>
                <Typography fontWeight={700}>jasonplaydon@aol.com</Typography>
              </InfoSection>

              <InfoSection>
                <InfoSectionHeader variant="h6">
                  Opening Hours
                </InfoSectionHeader>
                <Box>
                  <HoursRow
                    sx={{
                      justifyContent: {
                        xs: "center",
                        md: "space-between",
                      },
                      gap: { xs: 2, md: 0 },
                    }}
                  >
                    <Typography fontWeight={700}>Monday-Friday</Typography>
                    <Typography color="#5f5f5f">9:00am-6:00pm</Typography>
                  </HoursRow>
                  <HoursRow
                    sx={{
                      justifyContent: {
                        xs: "center",
                        md: "space-between",
                      },
                      gap: { xs: 2, md: 0 },
                    }}
                  >
                    <Typography fontWeight={700}>Saturday</Typography>
                    <Typography color="#5f5f5f">10:00am-4:00pm</Typography>
                  </HoursRow>
                  <HoursRow
                    sx={{
                      justifyContent: {
                        xs: "center",
                        md: "space-between",
                      },
                      gap: { xs: 2, md: 0 },
                    }}
                  >
                    <Typography fontWeight={700}>Sunday</Typography>
                    <Typography color="#5f5f5f">Closed</Typography>
                  </HoursRow>
                </Box>
              </InfoSection>
            </Box>
          </Grid>
        </Grid>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-150px" }}
          variants={containerVariants}
        >
          <AddressSection>
            <motion.div variants={itemVariants}>
              <Typography
                variant="h6"
                fontFamily="Times New Roman, sans-serif"
                align="center"
                letterSpacing="3px"
                color="#111"
                fontSize="30px"
                sx={{ mb: 2 }}
              >
                ADDRESS
              </Typography>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Box
                sx={{
                  textAlign: "center",
                  letterSpacing: "1px",
                  fontFamily: "Monserrat, sans-serif",
                  fontSize: ".875em",
                  color: "#5f5f5f",
                }}
              >
                <Typography>JP Performance Cars Ltd.</Typography>
                <Typography>Unit 2</Typography>
                <Typography>Metal Products Business Park</Typography>
                <Typography>Prospect Road</Typography>
                <Typography>Burntwood</Typography>
                <Typography>Staffordshire</Typography>
                <Typography>WS7 0AE</Typography>
                <Typography>United Kingdom</Typography>
              </Box>
            </motion.div>
          </AddressSection>
        </motion.div>
      </Container>
    </Box>
  );
};

// Styled Components
const ContactHeading = styled(Typography)({
  marginBottom: "16px",
  letterSpacing: "4px",
  color: "black",
  fontSize: "14px",
  fontWeight: 600,
});

const InfoSection = styled(Box)({
  marginBottom: 24,
});
const AddressSection = styled(Box)({
  marginTop: 48,
  marginBottom: 24,
});

const HoursRow = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 8,
});

const InfoSectionHeader = styled(Typography)({
  letterSpacing: "1px",
  fontSize: "1rem",
  lineHeight: "1.5",
  fontWeight: "700",
  margin: "0 0 15px 0",
});

export default ContactPage;
