import React from "react";
import { Box, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";

const FacilitiesPage: React.FC = () => {
  return (
    <Box sx={{ backgroundColor: "#000", minHeight: "100vh", color: "#fff" }}>
      <Container sx={{ pt: { xs: "90px", md: "120px" } }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h2"
            sx={{
              fontFamily: "'Times New Roman', serif",
              mb: 4,
              position: "relative",
              "&:after": {
                content: '""',
                position: "absolute",
                bottom: "-10px",
                left: 0,
                width: "60px",
                height: "3px",
                background: "#a70a0c",
              },
            }}
          >
            Our Story
          </Typography>
          {/* Add your story content here */}
        </motion.div>
      </Container>
    </Box>
  );
};

export default FacilitiesPage;
