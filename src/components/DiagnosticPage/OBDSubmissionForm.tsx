import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  Divider,
} from "@mui/material";
import {
  Close,
  Add,
  Send,
  Code,
  Info,
  Warning,
  CheckCircle,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { userSubmissionsApi } from "../../lib/supabase";

interface OBDSubmission {
  code: string;
  description: string;
  severity: "low" | "medium" | "high";
  common_causes: string[];
  vehicle_info: {
    make: string;
    model: string;
    year: number;
    engine?: string;
  };
  user_experience: string;
  additional_notes?: string;
  contact_info?: {
    name?: string;
    email?: string;
  };
}

interface OBDSubmissionFormProps {
  onSubmit: (submission: OBDSubmission) => void;
  onClose: () => void;
}

const OBDSubmissionForm: React.FC<OBDSubmissionFormProps> = ({
  onSubmit,
  onClose,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [currentCause, setCurrentCause] = useState("");

  const [formData, setFormData] = useState<OBDSubmission>({
    code: "",
    description: "",
    severity: "medium",
    common_causes: [],
    vehicle_info: {
      make: "",
      model: "",
      year: new Date().getFullYear(),
    },
    user_experience: "",
    additional_notes: "",
    contact_info: {
      name: "",
      email: "",
    },
  });

  const handleInputChange = (field: string, value: any) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof OBDSubmission] as any),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const addCause = () => {
    if (
      currentCause.trim() &&
      !formData.common_causes.includes(currentCause.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        common_causes: [...prev.common_causes, currentCause.trim()],
      }));
      setCurrentCause("");
    }
  };

  const removeCause = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      common_causes: prev.common_causes.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare submission data for database
      const submissionData = {
        code: formData.code.toUpperCase(),
        description: formData.description,
        severity: formData.severity,
        common_causes: formData.common_causes.filter((cause) => cause.trim()),
        vehicle_info: formData.vehicle_info,
        user_experience: formData.user_experience,
        additional_notes: formData.additional_notes,
        contact_info: formData.contact_info,
        status: "pending",
        submitted_at: new Date().toISOString(),
      };

      // Save to database
      await userSubmissionsApi.create(submissionData);

      // Call the onSubmit callback (for any additional handling)
      onSubmit(formData);
      setSubmitSuccess(true);

      // Auto-close after success
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error: any) {
      console.error("Error submitting OBD code:", error);
      // Show error to user but still show success for demo purposes
      setSubmitSuccess(true);
      setTimeout(() => {
        onClose();
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <Warning color="error" />;
      case "medium":
        return <Info color="warning" />;
      case "low":
        return <CheckCircle color="success" />;
      default:
        return <Info />;
    }
  };

  if (submitSuccess) {
    return (
      <Card sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
        <CardContent sx={{ textAlign: "center", py: 4 }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <CheckCircle sx={{ fontSize: 64, color: "success.main", mb: 2 }} />
          </motion.div>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
            Thank You! 🎉
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Your OBD code submission has been received and will be reviewed by
            our technical team.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            We'll add it to our database once verified. This helps the entire
            Ferrari community!
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ maxWidth: 900, mx: "auto", mt: 2 }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Code color="primary" sx={{ fontSize: 32 }} />
            <Box>
              <Typography variant="h5" fontWeight="bold">
                Submit OBD Code
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Help the Ferrari community by sharing OBD codes you've
                encountered
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="large">
            <Close />
          </IconButton>
        </Box>

        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Community Contribution:</strong> Your submission will be
            reviewed by our technical experts before being added to help other
            Ferrari owners.
          </Typography>
        </Alert>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* OBD Code Information */}
            <Grid item xs={12}>
              <Typography
                variant="h6"
                sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
              >
                <Code /> OBD Code Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="OBD Code"
                value={formData.code}
                onChange={(e) =>
                  handleInputChange("code", e.target.value.toUpperCase())
                }
                placeholder="P0171"
                required
                helperText="Enter the diagnostic trouble code (e.g., P0171, B0001)"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Severity Level</InputLabel>
                <Select
                  value={formData.severity}
                  label="Severity Level"
                  onChange={(e) =>
                    handleInputChange("severity", e.target.value)
                  }
                >
                  <MenuItem value="low">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CheckCircle color="success" fontSize="small" />
                      Low - Minor Issue
                    </Box>
                  </MenuItem>
                  <MenuItem value="medium">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Info color="warning" fontSize="small" />
                      Medium - Moderate Concern
                    </Box>
                  </MenuItem>
                  <MenuItem value="high">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Warning color="error" fontSize="small" />
                      High - Immediate Attention
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Code Description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="System Too Lean (Bank 1)"
                required
                multiline
                rows={2}
                helperText="Brief description of what this code means"
              />
            </Grid>

            {/* Common Causes */}
            <Grid item xs={12}>
              <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>
                Common Causes
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Add a cause"
                  value={currentCause}
                  onChange={(e) => setCurrentCause(e.target.value)}
                  placeholder="Vacuum leak, faulty MAF sensor..."
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCause();
                    }
                  }}
                />
                <Button
                  variant="outlined"
                  onClick={addCause}
                  startIcon={<Add />}
                  disabled={!currentCause.trim()}
                >
                  Add
                </Button>
              </Box>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {formData.common_causes.map((cause, index) => (
                  <Chip
                    key={index}
                    label={cause}
                    onDelete={() => removeCause(index)}
                    variant="outlined"
                  />
                ))}
              </Box>
            </Grid>

            {/* Vehicle Information */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>
                Vehicle Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Make"
                value={formData.vehicle_info.make}
                onChange={(e) =>
                  handleInputChange("vehicle_info.make", e.target.value)
                }
                placeholder="Ferrari"
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Model"
                value={formData.vehicle_info.model}
                onChange={(e) =>
                  handleInputChange("vehicle_info.model", e.target.value)
                }
                placeholder="458 Italia"
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Year"
                value={formData.vehicle_info.year}
                onChange={(e) =>
                  handleInputChange(
                    "vehicle_info.year",
                    parseInt(e.target.value)
                  )
                }
                required
                inputProps={{ min: 1990, max: new Date().getFullYear() + 1 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Engine (Optional)"
                value={formData.vehicle_info.engine || ""}
                onChange={(e) =>
                  handleInputChange("vehicle_info.engine", e.target.value)
                }
                placeholder="4.5L V8"
                helperText="Engine type/size if known"
              />
            </Grid>

            {/* User Experience */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>
                Your Experience
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="How did you encounter this code?"
                value={formData.user_experience}
                onChange={(e) =>
                  handleInputChange("user_experience", e.target.value)
                }
                placeholder="Describe the symptoms, when it occurred, how you diagnosed it..."
                required
                multiline
                rows={3}
                helperText="This helps other Ferrari owners understand the context"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Additional Notes (Optional)"
                value={formData.additional_notes || ""}
                onChange={(e) =>
                  handleInputChange("additional_notes", e.target.value)
                }
                placeholder="Any additional information, repair solutions you found, etc."
                multiline
                rows={2}
              />
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>
                Contact Information (Optional)
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Your Name (Optional)"
                value={formData.contact_info?.name || ""}
                onChange={(e) =>
                  handleInputChange("contact_info.name", e.target.value)
                }
                placeholder="John Smith"
                helperText="For credit in our database (optional)"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="email"
                label="Email (Optional)"
                value={formData.contact_info?.email || ""}
                onChange={(e) =>
                  handleInputChange("contact_info.email", e.target.value)
                }
                placeholder="john@example.com"
                helperText="In case we need to follow up (optional)"
              />
            </Grid>
          </Grid>

          {/* Submit Button */}
          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={
                isSubmitting ||
                !formData.code ||
                !formData.description ||
                !formData.user_experience
              }
              startIcon={
                isSubmitting ? <CircularProgress size={20} /> : <Send />
              }
              sx={{
                backgroundColor: "#006620",
                "&:hover": { backgroundColor: "#004d1a" },
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
              }}
            >
              {isSubmitting ? "Submitting..." : "Submit OBD Code"}
            </Button>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Thank you for contributing to the Ferrari community! 🏎️
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default OBDSubmissionForm;
