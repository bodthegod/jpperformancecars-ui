import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Divider,
  Avatar,
  Chip,
} from "@mui/material";
import { Link, useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ColorBars } from "../elements/ColorBars";
import SEO from "../SEO";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";

// Import sample data for blog posts - in a real app, this would come from a CMS or API
import { blogPostsData, BlogPost } from "./blogPostsData";

// Types for blog content sections
interface TextSectionProps {
  content: string;
}

interface ImageSectionProps {
  src: string;
  alt: string;
  caption?: string;
}

interface VideoSectionProps {
  videoId: string;
  caption?: string;
}

interface QuoteSectionProps {
  quote: string;
  author?: string;
}

// Component for displaying regular text paragraphs
const TextSection: React.FC<TextSectionProps> = ({ content }) => (
  <Typography
    sx={{
      mb: 3,
      fontFamily: "'Montserrat', sans-serif",
      color: "#333",
      lineHeight: 1.8,
      fontSize: "1rem",
    }}
  >
    {content}
  </Typography>
);

// Component for displaying images with optional captions
const ImageSection: React.FC<ImageSectionProps> = ({ src, alt, caption }) => (
  <Box sx={{ mb: 4 }}>
    <Box
      component="img"
      src={src}
      alt={alt}
      loading="lazy"
      sx={{
        width: "100%",
        borderRadius: "4px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      }}
    />
    {caption && (
      <Typography
        sx={{
          mt: 1,
          fontFamily: "'Montserrat', sans-serif",
          color: "#666",
          fontSize: "0.9rem",
          fontStyle: "italic",
          textAlign: "center",
        }}
      >
        {caption}
      </Typography>
    )}
  </Box>
);

// Component for displaying YouTube videos
const VideoSection: React.FC<VideoSectionProps> = ({ videoId, caption }) => (
  <Box sx={{ mb: 4 }}>
    <Box
      sx={{
        position: "relative",
        paddingBottom: "56.25%", // 16:9 aspect ratio
        height: 0,
        overflow: "hidden",
        borderRadius: "4px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      }}
    >
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: 0,
        }}
      />
    </Box>
    {caption && (
      <Typography
        sx={{
          mt: 1,
          fontFamily: "'Montserrat', sans-serif",
          color: "#666",
          fontSize: "0.9rem",
          fontStyle: "italic",
          textAlign: "center",
        }}
      >
        {caption}
      </Typography>
    )}
  </Box>
);

// Component for displaying quotes
const QuoteSection: React.FC<QuoteSectionProps> = ({ quote, author }) => (
  <Box
    sx={{
      mb: 4,
      pl: 3,
      borderLeft: "3px solid #a70a0c",
      py: 2,
    }}
  >
    <Typography
      sx={{
        fontFamily: "Times New Roman, serif",
        fontStyle: "italic",
        color: "#333",
        fontSize: "1.2rem",
        lineHeight: 1.6,
        mb: author ? 1 : 0,
      }}
    >
      "{quote}"
    </Typography>
    {author && (
      <Typography
        sx={{
          fontFamily: "'Montserrat', sans-serif",
          color: "#666",
          fontSize: "0.9rem",
          textAlign: "right",
        }}
      >
        — {author}
      </Typography>
    )}
  </Box>
);

// The main blog post component
const BlogPostPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();

  // Find the blog post with the matching ID
  const post = blogPostsData.find((post: BlogPost) => post.id === postId);

  // If no matching post is found, redirect to the blog listing page
  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  // Generate structured data for the blog post
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    image: post.imageUrl,
    datePublished: post.datePublished,
    dateModified: post.dateModified || post.datePublished,
    author: {
      "@type": "Person",
      name: post.authorName,
      url: "https://www.jpperformancecars.co.uk/about/team",
    },
    publisher: {
      "@type": "Organization",
      name: "JP Performance Cars Ltd",
      logo: {
        "@type": "ImageObject",
        url: "https://www.jpperformancecars.co.uk/logo.jpg",
      },
    },
    description: post.excerpt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.jpperformancecars.co.uk/blog/${post.id}`,
    },
  };

  return (
    <>
      <SEO
        title={`${post.title} | JP Performance Cars Blog`}
        description={post.excerpt}
        keywords={`${post.tags.join(
          ", "
        )}, supercar repair, Ferrari service, Lamborghini maintenance`}
        canonical={`https://www.jpperformancecars.co.uk/blog/${post.id}`}
        structuredData={articleSchema}
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
            mb: 8,
          }}
        >
          {/* Back Button */}
          <Button
            component={Link}
            to="/blog"
            startIcon={<ArrowBackIcon />}
            sx={{
              mb: 4,
              color: "#333",
              textTransform: "none",
              fontFamily: "'Montserrat', sans-serif",
              "&:hover": {
                backgroundColor: "transparent",
                color: "#a70a0c",
              },
            }}
          >
            Back to all articles
          </Button>

          {/* Featured Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Box
              component="img"
              src={post.imageUrl}
              alt={post.title}
              sx={{
                width: "100%",
                height: { xs: "250px", md: "400px" },
                objectFit: "cover",
                borderRadius: "4px",
                mb: 4,
              }}
            />
          </motion.div>

          <Grid container spacing={4}>
            {/* Main Content */}
            <Grid item xs={12} md={8}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {/* Title */}
                <Typography
                  variant="h3"
                  sx={{
                    mb: 2,
                    fontFamily: "Times New Roman, sans-serif",
                    fontSize: { xs: "28px", md: "34px" },
                    letterSpacing: "1px",
                    lineHeight: 1.2,
                    color: "#000",
                  }}
                >
                  {post.title}
                </Typography>

                <Box sx={{ display: "flex", justifyContent: "left", mb: 4 }}>
                  <ColorBars />
                </Box>

                {/* Post Meta */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 4,
                  }}
                >
                  <Avatar
                    src={post.authorAvatar}
                    alt={post.authorName}
                    sx={{ width: 48, height: 48, mr: 2 }}
                  />
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontWeight: 600,
                        color: "#000",
                      }}
                    >
                      {post.authorName}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "0.9rem",
                        color: "#666",
                      }}
                    >
                      Published: {post.date} • {post.readingTime} min read
                    </Typography>
                  </Box>
                </Box>

                {/* Render content sections based on their type */}
                {post.content.map((section: any, index: number) => {
                  switch (section.type) {
                    case "text":
                      return (
                        <TextSection key={index} content={section.content} />
                      );
                    case "image":
                      return (
                        <ImageSection
                          key={index}
                          src={section.src}
                          alt={section.alt}
                          caption={section.caption}
                        />
                      );
                    case "video":
                      return (
                        <VideoSection
                          key={index}
                          videoId={section.videoId}
                          caption={section.caption}
                        />
                      );
                    case "quote":
                      return (
                        <QuoteSection
                          key={index}
                          quote={section.quote}
                          author={section.author}
                        />
                      );
                    default:
                      return null;
                  }
                })}

                {/* Tags */}
                <Box sx={{ mt: 5, mb: 3 }}>
                  <Typography
                    sx={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 600,
                      color: "#000",
                      mb: 2,
                    }}
                  >
                    TAGS
                  </Typography>
                  <Box>
                    {post.tags.map((tag: string) => (
                      <Chip
                        key={tag}
                        label={tag}
                        sx={{
                          mr: 1,
                          mb: 1,
                          backgroundColor: "#f5f5f5",
                          fontFamily: "'Montserrat', sans-serif",
                          color: "#333",
                          "&:hover": {
                            backgroundColor: "#e0e0e0",
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                <Divider sx={{ my: 5 }} />

                {/* Call to Action */}
                <Box
                  sx={{
                    backgroundColor: "#f5f5f5",
                    p: 4,
                    borderRadius: "4px",
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
                  <Typography
                    sx={{
                      fontFamily: "Times New Roman, serif",
                      color: "#000",
                      fontSize: "1.3rem",
                      mb: 2,
                    }}
                  >
                    Need Expert Supercar Service?
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "'Montserrat', sans-serif",
                      color: "#5f5f5f",
                      mb: 3,
                      lineHeight: 1.7,
                    }}
                  >
                    With over 28 years of experience, our team is equipped to
                    handle any supercar maintenance or repair challenge. Contact
                    us today to discuss your vehicle's needs.
                  </Typography>
                  <Button
                    component={Link}
                    to="/contact"
                    variant="contained"
                    sx={{
                      backgroundColor: "#a70a0c",
                      fontFamily: "'Montserrat', sans-serif",
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "#8a0809",
                      },
                    }}
                  >
                    Contact Us
                  </Button>
                </Box>
              </motion.div>
            </Grid>

            {/* Sidebar */}
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {/* Related Articles */}
                <Box
                  sx={{
                    backgroundColor: "#f5f5f5",
                    p: 3,
                    borderRadius: "4px",
                    mb: 4,
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
                  <Typography
                    sx={{
                      fontFamily: "Times New Roman, serif",
                      color: "#000",
                      fontSize: "1.2rem",
                      mb: 3,
                    }}
                  >
                    RELATED ARTICLES
                  </Typography>

                  {/* Show sample related articles - in a real app, these would be filtered based on tags or categories */}
                  {blogPostsData
                    .filter(
                      (relatedPost: BlogPost) => relatedPost.id !== post.id
                    )
                    .slice(0, 3)
                    .map((relatedPost: BlogPost) => (
                      <Box key={relatedPost.id} sx={{ mb: 3 }}>
                        <Typography
                          component={Link}
                          to={`/blog/${relatedPost.id}`}
                          sx={{
                            fontFamily: "'Montserrat', sans-serif",
                            color: "#000",
                            fontSize: "1rem",
                            textDecoration: "none",
                            fontWeight: 500,
                            display: "block",
                            mb: 1,
                            transition: "color 0.2s",
                            "&:hover": {
                              color: "#a70a0c",
                            },
                          }}
                        >
                          {relatedPost.title}
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: "'Montserrat', sans-serif",
                            color: "#666",
                            fontSize: "0.85rem",
                          }}
                        >
                          {relatedPost.date}
                        </Typography>
                      </Box>
                    ))}
                </Box>

                {/* Service Categories */}
                <Box
                  sx={{
                    backgroundColor: "#f5f5f5",
                    p: 3,
                    borderRadius: "4px",
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
                  <Typography
                    sx={{
                      fontFamily: "Times New Roman, serif",
                      color: "#000",
                      fontSize: "1.2rem",
                      mb: 3,
                    }}
                  >
                    OUR SERVICES
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    {[
                      { title: "Ferrari Servicing", path: "/services#ferrari" },
                      {
                        title: "Lamborghini Servicing",
                        path: "/services#lamborghini",
                      },
                      { title: "Engine Rebuilds", path: "/services#engine" },
                      {
                        title: "Performance Upgrades",
                        path: "/services#performance",
                      },
                      { title: "Diagnostics", path: "/services#diagnostics" },
                    ].map((service) => (
                      <Button
                        key={service.title}
                        component={Link}
                        to={service.path}
                        sx={{
                          justifyContent: "flex-start",
                          textAlign: "left",
                          color: "#333",
                          fontFamily: "'Montserrat', sans-serif",
                          fontSize: "0.95rem",
                          textTransform: "none",
                          padding: "8px 0",
                          "&:hover": {
                            backgroundColor: "transparent",
                            color: "#a70a0c",
                          },
                        }}
                      >
                        {service.title}
                      </Button>
                    ))}
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default BlogPostPage;
