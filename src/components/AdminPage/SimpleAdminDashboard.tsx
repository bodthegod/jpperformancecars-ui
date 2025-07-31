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
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { supabase, partsApi } from "../../lib/supabase";
import { Part, PartCategory } from "../../types/types";
import {
  GENERAL_PART_CATEGORIES,
  EXAMPLE_GENERAL_PARTS,
} from "../../data/generalParts";
import SEO from "../SEO";

interface SimpleAdminDashboardProps {
  adminUser?: any;
  onLogout?: () => void;
}

const SimpleAdminDashboard: React.FC<SimpleAdminDashboardProps> = ({
  adminUser,
  onLogout,
}) => {
  const [parts, setParts] = useState<Part[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<Part | null>(null);

  // Simple form state
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "Engine & Performance" as PartCategory,
    subcategory: "",
    brand: "",
    price: "",
    condition: "new",
    availability: "in_stock",
    part_number: "",
    compatible_vehicles: [] as string[],
    year_range: "",
    fitment_notes: "",
  });

  useEffect(() => {
    loadParts();
  }, []);

  const loadParts = async () => {
    try {
      setIsLoading(true);
      const data = await partsApi.getAll();
      setParts(data);
    } catch (err: any) {
      setError(`Failed to load parts: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      category: "Engine & Performance",
      subcategory: "",
      brand: "",
      price: "",
      condition: "new",
      availability: "in_stock",
      part_number: "",
      compatible_vehicles: [],
      year_range: "",
      fitment_notes: "",
    });
  };

  const openDialog = (part?: Part) => {
    if (part) {
      setEditingPart(part);
      setForm({
        name: part.name,
        description: part.description,
        category: part.category,
        subcategory: part.subcategory || "",
        brand: part.brand,
        price: part.price.toString(),
        condition: part.condition || "new",
        availability: part.availability,
        part_number: part.part_number || "",
        compatible_vehicles: part.ferrari_models || [], // Use ferrari_models as compatible_vehicles for backward compatibility
        year_range: part.year_range || "",
        fitment_notes: part.fitment_notes || "",
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

      // Only use columns that definitely exist in basic schema
      const partData = {
        name: form.name,
        description: form.description,
        category: form.category,
        brand: form.brand,
        price: parseFloat(form.price) || 0,
        availability: form.availability,
      };

      if (editingPart) {
        const { error } = await supabase
          .from("parts")
          .update(partData)
          .eq("id", editingPart.id);

        if (error) throw error;
        setSuccess("Part updated successfully!");
      } else {
        const { error } = await supabase.from("parts").insert([partData]);

        if (error) throw error;
        setSuccess("Part added successfully!");
      }

      setDialogOpen(false);
      resetForm();
      loadParts();
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
        loadParts();
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
      loadParts();
    } catch (err: any) {
      setError(`Failed to add example parts: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

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
                  {adminUser?.name || "Admin"} • {parts.length} parts in
                  inventory
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

          {/* Quick Actions */}
          <Box sx={{ p: 3, pb: 2 }}>
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

          {/* Parts Table */}
          <Box sx={{ flex: 1, px: 3, pb: 3, minHeight: 0, display: "flex" }}>
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
                sx={{ p: 0, flex: 1, display: "flex", flexDirection: "column" }}
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
                    <MenuItem value="backorder">⏱️ Backorder</MenuItem>
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
      </Box>
    </>
  );
};

export default SimpleAdminDashboard;
