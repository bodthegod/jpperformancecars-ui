import React, { useEffect } from "react";
import { Box, Container, Typography, Grid, Rating } from "@mui/material";
import { motion } from "framer-motion";
import { ColorBars } from "../elements/ColorBars";
import workshopImage from "../../assets/images/JP1.jpg"; // Update with your image
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import { useLocation } from "react-router-dom";

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

const testimonials = [
  {
    name: "David Durkin",
    rating: 5,
    source: "Trustpilot",
    title: "Absolutely Brilliant Service...",
    text: "Absolutely brilliant service and quality. Jason is a very talented and knowledgeable auto engineer with excellent customer service and completes jobs to the highest standard and in time. Would thoroughly recommend.",
    date: "May 2021",
    link: "https://uk.trustpilot.com/reviews/609680bff9f4870a78724b1d",
  },
  {
    name: "Roger Benton",
    rating: 5,
    source: "Trustpilot",
    title: "Fantastic Service",
    text: "I've been using Jason for over ten years and find the service and price very reasonable. I have never had to pay up front for parts and he's a genuine guy. I've always found him to be highly skilled and professional in his work. I would highly recommend him and totally trust him with my Ferrari.",
    date: "April 2021",
    link: "https://uk.trustpilot.com/reviews/608bd093f9f4870984b01377",
  },
  {
    name: "Kris Pavlovic",
    rating: 5,
    source: "Trustpilot",
    title: "Great lads to deal with 👍",
    text: "I have used this company and the one before since 2006 followed them through their transition to the current day. Fantastic to deal with nothing to much trouble and great experience in the field of super cars always on hand to help. Looked after my 355, 360 and my Lamborghini Gallardo couldn't fault them and such good Guys to get on with all the best in future ventures",
    date: "June 2020",
    link: "https://uk.trustpilot.com/reviews/5eed308f7dd753032471145a",
  },
];

const TestimonialsSection = React.forwardRef<HTMLDivElement>((props, ref) => (
  <Box ref={ref} sx={{ mt: 12, mb: 8 }}>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <Typography
        align="center"
        sx={{
          fontFamily: "'Times New Roman', serif",
          fontSize: "1.8rem",
          mb: 4,
          letterSpacing: "2px",
          color: "#000",
        }}
      >
        CUSTOMER TESTIMONIALS
      </Typography>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        {testimonials.map((testimonial, index) => (
          <Grid item xs={12} md={4} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Box
                sx={{
                  backgroundColor: "#f5f5f5",
                  p: 4,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  transition: "box-shadow 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
                  },
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "3px",
                    background: "#a70a0c",
                  },
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "'Times New Roman', serif",
                    color: "#000",
                    fontSize: "1.2rem",
                    mb: 2,
                    fontWeight: 600,
                    letterSpacing: "1px",
                  }}
                >
                  {testimonial.title}
                </Typography>

                <FormatQuoteIcon
                  sx={{
                    color: "#a70a0c",
                    fontSize: "2rem",
                    mb: 2,
                  }}
                />

                <Typography
                  sx={{
                    fontFamily: "'Montserrat', sans-serif",
                    color: "#5f5f5f",
                    mb: 3,
                    lineHeight: 1.8,
                    flex: 1,
                    fontStyle: "italic",
                  }}
                >
                  "{testimonial.text}"
                </Typography>

                <Box>
                  <Rating
                    value={testimonial.rating}
                    readOnly
                    sx={{
                      mb: 1,
                      "& .MuiRating-iconFilled": {
                        color: "#a70a0c",
                      },
                    }}
                  />

                  <Typography
                    sx={{
                      fontFamily: "'Times New Roman', serif",
                      fontWeight: 600,
                      color: "#000",
                      mb: 0.5,
                    }}
                  >
                    {testimonial.name}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      component="a"
                      href={testimonial.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "0.9rem",
                        color: "#5f5f5f",
                        textDecoration: "none",
                        transition: "color 0.3s ease",
                        "&:hover": {
                          color: "#a70a0c",
                        },
                      }}
                    >
                      {testimonial.source}
                    </Typography>

                    <Typography
                      sx={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "0.9rem",
                        color: "#5f5f5f",
                      }}
                    >
                      {testimonial.date}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </motion.div>
  </Box>
));

const StoryPage: React.FC = () => {
  const testimonialsSectionRef = React.useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollToTestimonials) {
      const scrollToTestimonialsWithOffset = () => {
        const yOffset = -100;
        if (testimonialsSectionRef.current) {
          const y =
            testimonialsSectionRef.current.getBoundingClientRect().top +
            window.pageYOffset +
            yOffset;

          window.scrollTo({ top: y, behavior: "smooth" });
        }
      };

      scrollToTestimonialsWithOffset();
      window.history.replaceState({}, document.title);
    }
  }, [location]);

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
                color: "#000",
              }}
            >
              OUR STORY
            </Typography>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
              <ColorBars />
            </Box>
          </motion.div>
        </motion.div>

        {/* Content Section */}
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Box
                component="img"
                src={workshopImage}
                alt="JP Performance Workshop"
                sx={{
                  width: "100%",
                  height: "400px",
                  objectFit: "cover",
                  mb: { xs: 4, md: 0 },
                }}
              />
            </motion.div>
          </Grid>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Typography
                sx={{
                  fontFamily: "'Times New Roman', serif",
                  color: "#a70a0c",
                  fontSize: "1.5rem",
                  mb: 3,
                  letterSpacing: "1px",
                }}
              >
                Established in 2020
              </Typography>
              <Typography
                sx={{
                  fontFamily: "'Montserrat', sans-serif",
                  color: "#5f5f5f",
                  mb: 3,
                  lineHeight: 1.8,
                  letterSpacing: "0.5px",
                }}
              >
                JP Performance Cars was founded with a clear vision: to provide
                unparalleled service and expertise in the maintenance and
                enhancement of high-performance vehicles. What began as a
                passion for automotive excellence has grown into one of the
                region's most trusted names in supercar care.
              </Typography>
              <Typography
                sx={{
                  fontFamily: "'Montserrat', sans-serif",
                  color: "#5f5f5f",
                  mb: 3,
                  lineHeight: 1.8,
                  letterSpacing: "0.5px",
                }}
              >
                Our journey started when founder Jason Playdon recognized the
                need for a specialized service center that could match the
                precision and quality demanded by supercar owners. Today, we
                continue to build on that foundation, combining traditional
                expertise with cutting-edge technology.
              </Typography>
            </motion.div>
          </Grid>
        </Grid>

        {/* Values Section */}
        <Box sx={{ mt: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography
              align="center"
              sx={{
                fontFamily: "'Times New Roman', serif",
                fontSize: "1.8rem",
                mb: 4,
                letterSpacing: "2px",
                color: "#000",
              }}
            >
              OUR VALUES
            </Typography>
            <Grid container spacing={4} sx={{ mt: 2 }}>
              {[
                {
                  title: "Excellence",
                  description:
                    "We strive for perfection in every detail of our work.",
                },
                {
                  title: "Integrity",
                  description: "Honest, transparent service you can trust.",
                },
                {
                  title: "Innovation",
                  description:
                    "Embracing the latest technology and techniques.",
                },
                {
                  title: "Passion",
                  description: "True enthusiasm for automotive excellence.",
                },
              ].map((value, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Box
                    sx={{
                      textAlign: "center",
                      p: 3,
                      height: "100%",
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "'Times New Roman', serif",
                        fontSize: "1.2rem",
                        mb: 2,
                        color: "#000",
                        letterSpacing: "1px",
                      }}
                    >
                      {value.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "'Montserrat', sans-serif",
                        color: "#5f5f5f",
                        lineHeight: 1.6,
                      }}
                    >
                      {value.description}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Box>

        <TestimonialsSection ref={testimonialsSectionRef} />
      </Container>
    </Box>
  );
};

export default StoryPage;
