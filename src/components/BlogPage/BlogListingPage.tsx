import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SEO from "../SEO";

// Import your color bar component if you have one
import { ColorBars } from "../elements/ColorBars";

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

// Sample blog posts data - this would come from your CMS or data source
const blogPosts = [
  {
    id: "ferrari-ff-cooling-system",
    title: "Ferrari FF Cooling System Leakage Issues: Diagnosis and Solution",
    excerpt:
      "A Ferrari FF owner discovered red fluid in their garage - our systematic diagnosis revealed multiple coolant leaks caused by aluminum corrosion. Learn how we resolved this issue to prevent costly engine damage.",
    date: "April 4, 2025",
    imageUrl: "/blog-images/ferrari-ff-thumbnail.jpg",
    authorName: "Jason Playdon",
    category: "Technical Repairs",
  },
  // Add more sample posts as needed
];

// Blog schema for SEO
const blogListingSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "JP Performance Cars Blog",
  description:
    "Expert insights on supercar servicing, maintenance, and repair from Jason Playdon.",
  url: "https://www.jpperformancecars.co.uk/blog",
  publisher: {
    "@type": "Organization",
    name: "JP Performance Cars Ltd",
    logo: {
      "@type": "ImageObject",
      url: "https://www.jpperformancecars.co.uk/logo.jpg",
    },
  },
};

const BlogListingPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Supercar Servicing Blog | JP Performance Cars | Ferrari, Lamborghini Specialists"
        description="Expert articles on supercar maintenance, servicing and repair from Jason Playdon, specialist in Ferrari, Lamborghini and high-performance vehicles."
        keywords="supercar blog, Ferrari repair tips, Lamborghini maintenance, exotic car problems, performance car servicing guide"
        canonical="https://www.jpperformancecars.co.uk/blog"
        structuredData={blogListingSchema}
      />

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
                SUPERCAR INSIGHTS
              </Typography>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
                <ColorBars />
              </Box>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Typography
                align="center"
                sx={{
                  maxWidth: "800px",
                  mx: "auto",
                  mb: 6,
                  fontFamily: "'Montserrat', sans-serif",
                  color: "#5f5f5f",
                  lineHeight: 1.8,
                  letterSpacing: "0.5px",
                }}
              >
                Expert insights and solutions from our workshop. Discover how we
                diagnose and repair some of the world's most sophisticated
                supercars.
              </Typography>
            </motion.div>
          </motion.div>

          {/* Blog Posts Grid */}
          <Grid container spacing={4} sx={{ mb: 8 }}>
            {blogPosts.map((post, index) => (
              <Grid item xs={12} md={6} lg={4} key={post.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
                      },
                      position: "relative",
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
                    <CardMedia
                      component="img"
                      height="220"
                      image={post.imageUrl}
                      alt={post.title}
                      sx={{ objectFit: "cover" }}
                    />
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: "#a70a0c",
                          mb: 1,
                          fontFamily: "'Montserrat', sans-serif",
                          fontWeight: 600,
                          fontSize: "0.85rem",
                        }}
                      >
                        {post.category} • {post.date}
                      </Typography>
                      <Typography
                        variant="h5"
                        component={Link}
                        to={`/blog/${post.id}`}
                        sx={{
                          mb: 2,
                          color: "#000",
                          fontFamily: "Times New Roman, serif",
                          fontSize: "1.3rem",
                          textDecoration: "none",
                          display: "block",
                          transition: "color 0.2s",
                          "&:hover": {
                            color: "#a70a0c",
                          },
                        }}
                      >
                        {post.title}
                      </Typography>
                      <Typography
                        sx={{
                          mb: 3,
                          color: "#5f5f5f",
                          fontFamily: "'Montserrat', sans-serif",
                          fontSize: "0.95rem",
                          lineHeight: 1.7,
                        }}
                      >
                        {post.excerpt}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontFamily: "'Montserrat', sans-serif",
                            fontSize: "0.85rem",
                            color: "#444",
                          }}
                        >
                          By {post.authorName}
                        </Typography>
                        <Button
                          component={Link}
                          to={`/blog/${post.id}`}
                          sx={{
                            fontFamily: "'Montserrat', sans-serif",
                            color: "#000",
                            textTransform: "none",
                            fontSize: "0.9rem",
                            borderBottom: "2px solid #a70a0c",
                            padding: "0 0 2px 0",
                            borderRadius: 0,
                            "&:hover": {
                              backgroundColor: "transparent",
                              color: "#a70a0c",
                            },
                          }}
                        >
                          Read more
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default BlogListingPage;
