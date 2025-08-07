import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  AppBar,
  Toolbar,
  Fab,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tabs,
  Tab,
  Badge,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputAdornment,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Save,
  Cancel,
  Logout,
  Inventory,
  Dashboard,
  Close,
  Build,
  DirectionsCar,
  Code,
  RateReview,
  Search,
  ExpandMore,
  CheckCircle,
  Info,
  Warning,
  CheckCircleOutline,
  Image as ImageIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import {
  supabase,
  partsApi,
  obdCodesApi,
  adminApi,
  userSubmissionsApi,
} from "../../lib/supabase";
import { Part, PartCategory, OBDCode } from "../../types/types";
import {
  GENERAL_PART_CATEGORIES,
  EXAMPLE_GENERAL_PARTS,
} from "../../data/generalParts";
import { generatePartSlug } from "../../utils/slugUtils";
import SEO from "../SEO";
import ImageUpload from "./ImageUpload";

interface UserSubmission {
  id: string;
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
  status: "pending" | "approved" | "rejected";
  submitted_at: string;
  reviewed_by?: string;
  review_notes?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

interface SimpleAdminDashboardProps {
  adminUser?: any;
  onLogout?: () => void;
}

const SimpleAdminDashboard: React.FC<SimpleAdminDashboardProps> = ({
  adminUser,
  onLogout,
}) => {
  // Tab management
  const [tabValue, setTabValue] = useState(0);

  // Data states
  const [parts, setParts] = useState<Part[]>([]);
  const [obdCodes, setObdCodes] = useState<OBDCode[]>([]);
  const [userSubmissions, setUserSubmissions] = useState<UserSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [obdDialogOpen, setObdDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<Part | null>(null);
  const [editingOBDCode, setEditingOBDCode] = useState<OBDCode | null>(null);
  const [reviewingSubmission, setReviewingSubmission] =
    useState<UserSubmission | null>(null);

  // Search and filter states
  const [obdSearchTerm, setObdSearchTerm] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("all");

  // Form states
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    category: "Engine & Performance" as PartCategory,
    subcategory: "",
    brand: "",
    price: "",
    quantity: "1",
    condition: "new",
    availability: "in_stock",
    part_number: "",
    compatible_vehicles: [] as string[],
    year_range: "",
    fitment_notes: "",
    images: [] as string[],
    primary_image_index: 0,
  });

  const [obdForm, setObdForm] = useState({
    code: "",
    description: "",
    severity: "medium" as "low" | "medium" | "high",
    common_causes: [] as string[],
  });

  const [reviewForm, setReviewForm] = useState({
    status: "pending" as "pending" | "approved" | "rejected",
    review_notes: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [partsData, obdCodesData, submissionsData] = await Promise.all([
        partsApi.getAll(),
        obdCodesApi.getAll(),
        userSubmissionsApi.getAll().catch(() => []), // Graceful fallback if table doesn't exist
      ]);

      setParts(partsData);
      setObdCodes(obdCodesData);
      setUserSubmissions(submissionsData);
    } catch (err: any) {
      setError(`Failed to load data: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      slug: "",
      description: "",
      category: "Engine & Performance",
      subcategory: "",
      brand: "",
      price: "",
      quantity: "1",
      condition: "new",
      availability: "in_stock",
      part_number: "",
      compatible_vehicles: [],
      year_range: "",
      fitment_notes: "",
      images: [],
      primary_image_index: 0,
    });
  };

  const openDialog = (part?: Part) => {
    if (part) {
      setEditingPart(part);
      setForm({
        name: part.name,
        slug: part.slug || generatePartSlug(part.name, part.brand),
        description: part.description,
        category: part.category,
        subcategory: part.subcategory || "",
        brand: part.brand,
        price: part.price.toString(),
        quantity: part.quantity?.toString() || "1",
        condition: part.condition || "new",
        availability: part.availability,
        part_number: part.part_number || "",
        compatible_vehicles: part.ferrari_models || [], // Use ferrari_models as compatible_vehicles for backward compatibility
        year_range: part.year_range || "",
        fitment_notes: part.fitment_notes || "",
        images: (part as any).images || [],
        primary_image_index: (part as any).primary_image_index || 0,
      });
    } else {
      setEditingPart(null);
      resetForm();
    }
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Generate slug if not provided
      const slug = form.slug || generatePartSlug(form.name, form.brand);

      // Include all fields including images (database schema should be updated)
      const partData = {
        name: form.name,
        slug: slug,
        description: form.description,
        category: form.category,
        brand: form.brand,
        price: parseFloat(form.price) || 0,
        quantity: parseInt(form.quantity) || 0,
        availability: form.availability,
        part_number: form.part_number,
        images: form.images,
        primary_image_index: form.primary_image_index,
      };

      if (editingPart) {
        const { error } = await supabase
          .from("parts")
          .update(partData)
          .eq("id", editingPart.id);

        if (error) throw error;

        const imageNote =
          form.images.length > 0
            ? ` with ${form.images.length} image(s) saved to storage and database!`
            : "";
        setSuccess(`Part updated successfully${imageNote}`);
      } else {
        const { error } = await supabase.from("parts").insert([partData]);

        if (error) throw error;

        const imageNote =
          form.images.length > 0
            ? ` with ${form.images.length} image(s) saved to storage and database!`
            : "";
        setSuccess(`Part added successfully${imageNote}`);
      }

      setDialogOpen(false);
      resetForm();
      loadData();
    } catch (err: any) {
      setError(`Failed to save part: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        const { error } = await supabase.from("parts").delete().eq("id", id);

        if (error) throw error;
        setSuccess("Part deleted successfully!");
        loadData();
      } catch (err: any) {
        setError(`Failed to delete part: ${err.message}`);
      }
    }
  };

  const addExampleParts = async () => {
    try {
      setIsLoading(true);
      for (const examplePart of EXAMPLE_GENERAL_PARTS) {
        const { error } = await supabase.from("parts").insert([
          {
            name: examplePart.name,
            description: examplePart.description,
            category: examplePart.category,
            brand: examplePart.brand,
            price: examplePart.price,
            availability: examplePart.availability,
          },
        ]);
        if (error) throw error;
      }
      setSuccess("Example parts added!");
      loadData();
    } catch (err: any) {
      setError(`Failed to add example parts: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // OBD Code Management Functions
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "default";
    }
  };

  const handleOBDSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const obdData = {
        code: obdForm.code.toUpperCase(),
        description: obdForm.description,
        severity: obdForm.severity as "low" | "medium" | "high",
        common_causes: obdForm.common_causes.filter((cause) => cause.trim()),
      };

      if (editingOBDCode) {
        // Update existing OBD code in database
        try {
          const updatedOBDCode = await adminApi.updateOBDCode(
            editingOBDCode.id,
            obdData
          );

          // Update local state
          setObdCodes((prev) =>
            prev.map((code) =>
              code.id === editingOBDCode.id ? updatedOBDCode : code
            )
          );
          setSuccess("✅ OBD code updated successfully in database!");
        } catch (dbError: any) {
          // Fallback to local state update
          console.error("Failed to update OBD code in database:", dbError);
          setObdCodes((prev) =>
            prev.map((code) =>
              code.id === editingOBDCode.id ? { ...code, ...obdData } : code
            )
          );
          setSuccess("⚠️ OBD code updated locally (database update failed)");
        }
      } else {
        // Create new OBD code in database
        try {
          const newOBDCode = await adminApi.createOBDCode(obdData);

          // Update local state with database result
          setObdCodes((prev) => [...prev, newOBDCode]);
          setSuccess("✅ OBD code created successfully in database!");
        } catch (dbError: any) {
          // Fallback to local state update
          console.error("Failed to create OBD code in database:", dbError);
          const localOBDCode = {
            ...obdData,
            id: Date.now().toString(),
            created_at: new Date().toISOString(),
          };
          setObdCodes((prev) => [...prev, localOBDCode]);
          setSuccess("⚠️ OBD code created locally (database save failed)");
        }
      }

      setObdDialogOpen(false);
      resetOBDForm();
    } catch (err: any) {
      setError(`Failed to save OBD code: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const resetOBDForm = () => {
    setObdForm({
      code: "",
      description: "",
      severity: "medium" as "low" | "medium" | "high",
      common_causes: [],
    });
    setEditingOBDCode(null);
  };

  const openOBDDialog = (obdCode?: OBDCode) => {
    if (obdCode) {
      setEditingOBDCode(obdCode);
      setObdForm({
        code: obdCode.code,
        description: obdCode.description,
        severity: obdCode.severity,
        common_causes: obdCode.common_causes,
      });
    } else {
      resetOBDForm();
    }
    setObdDialogOpen(true);
  };

  const handleDeleteOBDCode = async (obdCodeId: string) => {
    if (window.confirm("Are you sure you want to delete this OBD code?")) {
      try {
        // Delete from database
        await adminApi.deleteOBDCode(obdCodeId);

        // Update local state
        setObdCodes((prev) => prev.filter((code) => code.id !== obdCodeId));
        setSuccess("✅ OBD code deleted successfully from database!");
      } catch (dbError: any) {
        console.error("Failed to delete OBD code from database:", dbError);
        // Still update local state for demo purposes
        setObdCodes((prev) => prev.filter((code) => code.id !== obdCodeId));
        setSuccess("⚠️ OBD code deleted locally (database delete failed)");
      }
    }
  };

  const handleReviewSubmission = (submission: UserSubmission) => {
    setReviewingSubmission(submission);
    setReviewForm({
      status: submission.status,
      review_notes: submission.review_notes || "",
    });
    setReviewDialogOpen(true);
  };

  const submitReview = async () => {
    if (!reviewingSubmission) return;

    setIsLoading(true);
    try {
      if (reviewForm.status === "approved") {
        // Add to OBD codes database
        const newOBDCode = {
          code: reviewingSubmission.code,
          description: reviewingSubmission.description,
          severity: reviewingSubmission.severity,
          common_causes: reviewingSubmission.common_causes,
        };

        try {
          // Save to database using admin API
          const savedOBDCode = await adminApi.createOBDCode(newOBDCode);

          // Update local state with the saved OBD code
          setObdCodes((prev) => [...prev, savedOBDCode]);

          setSuccess(
            `✅ Submission approved and OBD code ${reviewingSubmission.code} added to database!`
          );

          // Auto-switch to OBD Codes tab to show the newly added code
          setTimeout(() => {
            setTabValue(1);
          }, 1500);
        } catch (obdError: any) {
          // If database save fails, still update local state for demo purposes
          console.error("Failed to save OBD code to database:", obdError);

          const localOBDCode = {
            ...newOBDCode,
            id: Date.now().toString(),
            created_at: new Date().toISOString(),
          };

          setObdCodes((prev) => [...prev, localOBDCode]);
          setSuccess(
            `✅ Submission approved and OBD code ${reviewingSubmission.code} added locally!`
          );

          // Auto-switch to OBD Codes tab to show the newly added code
          setTimeout(() => {
            setTabValue(1);
          }, 1500);
        }
      } else {
        setSuccess(`Submission ${reviewForm.status} successfully!`);
      }

      // Update submission status in database
      try {
        await userSubmissionsApi.updateStatus(
          reviewingSubmission.id,
          reviewForm.status,
          reviewForm.review_notes,
          adminUser?.name || "Admin"
        );

        // Update local state
        setUserSubmissions((prev) =>
          prev.map((sub) =>
            sub.id === reviewingSubmission.id
              ? {
                  ...sub,
                  status: reviewForm.status,
                  review_notes: reviewForm.review_notes,
                  reviewed_by: adminUser?.name || "Admin",
                }
              : sub
          )
        );
      } catch (submissionError: any) {
        console.error("Failed to update submission status:", submissionError);
        // Still update local state
        setUserSubmissions((prev) =>
          prev.map((sub) =>
            sub.id === reviewingSubmission.id
              ? {
                  ...sub,
                  status: reviewForm.status,
                  review_notes: reviewForm.review_notes,
                  reviewed_by: adminUser?.name || "Admin",
                }
              : sub
          )
        );
      }

      setReviewDialogOpen(false);
    } catch (err: any) {
      setError(`Failed to review submission: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter functions
  const filteredOBDCodes = obdCodes.filter((code) => {
    const matchesSearch =
      obdSearchTerm === "" ||
      code.code.toLowerCase().includes(obdSearchTerm.toLowerCase()) ||
      code.description.toLowerCase().includes(obdSearchTerm.toLowerCase());

    const matchesSeverity =
      filterSeverity === "all" || code.severity === filterSeverity;

    return matchesSearch && matchesSeverity;
  });

  const pendingSubmissions = userSubmissions.filter(
    (sub) => sub.status === "pending"
  );

  return (
    <>
      <SEO
        title="Parts Manager | JP Performance Cars"
        description="Professional automotive parts inventory management system."
        canonical="https://www.jpperformancecars.co.uk/admin"
      />

      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#f8fafc",
        }}
      >
        {/* Top Navigation */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            background: "linear-gradient(135deg, #2d3748 0%, #1a202c 100%)",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            top: 0,
            zIndex: 1100,
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "8px",
                  background:
                    "linear-gradient(135deg, #DC143C 0%, #B12A37 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Build sx={{ color: "white", fontSize: 20 }} />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "white" }}
                >
                  Parts Manager
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "rgba(255,255,255,0.7)" }}
                >
                  {adminUser?.name || "Admin"} • {parts.length} parts •{" "}
                  {obdCodes.length} OBD codes
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Chip
                icon={<Inventory />}
                label={`${parts.length} Parts`}
                sx={{
                  backgroundColor: "rgba(255,255,255,0.15)",
                  color: "white",
                  fontWeight: 500,
                }}
              />
              <Chip
                icon={<Code />}
                label={`${obdCodes.length} OBD Codes`}
                sx={{
                  backgroundColor: "rgba(255,255,255,0.15)",
                  color: "white",
                  fontWeight: 500,
                }}
              />
              {pendingSubmissions.length > 0 && (
                <Badge badgeContent={pendingSubmissions.length} color="error">
                  <Chip
                    icon={<RateReview />}
                    label="Reviews"
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.15)",
                      color: "white",
                      fontWeight: 500,
                    }}
                  />
                </Badge>
              )}
              {onLogout && (
                <Button
                  variant="outlined"
                  onClick={onLogout}
                  startIcon={<Logout />}
                  sx={{
                    borderColor: "rgba(255,255,255,0.3)",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.1)",
                      borderColor: "white",
                    },
                  }}
                >
                  Sign Out
                </Button>
              )}
            </Box>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            minHeight: 0, // Important for flex child to shrink
          }}
        >
          {/* Alerts */}
          {error && (
            <Alert
              severity="error"
              sx={{ m: 2, borderRadius: 2 }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}
          {success && (
            <Alert
              severity="success"
              sx={{ m: 2, borderRadius: 2 }}
              onClose={() => setSuccess(null)}
            >
              {success}
            </Alert>
          )}

          {/* Tabs */}
          <Box sx={{ px: 3, borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab icon={<Inventory />} label="Parts Management" />
              <Tab icon={<Code />} label="OBD Codes" />
              <Tab
                icon={
                  <Badge badgeContent={pendingSubmissions.length} color="error">
                    <RateReview />
                  </Badge>
                }
                label="Review Submissions"
              />
            </Tabs>
          </Box>

          {/* Tab Panels */}
          <Box
            sx={{
              flex: 1,
              px: 3,
              pb: 3,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Parts Management Tab */}
            <TabPanel value={tabValue} index={0}>
              {/* Quick Actions */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => openDialog()}
                    sx={{
                      background:
                        "linear-gradient(135deg, #DC143C 0%, #B12A37 100%)",
                      boxShadow: "0 4px 15px rgba(220, 20, 60, 0.3)",
                      borderRadius: 2,
                      px: 3,
                      py: 1.2,
                      fontWeight: 600,
                      textTransform: "none",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #B12A37 0%, #8B1538 100%)",
                        boxShadow: "0 6px 20px rgba(220, 20, 60, 0.4)",
                      },
                    }}
                  >
                    Add New Part
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={addExampleParts}
                    disabled={isLoading}
                    sx={{
                      borderColor: "#e2e8f0",
                      color: "#64748b",
                      borderRadius: 2,
                      px: 3,
                      py: 1.2,
                      fontWeight: 500,
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "#f1f5f9",
                        borderColor: "#cbd5e1",
                      },
                    }}
                  >
                    🚀 Add Sample Parts
                  </Button>
                </Box>
              </Box>

              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  border: "1px solid #e2e8f0",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                <CardContent
                  sx={{
                    p: 0,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box sx={{ p: 3, pb: 2, borderBottom: "1px solid #e2e8f0" }}>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: "#1e293b" }}
                    >
                      Parts Inventory
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Manage your automotive parts catalog
                    </Typography>
                  </Box>

                  {isLoading ? (
                    <Box
                      sx={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CircularProgress sx={{ color: "#DC143C" }} />
                    </Box>
                  ) : (
                    <Box sx={{ flex: 1, overflow: "auto" }}>
                      <TableContainer>
                        <Table stickyHeader>
                          <TableHead>
                            <TableRow>
                              <TableCell
                                sx={{
                                  fontWeight: 600,
                                  backgroundColor: "#f8fafc",
                                  width: 80,
                                }}
                              >
                                Image
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontWeight: 600,
                                  backgroundColor: "#f8fafc",
                                }}
                              >
                                Part Details
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontWeight: 600,
                                  backgroundColor: "#f8fafc",
                                }}
                              >
                                Category
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontWeight: 600,
                                  backgroundColor: "#f8fafc",
                                }}
                              >
                                Brand
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontWeight: 600,
                                  backgroundColor: "#f8fafc",
                                }}
                              >
                                Price
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontWeight: 600,
                                  backgroundColor: "#f8fafc",
                                }}
                              >
                                Quantity
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontWeight: 600,
                                  backgroundColor: "#f8fafc",
                                }}
                              >
                                Status
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontWeight: 600,
                                  backgroundColor: "#f8fafc",
                                  width: 120,
                                }}
                              >
                                Actions
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {parts.map((part) => (
                              <TableRow key={part.id} hover>
                                <TableCell>
                                  <Box
                                    sx={{
                                      width: 60,
                                      height: 60,
                                      borderRadius: 1,
                                      overflow: "hidden",
                                      backgroundColor: "#f5f5f5",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    {(part as any).images &&
                                    (part as any).images.length > 0 ? (
                                      <img
                                        src={
                                          (part as any).images[
                                            (part as any).primary_image_index ||
                                              0
                                          ]
                                        }
                                        alt={part.name}
                                        style={{
                                          width: "100%",
                                          height: "100%",
                                          objectFit: "cover",
                                        }}
                                      />
                                    ) : (
                                      <ImageIcon
                                        sx={{ color: "#ccc", fontSize: 24 }}
                                      />
                                    )}
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Box>
                                    <Typography
                                      variant="body2"
                                      sx={{ fontWeight: 600, mb: 0.5 }}
                                    >
                                      {part.name}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                      sx={{ display: "block" }}
                                    >
                                      {part.description?.substring(0, 60)}...
                                    </Typography>
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    label={part.category}
                                    size="small"
                                    sx={{
                                      backgroundColor: "#e0f2fe",
                                      color: "#0277bd",
                                      fontWeight: 500,
                                    }}
                                  />
                                </TableCell>
                                <TableCell>{part.brand}</TableCell>
                                <TableCell>
                                  <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 600 }}
                                  >
                                    £{part.price.toLocaleString()}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: 600,
                                      color:
                                        part.quantity > 0
                                          ? "#2e7d32"
                                          : "#c62828",
                                    }}
                                  >
                                    {part.quantity || 0}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    label={
                                      part.availability === "in_stock"
                                        ? "In Stock"
                                        : "Out of Stock"
                                    }
                                    size="small"
                                    sx={{
                                      backgroundColor:
                                        part.availability === "in_stock"
                                          ? "#e8f5e8"
                                          : "#ffebee",
                                      color:
                                        part.availability === "in_stock"
                                          ? "#2e7d32"
                                          : "#c62828",
                                      fontWeight: 500,
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: "flex", gap: 1 }}>
                                    <IconButton
                                      size="small"
                                      onClick={() => openDialog(part)}
                                      sx={{
                                        color: "#DC143C",
                                        "&:hover": {
                                          backgroundColor:
                                            "rgba(220, 20, 60, 0.1)",
                                        },
                                      }}
                                    >
                                      <Edit fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        handleDelete(part.id, part.name)
                                      }
                                      sx={{
                                        color: "#f44336",
                                        "&:hover": {
                                          backgroundColor:
                                            "rgba(244, 67, 54, 0.1)",
                                        },
                                      }}
                                    >
                                      <Delete fontSize="small" />
                                    </IconButton>
                                  </Box>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </TabPanel>

            {/* OBD Codes Tab */}
            <TabPanel value={tabValue} index={1}>
              {/* Quick Actions */}
              <Box
                sx={{
                  mb: 2,
                  display: "flex",
                  gap: 2,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <TextField
                  size="small"
                  placeholder="Search OBD codes..."
                  value={obdSearchTerm}
                  onChange={(e) => setObdSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ minWidth: 200 }}
                />
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Severity</InputLabel>
                  <Select
                    value={filterSeverity}
                    label="Severity"
                    onChange={(e) => setFilterSeverity(e.target.value)}
                  >
                    <MenuItem value="all">All Severities</MenuItem>
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => openOBDDialog()}
                  sx={{
                    background:
                      "linear-gradient(135deg, #DC143C 0%, #B12A37 100%)",
                    boxShadow: "0 4px 15px rgba(220, 20, 60, 0.3)",
                    borderRadius: 2,
                    px: 3,
                    py: 1.2,
                    fontWeight: 600,
                    textTransform: "none",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #B12A37 0%, #8B1538 100%)",
                      boxShadow: "0 6px 20px rgba(220, 20, 60, 0.4)",
                    },
                  }}
                >
                  Add OBD Code
                </Button>
              </Box>

              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  border: "1px solid #e2e8f0",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                <CardContent
                  sx={{
                    p: 0,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box sx={{ p: 3, pb: 2, borderBottom: "1px solid #e2e8f0" }}>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: "#1e293b" }}
                    >
                      OBD Diagnostic Codes
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Manage diagnostic trouble codes for Ferrari vehicles
                    </Typography>
                  </Box>

                  {isLoading ? (
                    <Box
                      sx={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CircularProgress sx={{ color: "#DC143C" }} />
                    </Box>
                  ) : (
                    <Box sx={{ flex: 1, overflow: "auto" }}>
                      <TableContainer>
                        <Table stickyHeader>
                          <TableHead>
                            <TableRow>
                              <TableCell
                                sx={{
                                  fontWeight: 600,
                                  backgroundColor: "#f8fafc",
                                }}
                              >
                                Code
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontWeight: 600,
                                  backgroundColor: "#f8fafc",
                                }}
                              >
                                Description
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontWeight: 600,
                                  backgroundColor: "#f8fafc",
                                }}
                              >
                                Severity
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontWeight: 600,
                                  backgroundColor: "#f8fafc",
                                }}
                              >
                                Common Causes
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontWeight: 600,
                                  backgroundColor: "#f8fafc",
                                  width: 120,
                                }}
                              >
                                Actions
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {filteredOBDCodes.map((code) => (
                              <TableRow key={code.id} hover>
                                <TableCell>
                                  <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 600 }}
                                  >
                                    {code.code}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2">
                                    {code.description.substring(0, 80)}...
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    label={code.severity.toUpperCase()}
                                    color={
                                      getSeverityColor(code.severity) as any
                                    }
                                    size="small"
                                    sx={{ fontWeight: 500 }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2">
                                    {code.common_causes.length} causes
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: "flex", gap: 1 }}>
                                    <IconButton
                                      size="small"
                                      onClick={() => openOBDDialog(code)}
                                      sx={{
                                        color: "#DC143C",
                                        "&:hover": {
                                          backgroundColor:
                                            "rgba(220, 20, 60, 0.1)",
                                        },
                                      }}
                                    >
                                      <Edit fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        handleDeleteOBDCode(code.id)
                                      }
                                      sx={{
                                        color: "#f44336",
                                        "&:hover": {
                                          backgroundColor:
                                            "rgba(244, 67, 54, 0.1)",
                                        },
                                      }}
                                    >
                                      <Delete fontSize="small" />
                                    </IconButton>
                                  </Box>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </TabPanel>

            {/* Review Submissions Tab */}
            <TabPanel value={tabValue} index={2}>
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#1e293b" }}
                >
                  User OBD Code Submissions
                  <Chip
                    label={`${pendingSubmissions.length} pending`}
                    color="error"
                    size="small"
                    sx={{ ml: 2 }}
                  />
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Review and approve user-contributed diagnostic codes
                </Typography>
              </Box>

              {userSubmissions.map((submission) => (
                <Accordion key={submission.id} sx={{ mb: 2, borderRadius: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        width: "100%",
                      }}
                    >
                      <Typography variant="h6" fontWeight="bold">
                        {submission.code}
                      </Typography>
                      <Chip
                        label={submission.status.toUpperCase()}
                        color={
                          submission.status === "approved"
                            ? "success"
                            : submission.status === "rejected"
                            ? "error"
                            : "warning"
                        }
                        size="small"
                      />
                      <Chip
                        label={submission.severity.toUpperCase()}
                        color={getSeverityColor(submission.severity) as any}
                        size="small"
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ ml: "auto" }}
                      >
                        {new Date(submission.submitted_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={8}>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          <strong>Description:</strong> {submission.description}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          <strong>Vehicle:</strong>{" "}
                          {submission.vehicle_info.year}{" "}
                          {submission.vehicle_info.make}{" "}
                          {submission.vehicle_info.model}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          <strong>User Experience:</strong>{" "}
                          {submission.user_experience}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          <strong>Common Causes:</strong>
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                            mb: 2,
                          }}
                        >
                          {submission.common_causes.map((cause, index) => (
                            <Chip
                              key={index}
                              label={cause}
                              variant="outlined"
                              size="small"
                            />
                          ))}
                        </Box>
                        {submission.contact_info?.name && (
                          <Typography variant="body2" color="text.secondary">
                            Submitted by: {submission.contact_info.name}
                            {submission.contact_info.email &&
                              ` (${submission.contact_info.email})`}
                          </Typography>
                        )}
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ textAlign: "right" }}>
                          {submission.status === "pending" && (
                            <Button
                              variant="contained"
                              onClick={() => handleReviewSubmission(submission)}
                              sx={{
                                background:
                                  "linear-gradient(135deg, #DC143C 0%, #B12A37 100%)",
                                "&:hover": {
                                  background:
                                    "linear-gradient(135deg, #B12A37 0%, #8B1538 100%)",
                                },
                              }}
                            >
                              Review Submission
                            </Button>
                          )}
                          {submission.status !== "pending" && (
                            <Typography variant="body2" color="text.secondary">
                              Reviewed: {submission.status}
                              {submission.review_notes && (
                                <Box
                                  sx={{
                                    mt: 1,
                                    p: 1,
                                    backgroundColor: "grey.100",
                                    borderRadius: 1,
                                  }}
                                >
                                  {submission.review_notes}
                                </Box>
                              )}
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))}
            </TabPanel>
          </Box>
        </Box>

        {/* Add/Edit Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            },
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {editingPart ? "Edit Part" : "Add New Part"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {editingPart
                    ? "Update part information"
                    : "Enter part details for your inventory"}
                </Typography>
              </Box>
              <IconButton onClick={() => setDialogOpen(false)}>
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Part Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Brake Pads, Air Filter, Engine Oil"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="URL Slug (SEO-friendly)"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="e.g. ferrari-458-exhaust-system"
                  helperText="Auto-generated from part name, but can be customized for SEO"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Brand"
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  placeholder="e.g. Bosch, Brembo, OEM"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={form.category}
                    label="Category"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        category: e.target.value as PartCategory,
                      })
                    }
                    sx={{
                      borderRadius: 2,
                    }}
                  >
                    {Object.keys(GENERAL_PART_CATEGORIES).map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Price (£)"
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Quantity in Stock"
                  type="number"
                  value={form.quantity}
                  onChange={(e) =>
                    setForm({ ...form, quantity: e.target.value })
                  }
                  inputProps={{ min: 0 }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Availability</InputLabel>
                  <Select
                    value={form.availability}
                    label="Availability"
                    onChange={(e) =>
                      setForm({ ...form, availability: e.target.value })
                    }
                    sx={{
                      borderRadius: 2,
                    }}
                  >
                    <MenuItem value="in_stock">✅ In Stock</MenuItem>
                    <MenuItem value="out_of_stock">❌ Out of Stock</MenuItem>
                    <MenuItem value="rare_find">💎 Rare Find</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Detailed description of the part, specifications, features..."
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <ImageUpload
                  images={form.images}
                  onImagesChange={(images) => setForm({ ...form, images })}
                  primaryImageIndex={form.primary_image_index}
                  onPrimaryImageChange={(index) =>
                    setForm({ ...form, primary_image_index: index })
                  }
                  maxImages={5}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 2 }}>
            <Button
              onClick={() => setDialogOpen(false)}
              startIcon={<Cancel />}
              sx={{
                textTransform: "none",
                color: "#64748b",
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              startIcon={<Save />}
              disabled={isLoading || !form.name || !form.price}
              sx={{
                background: "linear-gradient(135deg, #DC143C 0%, #B12A37 100%)",
                boxShadow: "0 4px 15px rgba(220, 20, 60, 0.3)",
                textTransform: "none",
                px: 3,
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #B12A37 0%, #8B1538 100%)",
                },
              }}
            >
              {isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                `${editingPart ? "Update" : "Add"} Part`
              )}
            </Button>
          </DialogActions>
        </Dialog>

        {/* OBD Code Dialog */}
        <Dialog
          open={obdDialogOpen}
          onClose={() => setObdDialogOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            },
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {editingOBDCode ? "Edit OBD Code" : "Add New OBD Code"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {editingOBDCode
                    ? "Update diagnostic code information"
                    : "Enter diagnostic trouble code details"}
                </Typography>
              </Box>
              <IconButton onClick={() => setObdDialogOpen(false)}>
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="OBD Code"
                  value={obdForm.code}
                  onChange={(e) =>
                    setObdForm({
                      ...obdForm,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="e.g. P0420, P0300"
                  required
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Severity Level</InputLabel>
                  <Select
                    value={obdForm.severity}
                    label="Severity Level"
                    onChange={(e) =>
                      setObdForm({
                        ...obdForm,
                        severity: e.target.value as "low" | "medium" | "high",
                      })
                    }
                  >
                    <MenuItem value="low">
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <CheckCircle color="success" fontSize="small" />
                        Low - Minor Issue
                      </Box>
                    </MenuItem>
                    <MenuItem value="medium">
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Info color="warning" fontSize="small" />
                        Medium - Moderate Issue
                      </Box>
                    </MenuItem>
                    <MenuItem value="high">
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Warning color="error" fontSize="small" />
                        High - Critical Issue
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  value={obdForm.description}
                  onChange={(e) =>
                    setObdForm({ ...obdForm, description: e.target.value })
                  }
                  placeholder="Detailed description of the diagnostic trouble code..."
                  required
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Common Causes
                </Typography>
                {obdForm.common_causes.map((cause, index) => (
                  <Box key={index} sx={{ display: "flex", gap: 1, mb: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      value={cause}
                      onChange={(e) => {
                        const newCauses = [...obdForm.common_causes];
                        newCauses[index] = e.target.value;
                        setObdForm({ ...obdForm, common_causes: newCauses });
                      }}
                      placeholder={`Common cause ${index + 1}`}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                    <IconButton
                      onClick={() => {
                        const newCauses = obdForm.common_causes.filter(
                          (_, i) => i !== index
                        );
                        setObdForm({ ...obdForm, common_causes: newCauses });
                      }}
                      color="error"
                      size="small"
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  startIcon={<Add />}
                  onClick={() =>
                    setObdForm({
                      ...obdForm,
                      common_causes: [...obdForm.common_causes, ""],
                    })
                  }
                  variant="outlined"
                  size="small"
                  sx={{ mt: 1 }}
                >
                  Add Cause
                </Button>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 2 }}>
            <Button
              onClick={() => setObdDialogOpen(false)}
              startIcon={<Cancel />}
              sx={{ textTransform: "none", color: "#64748b" }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleOBDSubmit}
              variant="contained"
              startIcon={<Save />}
              disabled={isLoading || !obdForm.code || !obdForm.description}
              sx={{
                background: "linear-gradient(135deg, #DC143C 0%, #B12A37 100%)",
                boxShadow: "0 4px 15px rgba(220, 20, 60, 0.3)",
                textTransform: "none",
                px: 3,
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #B12A37 0%, #8B1538 100%)",
                },
              }}
            >
              {isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                `${editingOBDCode ? "Update" : "Add"} OBD Code`
              )}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Review Submission Dialog */}
        <Dialog
          open={reviewDialogOpen}
          onClose={() => setReviewDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            },
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Review Submission: {reviewingSubmission?.code}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Approve or reject this user-submitted OBD code
                </Typography>
              </Box>
              <IconButton onClick={() => setReviewDialogOpen(false)}>
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Decision</InputLabel>
                  <Select
                    value={reviewForm.status}
                    label="Decision"
                    onChange={(e) =>
                      setReviewForm({
                        ...reviewForm,
                        status: e.target.value as
                          | "pending"
                          | "approved"
                          | "rejected",
                      })
                    }
                  >
                    <MenuItem value="pending">
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Info color="warning" fontSize="small" />
                        Pending Review
                      </Box>
                    </MenuItem>
                    <MenuItem value="approved">
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <CheckCircleOutline color="success" fontSize="small" />
                        Approve & Add to Database
                      </Box>
                    </MenuItem>
                    <MenuItem value="rejected">
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Cancel color="error" fontSize="small" />
                        Reject Submission
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Review Notes (Optional)"
                  value={reviewForm.review_notes}
                  onChange={(e) =>
                    setReviewForm({
                      ...reviewForm,
                      review_notes: e.target.value,
                    })
                  }
                  placeholder="Add any notes about your decision..."
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 2 }}>
            <Button
              onClick={() => setReviewDialogOpen(false)}
              startIcon={<Cancel />}
              sx={{ textTransform: "none", color: "#64748b" }}
            >
              Cancel
            </Button>
            <Button
              onClick={submitReview}
              variant="contained"
              startIcon={<Save />}
              disabled={isLoading}
              sx={{
                background: "linear-gradient(135deg, #DC143C 0%, #B12A37 100%)",
                boxShadow: "0 4px 15px rgba(220, 20, 60, 0.3)",
                textTransform: "none",
                px: 3,
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #B12A37 0%, #8B1538 100%)",
                },
              }}
            >
              {isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Submit Review"
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default SimpleAdminDashboard;
