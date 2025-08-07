import React from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import {
  ExpandMore,
  HelpOutline,
  Build,
  Speed,
  LocalShipping,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { OBDCode } from "../../types/types";

interface OBDFAQSectionProps {
  obdCode: OBDCode;
}

const OBDFAQSection: React.FC<OBDFAQSectionProps> = ({ obdCode }) => {
  const faqs = [
    {
      question: `What does OBD code ${obdCode.code} mean?`,
      answer: obdCode.description,
      icon: <HelpOutline color="primary" />,
    },
    {
      question: `What causes ${obdCode.code} error code in Ferrari vehicles?`,
      answer: (
        <List dense>
          {obdCode.common_causes.map((cause, index) => (
            <ListItem key={index} sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <Typography variant="body2" color="primary" fontWeight="bold">
                  {index + 1}.
                </Typography>
              </ListItemIcon>
              <ListItemText primary={cause} />
            </ListItem>
          ))}
        </List>
      ),
      icon: <Build color="warning" />,
    },
    {
      question: `How serious is ${obdCode.code} error code?`,
      answer: `This diagnostic trouble code has a ${
        obdCode.severity
      } severity rating. ${
        obdCode.severity === "high"
          ? "Immediate attention required - continued driving may cause engine damage or safety issues."
          : obdCode.severity === "medium"
          ? "Should be addressed soon to prevent potential damage and maintain optimal performance."
          : "Low priority issue, but should still be diagnosed to ensure optimal vehicle operation."
      }`,
      icon: (
        <Speed
          color={
            obdCode.severity === "high"
              ? "error"
              : obdCode.severity === "medium"
              ? "warning"
              : "success"
          }
        />
      ),
    },
    {
      question: `Can I drive my Ferrari with ${obdCode.code} error code?`,
      answer:
        obdCode.severity === "high"
          ? "We strongly recommend against driving with this error code. High severity codes can indicate serious engine problems that may cause further damage or safety issues if ignored."
          : obdCode.severity === "medium"
          ? "You can drive cautiously for short distances, but should have this diagnosed and repaired as soon as possible to prevent potential damage."
          : "This is generally safe to drive with temporarily, but you should still have it diagnosed to maintain optimal performance and prevent potential issues.",
      icon: <Speed color="info" />,
    },
    {
      question: `Where can I get genuine Ferrari parts for ${obdCode.code} repair?`,
      answer:
        "JP Performance Cars stocks over 60,000 genuine and quality aftermarket Ferrari parts. We offer next-day delivery across the UK and worldwide shipping to over 100 countries. Our parts specialists can help identify the exact components needed for your specific Ferrari model and year.",
      icon: <LocalShipping color="success" />,
    },
    {
      question: `Do you offer professional repair services for ${obdCode.code}?`,
      answer:
        "Yes! Our factory-trained technicians have 20+ years of Ferrari experience. We provide professional diagnostic services, expert repairs, and comprehensive servicing for all Ferrari models. Contact us at +44 (0)7391 710867 for a consultation.",
      icon: <Build color="primary" />,
    },
  ];

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={itemVariants}
    >
      <Box sx={{ mt: 6 }}>
        <Typography
          variant="h4"
          sx={{
            mb: 3,
            fontWeight: "bold",
            textAlign: "center",
            fontFamily: "Times New Roman, sans-serif",
          }}
        >
          Frequently Asked Questions - {obdCode.code}
        </Typography>

        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ mb: 4, textAlign: "center" }}
        >
          Expert answers to common questions about {obdCode.code} diagnostic
          trouble code
        </Typography>

        {faqs.map((faq, index) => (
          <Accordion
            key={index}
            sx={{
              mb: 1,
              "&:before": {
                display: "none",
              },
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              "&.Mui-expanded": {
                boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              sx={{
                py: 2,
                "&.Mui-expanded": {
                  borderBottom: "1px solid #e0e0e0",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {faq.icon}
                <Typography variant="h6" fontWeight="bold">
                  {faq.question}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 2, pb: 3 }}>
              {typeof faq.answer === "string" ? (
                <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                  {faq.answer}
                </Typography>
              ) : (
                faq.answer
              )}
            </AccordionDetails>
          </Accordion>
        ))}

        {/* Call to Action */}
        <Box
          sx={{
            mt: 4,
            p: 3,
            backgroundColor: "#f8f9fa",
            borderRadius: 2,
            textAlign: "center",
            border: "1px solid #e9ecef",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            Need Expert Help with {obdCode.code}?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Our Ferrari specialists are here to help. From diagnosis to repair,
            we have the expertise and parts to get your Ferrari running
            perfectly.
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontWeight: "bold", color: "primary.main" }}
            >
              📞 +44 (0)7391 710867
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: "bold", color: "primary.main" }}
            >
              ✉️ jpperformancecarsuk@gmail.com
            </Typography>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

export default OBDFAQSection;
