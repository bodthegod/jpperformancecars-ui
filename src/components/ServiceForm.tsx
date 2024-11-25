import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Snackbar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import emailjs from "@emailjs/browser";

const FormContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  minWidth: "auto",
  maxWidth: "70%",
  padding: theme.spacing(5),
  background: "rgba(255, 255, 255, 0.95)",
  position: "relative",
  zIndex: 1,
  [theme.breakpoints.up("md")]: {
    maxWidth: 600,
  },
}));

const FormTitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"Times New Roman", serif',
  fontSize: "28px",
  letterSpacing: "2px",
  marginBottom: theme.spacing(6),
  textTransform: "uppercase",
  color: "#333",
  position: "relative",
  "&:after": {
    content: '""',
    position: "absolute",
    bottom: "-10px",
    left: 0,
    width: "100%",
    height: "1px",
    background: "#333",
    boxShadow: "0 1px 0 rgba(0,0,0,0.1)",
  },
  [theme.breakpoints.down("md")]: {
    fontSize: "24px",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  "& .MuiInputLabel-root": {
    color: "#666",
    fontSize: "14px",
    letterSpacing: "1px",
    transform: "none",
    position: "relative",
    marginBottom: theme.spacing(1),
  },
  "& .MuiInput-root": {
    "&:before": {
      borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
    },
    "&:after": {
      borderBottom: "1px solid rgba(0, 0, 0, 0.8)",
    },
  },
  "& .MuiInputBase-input": {
    padding: "8px 0",
    fontSize: "14px",
    letterSpacing: "1px",
    color: "#333",
    "&::placeholder": {
      color: "#999",
      opacity: 1,
      letterSpacing: "1px",
    },
  },
}));

export const SubmitButton = styled(Button)(({ theme }) => ({
  background: "#000",
  color: "#fff",
  padding: "12px 40px",
  borderRadius: "0",
  fontSize: "14px",
  letterSpacing: "2px",
  textTransform: "uppercase",
  boxShadow: "none",
  border: "3px solid #4e4e4e",
  transition: "all 0.3s ease",
  fontWeight: 500,
  "&:hover": {
    background: "#000",
    color: "#fff",
    boxShadow: "none",
  },
  "&:active": {
    transform: "translateY(1px)",
  },
}));

const carOptions = [
  { value: "ferrari", label: "Ferrari" },
  { value: "lamborghini", label: "Lamborghini" },
  { value: "maserati", label: "Maserati" },
  { value: "porsche", label: "Porsche" },
  { value: "bentley", label: "Bentley" },
  { value: "mclaren", label: "McLaren" },
  { value: "other", label: "Other Supercar" },
];

const PageWrapper = styled(Box)({
  minHeight: "100vh",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(45deg, #000000 0%, #1a1a1a 100%)",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "radial-gradient(circle at center, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 70%)",
    pointerEvents: "none",
  },
  padding: "20px",
  boxSizing: "border-box",
});

const StyledSelect = styled("select")(({ theme }) => ({
  width: "100%",
  padding: "10px 0",
  fontSize: "15px",
  letterSpacing: "0.5px",
  color: "#333",
  border: "none",
  borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
  backgroundColor: "transparent",
  outline: "none",
  cursor: "pointer",
  appearance: "none",
  backgroundImage:
    'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23333%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E")',
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 0 top 50%",
  backgroundSize: "0.65em auto",
  transition: "border-color 0.2s ease",
  fontFamily: "Arial, sans-serif",
  "&:focus": {
    borderBottom: "2px solid #000",
  },
  "&:hover": {
    borderBottom: "2px solid #666",
  },
  "& option": {
    fontSize: "14px",
    paddingLeft: "16px",
    backgroundColor: "#fff",
    color: "#333",
    fontFamily: "Arial, sans-serif",
    letterSpacing: "0.5px",
  },
  "& option:first-of-type": {
    color: "#666",
    fontStyle: "italic",
  },
}));

const SelectLabel = styled("label")(({ theme }) => ({
  color: "#666",
  fontSize: "14px",
  letterSpacing: "1px",
  marginBottom: theme.spacing(1),
  display: "block",
  fontWeight: 500,
}));

const FormField = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const ServiceForm: React.FC = () => {
  useEffect(() => {
    emailjs.init(process.env.REACT_APP_EMAILJS_PUBLIC_KEY!);
  }, []);
  const [formData, setFormData] = useState({
    vehicle: "",
    name: "",
    contact: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleClose = () => {
    setAlert({ ...alert, open: false });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID!,
        process.env.REACT_APP_EMAILJS_SERVICE_TEMPLATE_ID!,
        {
          vehicle: formData.vehicle,
          name: formData.name,
          contact: formData.contact,
        },
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      );

      setFormData({
        vehicle: "",
        name: "",
        contact: "",
      });

      setAlert({
        open: true,
        message:
          "Thank you for your service request. We will contact you shortly.",
        severity: "success",
      });
    } catch (error) {
      console.error("Error sending email:", error);
      setAlert({
        open: true,
        message:
          "There was an error submitting your request. Please try again.",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageWrapper id="service-form">
      <FormContainer>
        <FormTitle>Supercar Service</FormTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <FormField>
            <SelectLabel>I would like to service my</SelectLabel>
            <StyledSelect
              required
              name="vehicle"
              value={formData.vehicle}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select vehicle...
              </option>
              {carOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </StyledSelect>
          </FormField>

          <FormField>
            <StyledTextField
              fullWidth
              variant="standard"
              label="My name is"
              required
              name="name"
              value={formData.name}
              onChange={
                handleChange as React.ChangeEventHandler<HTMLInputElement>
              }
              placeholder="Enter your name"
              InputLabelProps={{
                shrink: true,
                disableAnimation: true,
              }}
            />
          </FormField>

          <FormField>
            <StyledTextField
              fullWidth
              variant="standard"
              label="Contactable on"
              required
              name="contact"
              value={formData.contact}
              onChange={
                handleChange as React.ChangeEventHandler<HTMLInputElement>
              }
              placeholder="Enter your number"
              InputLabelProps={{
                shrink: true,
                disableAnimation: true,
              }}
            />
          </FormField>

          <Box sx={{ mt: 5, textAlign: "center" }}>
            <SubmitButton
              type="submit"
              variant="contained"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </SubmitButton>
          </Box>
        </Box>
      </FormContainer>
      <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={alert.severity}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </PageWrapper>
  );
};

export default ServiceForm;
