import React from "react";
import { Box, Container, Typography, Grid } from "@mui/material";
import { motion } from "framer-motion";
import { styled } from "@mui/material/styles";
import { ColorBars } from "../elements/ColorBars";
import dadImage from "../../assets/images/dad.jpg";

const TeamMemberCard = styled(motion.div)(({ theme }) => ({
  backgroundColor: "#fff",
  borderRadius: "0",
  padding: theme.spacing(6),
  textAlign: "center",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
}));

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

const teamMember = {
  name: "Jason Playdon",
  position: "Founder & Director",
  image: dadImage,
  description: `With over a decade of experience in the automotive industry, 
    Jason Playdon has established JP Performance Cars as a leading name in supercar 
    servicing and maintenance. His dedication to excellence and passion for 
    high-performance vehicles has earned the trust of supercar owners across the region.`,
  expertise: [
    "Supercar Diagnostics",
    "Mechanical Engineering",
    "Engine & Mechanical Overhauls",
    "Gearbox & Clutch Assembly",
  ],
};

const TeamPage: React.FC = () => {
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
            xl: "10%",
          },
        }}
      >
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
              MEET THE DIRECTOR
            </Typography>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
              <ColorBars />
            </Box>
          </motion.div>
        </motion.div>

        <Grid container spacing={6} justifyContent="center">
          <Grid item xs={12}>
            <TeamMemberCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Box
                component="img"
                src={teamMember.image}
                alt={teamMember.name}
                sx={{
                  width: 300,
                  height: 300,
                  objectFit: "cover",
                  marginBottom: 4,
                  border: "3px solid #a70a0c",
                  borderRadius: "50%",
                }}
              />
              <Typography
                sx={{
                  fontFamily: "'Times New Roman', serif",
                  fontWeight: 600,
                  mb: 2,
                  color: "#000",
                  fontSize: "2rem",
                  letterSpacing: "2px",
                }}
              >
                {teamMember.name}
              </Typography>
              <Typography
                sx={{
                  color: "#a70a0c",
                  fontFamily: "'Montserrat', sans-serif",
                  mb: 4,
                  fontWeight: 500,
                  letterSpacing: "1.5px",
                }}
              >
                {teamMember.position}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "'Montserrat', sans-serif",
                  color: "#5f5f5f",
                  lineHeight: 1.8,
                  fontSize: "1rem",
                  mb: 4,
                  maxWidth: "800px",
                  margin: "0 auto",
                  letterSpacing: "1px",
                }}
              >
                {teamMember.description}
              </Typography>

              <Box sx={{ mt: 6 }}>
                <Typography
                  sx={{
                    fontFamily: "'Times New Roman', serif",
                    mb: 3,
                    color: "#000",
                    fontSize: "1.5rem",
                    letterSpacing: "2px",
                  }}
                >
                  AREAS OF EXPERTISE
                </Typography>
                <Grid container spacing={2} justifyContent="center">
                  {teamMember.expertise.map((skill, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      <Box
                        sx={{
                          backgroundColor: "#f5f5f5",
                          padding: "1rem",
                          fontFamily: "'Montserrat', sans-serif",
                          color: "#5f5f5f",
                          letterSpacing: "1px",
                        }}
                      >
                        {skill}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </TeamMemberCard>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default TeamPage;
