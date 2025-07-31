import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
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
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Dashboard,
  Inventory,
  Code,
  ShoppingCart,
  Logout,
  Save,
  Cancel,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { adminApi, supabase, partsApi } from "../../lib/supabase";
import { Part, OBDCode, Order, PartCategory } from "../../types/types";
import { ColorBars } from "../elements/ColorBars";
import SEO from "../SEO";
import {
  PART_CATEGORIES,
  COMMON_SYMPTOMS,
  EXAMPLE_PARTS,
  FERRARI_MODELS,
} from "../../data/realisticParts";

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
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminDashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Data states
  const [parts, setParts] = useState<Part[]>([]);
  const [obdCodes, setObdCodes] = useState<OBDCode[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Dialog states
  const [partDialogOpen, setPartDialogOpen] = useState(false);
  const [obdDialogOpen, setObdDialogOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<Part | null>(null);
  const [editingOBDCode, setEditingOBDCode] = useState<OBDCode | null>(null);

  // Form states
  const [partForm, setPartForm] = useState({
    name: "",
    description: "",
    category: "Engine & Performance" as PartCategory,
    subcategory: "",
    brand: "Ferrari",
    price: "",
    availability: "in_stock",
    condition: "new",
    part_number: "",
    ferrari_part_number: "",
    alternative_numbers: [] as string[],
    ferrari_models: [] as string[],
    year_range: "",
    rarity_level: "common",
    provenance: "",
    fitment_notes: "",
  });

  const [obdForm, setObdForm] = useState({
    code: "",
    description: "",
    severity: "medium",
    common_causes: [] as string[],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Load parts data - simplified approach
      const partsData = await partsApi.getAll();
      setParts(partsData);
    } catch (err) {
      setError("Failed to load parts. Please try again.");
      console.error("Error loading data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handlePartSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const partData = {
        name: partForm.name,
        description: partForm.description,
        category: partForm.category,
        subcategory: partForm.subcategory,
        brand: partForm.brand,
        price: parseFloat(partForm.price) || 0,
        availability: partForm.availability,
        condition: partForm.condition,
        part_number: partForm.part_number,
        ferrari_part_number: partForm.ferrari_part_number,
        alternative_numbers: partForm.alternative_numbers,
        ferrari_models: partForm.ferrari_models,
        year_range: partForm.year_range,
        rarity_level: partForm.rarity_level,
        provenance: partForm.provenance,
        fitment_notes: partForm.fitment_notes,
        images: [],
        specifications: {},
      };

      if (editingPart) {
        // Update existing part using direct supabase call
        const { error } = await supabase
          .from("parts")
          .update(partData)
          .eq("id", editingPart.id);

        if (error) throw error;
        setSuccess("Part updated successfully!");
      } else {
        // Create new part using direct supabase call
        const { error } = await supabase.from("parts").insert([partData]);

        if (error) throw error;
        setSuccess("Part created successfully!");
      }

      setPartDialogOpen(false);
      resetPartForm();
      loadData();
    } catch (err: any) {
      setError(`Failed to save part: ${err.message}`);
      console.error("Error saving part:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOBDSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const obdData = {
        ...obdForm,
        common_causes: obdForm.common_causes.filter((cause) => cause.trim()),
      };

      if (editingOBDCode) {
        await adminApi.updateOBDCode(editingOBDCode.id, obdData);
        setSuccess("OBD Code updated successfully!");
      } else {
        await adminApi.createOBDCode(obdData);
        setSuccess("OBD Code created successfully!");
      }

      setObdDialogOpen(false);
      resetOBDForm();
      loadData();
    } catch (err) {
      setError("Failed to save OBD code. Please try again.");
      console.error("Error saving OBD code:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePart = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this part?")) {
      try {
        const { error } = await supabase.from("parts").delete().eq("id", id);

        if (error) throw error;
        setSuccess("Part deleted successfully!");
        loadData();
      } catch (err: any) {
        setError(`Failed to delete part: ${err.message}`);
        console.error("Error deleting part:", err);
      }
    }
  };

  const handleDeleteOBDCode = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this OBD code?")) {
      try {
        await adminApi.deleteOBDCode(id);
        setSuccess("OBD Code deleted successfully!");
        loadData();
      } catch (err) {
        setError("Failed to delete OBD code. Please try again.");
        console.error("Error deleting OBD code:", err);
      }
    }
  };

  const openPartDialog = (part?: Part) => {
    if (part) {
      setEditingPart(part);
      setPartForm({
        name: part.name,
        description: part.description,
        category: part.category,
        subcategory: part.subcategory || "",
        brand: part.brand,
        price: part.price.toString(),
        availability: part.availability,
        condition: part.condition || "new",
        part_number: part.part_number || "",
        ferrari_part_number: part.ferrari_part_number || "",
        alternative_numbers: part.alternative_numbers || [],
        ferrari_models: part.ferrari_models || [],
        year_range: part.year_range || "",
        rarity_level: part.rarity_level || "common",
        provenance: part.provenance || "",
        fitment_notes: part.fitment_notes || "",
      });
    } else {
      setEditingPart(null);
      resetPartForm();
    }
    setPartDialogOpen(true);
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
      setEditingOBDCode(null);
      resetOBDForm();
    }
    setObdDialogOpen(true);
  };

  const resetPartForm = () => {
    setPartForm({
      name: "",
      description: "",
      category: "Engine & Performance" as PartCategory,
      subcategory: "",
      brand: "Ferrari",
      price: "",
      availability: "in_stock",
      condition: "new",
      part_number: "",
      ferrari_part_number: "",
      alternative_numbers: [],
      ferrari_models: [],
      year_range: "",
      rarity_level: "common",
      provenance: "",
      fitment_notes: "",
    });
  };

  const resetOBDForm = () => {
    setObdForm({
      code: "",
      description: "",
      severity: "medium",
      common_causes: [],
    });
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "success";
      case "shipped":
        return "info";
      case "paid":
        return "warning";
      case "pending":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <>
      <SEO
        title="Admin Dashboard | JP Performance Cars"
        description="Admin dashboard for managing parts, OBD codes, and orders."
        canonical="https://www.jpperformancecars.co.uk/admin"
      />

      <Box>
        <Container
          maxWidth="xl"
          sx={{ mt: { xs: "20%", sm: "15%", md: "10%" } }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
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
              }}
            >
              ADMIN DASHBOARD
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
              <ColorBars />
            </Box>

            {/* Alerts */}
            {error && (
              <Alert
                severity="error"
                sx={{ mb: 3 }}
                onClose={() => setError(null)}
              >
                {error}
              </Alert>
            )}

            {success && (
              <Alert
                severity="success"
                sx={{ mb: 3 }}
                onClose={() => setSuccess(null)}
              >
                {success}
              </Alert>
            )}

            {/* Dashboard Stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Inventory
                        sx={{ fontSize: 40, color: "primary.main", mr: 2 }}
                      />
                      <Box>
                        <Typography variant="h4">{parts.length}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Parts
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Code
                        sx={{ fontSize: 40, color: "primary.main", mr: 2 }}
                      />
                      <Box>
                        <Typography variant="h4">{obdCodes.length}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          OBD Codes
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <ShoppingCart
                        sx={{ fontSize: 40, color: "primary.main", mr: 2 }}
                      />
                      <Box>
                        <Typography variant="h4">{orders.length}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Orders
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Dashboard
                        sx={{ fontSize: 40, color: "primary.main", mr: 2 }}
                      />
                      <Box>
                        <Typography variant="h4">
                          £
                          {orders
                            .reduce((sum, order) => sum + order.total, 0)
                            .toFixed(2)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Revenue
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab icon={<Inventory />} label="Parts" iconPosition="start" />
                <Tab icon={<Code />} label="OBD Codes" iconPosition="start" />
                <Tab
                  icon={<ShoppingCart />}
                  label="Orders"
                  iconPosition="start"
                />
              </Tabs>
            </Box>

            {/* Parts Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
              >
                <Typography variant="h5">Parts Management</Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={async () => {
                      setIsLoading(true);
                      try {
                        for (const examplePart of EXAMPLE_PARTS) {
                          await adminApi.createPart?.({
                            ...examplePart,
                            images: [],
                            specifications: {},
                          });
                        }
                        setSuccess("Added realistic example parts!");
                        loadData();
                      } catch (err) {
                        setError("Failed to add example parts");
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    sx={{
                      borderColor: "#006620",
                      color: "#006620",
                      "&:hover": { backgroundColor: "#f5f5f5" },
                    }}
                  >
                    🚀 Quick Add Examples
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => openPartDialog()}
                    sx={{
                      backgroundColor: "#006620",
                      "&:hover": { backgroundColor: "#004d1a" },
                    }}
                  >
                    Add Part
                  </Button>
                </Box>
              </Box>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Brand</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Availability</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {parts.map((part) => (
                      <TableRow key={part.id}>
                        <TableCell>{part.name}</TableCell>
                        <TableCell>{part.brand}</TableCell>
                        <TableCell>{part.category}</TableCell>
                        <TableCell>£{part.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <Chip
                            label={part.availability
                              .replace("_", " ")
                              .toUpperCase()}
                            color={
                              part.availability === "in_stock"
                                ? "success"
                                : "warning"
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => openPartDialog(part)}
                            size="small"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeletePart(part.id)}
                            size="small"
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>

            {/* OBD Codes Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
              >
                <Typography variant="h5">OBD Codes Management</Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => openOBDDialog()}
                  sx={{
                    backgroundColor: "#006620",
                    "&:hover": { backgroundColor: "#004d1a" },
                  }}
                >
                  Add OBD Code
                </Button>
              </Box>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Code</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Severity</TableCell>
                      <TableCell>Common Causes</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {obdCodes.map((code) => (
                      <TableRow key={code.id}>
                        <TableCell>{code.code}</TableCell>
                        <TableCell>{code.description}</TableCell>
                        <TableCell>
                          <Chip
                            label={code.severity.toUpperCase()}
                            color={getSeverityColor(code.severity)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {code.common_causes.length} causes
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => openOBDDialog(code)}
                            size="small"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeleteOBDCode(code.id)}
                            size="small"
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>

            {/* Orders Tab */}
            <TabPanel value={tabValue} index={2}>
              <Typography variant="h5" sx={{ mb: 3 }}>
                Order Management
              </Typography>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.id.slice(0, 8)}...</TableCell>
                        <TableCell>{order.shipping_info.name}</TableCell>
                        <TableCell>£{order.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Chip
                            label={order.status.toUpperCase()}
                            color={getStatusColor(order.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(order.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <IconButton size="small">
                            <Visibility />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>
          </motion.div>
        </Container>
      </Box>

      {/* Part Dialog */}
      <Dialog
        open={partDialogOpen}
        onClose={() => setPartDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{editingPart ? "Edit Part" : "Add New Part"}</DialogTitle>
        <DialogContent>
          <Typography
            variant="h6"
            sx={{ mb: 3, color: "#DC143C", textAlign: "center" }}
          >
            🏎️ {editingPart ? "Edit" : "Add"} Ferrari Part
          </Typography>

          <Grid container spacing={3}>
            {/* Basic Part Info */}
            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                Basic Information
              </Typography>
            </Grid>

            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Part Name"
                placeholder="e.g. Carbon Fiber Engine Cover - 458 Italia"
                value={partForm.name}
                onChange={(e) =>
                  setPartForm({ ...partForm, name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Brand</InputLabel>
                <Select
                  value={partForm.brand}
                  label="Brand"
                  onChange={(e) =>
                    setPartForm({ ...partForm, brand: e.target.value })
                  }
                >
                  <MenuItem value="Ferrari">🏎️ Ferrari OEM</MenuItem>
                  <MenuItem value="Novitec">⚡ Novitec</MenuItem>
                  <MenuItem value="Capristo">🔥 Capristo</MenuItem>
                  <MenuItem value="Akrapovic">🎵 Akrapovic</MenuItem>
                  <MenuItem value="Brembo">🛑 Brembo</MenuItem>
                  <MenuItem value="Michelin">🏁 Michelin</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={partForm.category}
                  label="Category"
                  onChange={(e) =>
                    setPartForm({
                      ...partForm,
                      category: e.target.value as PartCategory,
                      subcategory: "",
                    })
                  }
                >
                  {Object.keys(PART_CATEGORIES).map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={!partForm.category}>
                <InputLabel>Subcategory</InputLabel>
                <Select
                  value={partForm.subcategory}
                  label="Subcategory"
                  onChange={(e) =>
                    setPartForm({ ...partForm, subcategory: e.target.value })
                  }
                >
                  {partForm.category &&
                    PART_CATEGORIES[partForm.category as PartCategory]?.map(
                      (subcategory) => (
                        <MenuItem key={subcategory} value={subcategory}>
                          {subcategory}
                        </MenuItem>
                      )
                    )}
                </Select>
              </FormControl>
            </Grid>

            {/* Part Numbers & Pricing */}
            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", mb: 1, mt: 2 }}
              >
                Part Numbers & Pricing
              </Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Our Part Number"
                placeholder="e.g. JP-458-001"
                value={partForm.part_number}
                onChange={(e) =>
                  setPartForm({ ...partForm, part_number: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Ferrari Part Number"
                placeholder="e.g. 70003999"
                value={partForm.ferrari_part_number}
                onChange={(e) =>
                  setPartForm({
                    ...partForm,
                    ferrari_part_number: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Price (£)"
                type="number"
                inputProps={{ step: "0.01" }}
                value={partForm.price}
                onChange={(e) =>
                  setPartForm({ ...partForm, price: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Availability</InputLabel>
                <Select
                  value={partForm.availability}
                  label="Availability"
                  onChange={(e) =>
                    setPartForm({ ...partForm, availability: e.target.value })
                  }
                >
                  <MenuItem value="in_stock">✅ In Stock</MenuItem>
                  <MenuItem value="backorder">⏱️ Backorder</MenuItem>
                  <MenuItem value="out_of_stock">❌ Out of Stock</MenuItem>
                  <MenuItem value="rare_find">💎 Rare Find</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Condition</InputLabel>
                <Select
                  value={partForm.condition}
                  label="Condition"
                  onChange={(e) =>
                    setPartForm({ ...partForm, condition: e.target.value })
                  }
                >
                  <MenuItem value="new">🆕 New</MenuItem>
                  <MenuItem value="used_excellent">
                    ⭐ Used - Excellent
                  </MenuItem>
                  <MenuItem value="used_good">👍 Used - Good</MenuItem>
                  <MenuItem value="refurbished">🔧 Refurbished</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Ferrari Model Compatibility */}
            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", mb: 1, mt: 2 }}
              >
                🏎️ Ferrari Model Compatibility
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Compatible Ferrari Models"
                placeholder="458 Italia, 458 Spider"
                helperText="Comma-separated models"
                value={partForm.ferrari_models.join(", ")}
                onChange={(e) =>
                  setPartForm({
                    ...partForm,
                    ferrari_models: e.target.value
                      .split(",")
                      .map((model) => model.trim())
                      .filter(Boolean),
                  })
                }
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Year Range"
                placeholder="2009-2015"
                value={partForm.year_range}
                onChange={(e) =>
                  setPartForm({ ...partForm, year_range: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Rarity Level</InputLabel>
                <Select
                  value={partForm.rarity_level}
                  label="Rarity Level"
                  onChange={(e) =>
                    setPartForm({ ...partForm, rarity_level: e.target.value })
                  }
                >
                  <MenuItem value="common">🔧 Common</MenuItem>
                  <MenuItem value="rare">💎 Rare</MenuItem>
                  <MenuItem value="extremely_rare">👑 Extremely Rare</MenuItem>
                  <MenuItem value="one_off">🏆 One-Off</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Detailed Description"
                multiline
                rows={3}
                placeholder="Genuine Ferrari carbon fiber engine cover. Showcases the 4.5L V8 engine with authentic Prancing Horse branding..."
                value={partForm.description}
                onChange={(e) =>
                  setPartForm({ ...partForm, description: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Provenance"
                placeholder="Removed from low-mileage 458 Italia during service"
                helperText="Source/history of the part"
                value={partForm.provenance}
                onChange={(e) =>
                  setPartForm({ ...partForm, provenance: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fitment Notes"
                placeholder="Direct OEM replacement. Includes all mounting hardware."
                helperText="Special installation requirements"
                value={partForm.fitment_notes}
                onChange={(e) =>
                  setPartForm({ ...partForm, fitment_notes: e.target.value })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setPartDialogOpen(false)}
            startIcon={<Cancel />}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePartSubmit}
            variant="contained"
            startIcon={<Save />}
            disabled={isLoading}
            sx={{
              backgroundColor: "#006620",
              "&:hover": { backgroundColor: "#004d1a" },
            }}
          >
            {isLoading ? <CircularProgress size={20} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* OBD Code Dialog */}
      <Dialog
        open={obdDialogOpen}
        onClose={() => setObdDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingOBDCode ? "Edit OBD Code" : "Add New OBD Code"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Code"
                value={obdForm.code}
                onChange={(e) =>
                  setObdForm({ ...obdForm, code: e.target.value.toUpperCase() })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Severity</InputLabel>
                <Select
                  value={obdForm.severity}
                  label="Severity"
                  onChange={(e) =>
                    setObdForm({ ...obdForm, severity: e.target.value })
                  }
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={obdForm.description}
                onChange={(e) =>
                  setObdForm({ ...obdForm, description: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Common Causes (comma-separated)"
                value={obdForm.common_causes.join(", ")}
                onChange={(e) =>
                  setObdForm({
                    ...obdForm,
                    common_causes: e.target.value
                      .split(",")
                      .map((cause) => cause.trim()),
                  })
                }
                helperText="Enter common causes separated by commas"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setObdDialogOpen(false)}
            startIcon={<Cancel />}
          >
            Cancel
          </Button>
          <Button
            onClick={handleOBDSubmit}
            variant="contained"
            startIcon={<Save />}
            disabled={isLoading}
            sx={{
              backgroundColor: "#006620",
              "&:hover": { backgroundColor: "#004d1a" },
            }}
          >
            {isLoading ? <CircularProgress size={20} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminDashboard;
