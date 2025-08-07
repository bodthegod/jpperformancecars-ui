import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Card,
  CardMedia,
  Grid,
  Alert,
  CircularProgress,
  Chip,
} from "@mui/material";
import {
  CloudUpload,
  Delete,
  Image as ImageIcon,
  Star,
  StarBorder,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { supabase } from "../../lib/supabase";

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  primaryImageIndex?: number;
  onPrimaryImageChange?: (index: number) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onImagesChange,
  maxImages = 5,
  primaryImageIndex = 0,
  onPrimaryImageChange,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    const remainingSlots = maxImages - images.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    if (filesToProcess.length === 0) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const newImageUrls: string[] = [];

      for (const file of filesToProcess) {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          setError(`${file.name} is not a valid image file`);
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setError(`${file.name} is too large. Maximum size is 5MB`);
          continue;
        }

        try {
          // Generate unique filename
          const fileExt = file.name.split(".").pop();
          const fileName = `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2)}.${fileExt}`;
          const filePath = `parts/${fileName}`;

          // Upload file to Supabase Storage
          const { data: uploadData, error: uploadError } =
            await supabase.storage.from("part-images").upload(filePath, file, {
              cacheControl: "3600",
              upsert: false,
            });

          if (uploadError) {
            console.error("Upload error:", uploadError);

            // Provide more specific error messages for common issues
            let errorMessage = uploadError.message;
            if (uploadError.message.includes("row-level security policy")) {
              errorMessage = `Upload blocked by security policy. Please check your Supabase Storage policies. See DATABASE_SCHEMA_UPDATE.md for setup instructions.`;
            } else if (uploadError.message.includes("bucket")) {
              errorMessage = `Storage bucket 'part-images' not found. Please create it in your Supabase dashboard.`;
            }

            setError(`Failed to upload ${file.name}: ${errorMessage}`);
            continue;
          }

          // Get public URL
          const { data: publicUrlData } = supabase.storage
            .from("part-images")
            .getPublicUrl(filePath);

          if (publicUrlData?.publicUrl) {
            newImageUrls.push(publicUrlData.publicUrl);
          } else {
            setError(`Failed to get public URL for ${file.name}`);
          }
        } catch (err: any) {
          console.error("File processing error:", err);
          setError(`Failed to process ${file.name}: ${err.message}`);
        }
      }

      // Update images array
      const updatedImages = [...images, ...newImageUrls];
      onImagesChange(updatedImages);
    } catch (err: any) {
      setError(`Upload failed: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeImage = async (index: number) => {
    const imageUrl = images[index];

    // If it's a Supabase Storage URL, delete it from storage
    if (imageUrl && imageUrl.includes("supabase")) {
      try {
        // Extract file path from URL
        const urlParts = imageUrl.split("/");
        const fileName = urlParts[urlParts.length - 1];
        const filePath = `parts/${fileName}`;

        const { error: deleteError } = await supabase.storage
          .from("part-images")
          .remove([filePath]);

        if (deleteError) {
          console.error("Error deleting image from storage:", deleteError);
          setError(`Failed to delete image: ${deleteError.message}`);
          return;
        }
      } catch (err: any) {
        console.error("Error processing image deletion:", err);
        setError(`Failed to delete image: ${err.message}`);
        return;
      }
    }

    const updatedImages = images.filter((_, i) => i !== index);
    onImagesChange(updatedImages);

    // Adjust primary image index if needed
    if (onPrimaryImageChange) {
      if (index === primaryImageIndex) {
        onPrimaryImageChange(0);
      } else if (index < primaryImageIndex) {
        onPrimaryImageChange(primaryImageIndex - 1);
      }
    }
  };

  const setPrimaryImage = (index: number) => {
    if (onPrimaryImageChange) {
      onPrimaryImageChange(index);
    }
  };

  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
        Product Images
        <Chip
          label={`${images.length}/${maxImages}`}
          size="small"
          sx={{ ml: 1 }}
          color={images.length === maxImages ? "error" : "default"}
        />
      </Typography>

      {/* Upload Area */}
      {images.length < maxImages && (
        <Box
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          sx={{
            border: `2px dashed ${dragOver ? "#DC143C" : "#e0e0e0"}`,
            borderRadius: 2,
            p: 3,
            textAlign: "center",
            backgroundColor: dragOver
              ? "rgba(220, 20, 60, 0.05)"
              : "transparent",
            cursor: "pointer",
            transition: "all 0.3s ease",
            mb: 2,
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => handleFileSelect(e.target.files)}
          />

          {isUploading ? (
            <Box>
              <CircularProgress sx={{ color: "#DC143C", mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Uploading images...
              </Typography>
            </Box>
          ) : (
            <Box>
              <CloudUpload sx={{ fontSize: 48, color: "#DC143C", mb: 1 }} />
              <Typography variant="body1" sx={{ mb: 1 }}>
                Drag & drop images here or click to browse
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Supports JPG, PNG, WebP up to 5MB each
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <Grid container spacing={2}>
          {images.map((image, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  sx={{
                    position: "relative",
                    border:
                      index === primaryImageIndex
                        ? "2px solid #DC143C"
                        : "1px solid #e0e0e0",
                  }}
                >
                  <CardMedia
                    component="img"
                    height="120"
                    image={image}
                    alt={`Product image ${index + 1}`}
                    sx={{ objectFit: "cover" }}
                  />

                  {/* Primary Image Indicator */}
                  {index === primaryImageIndex && (
                    <Chip
                      label="Primary"
                      size="small"
                      color="error"
                      sx={{
                        position: "absolute",
                        top: 4,
                        left: 4,
                        fontSize: "0.7rem",
                      }}
                    />
                  )}

                  {/* Action Buttons */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      display: "flex",
                      gap: 0.5,
                    }}
                  >
                    {onPrimaryImageChange && (
                      <IconButton
                        size="small"
                        onClick={() => setPrimaryImage(index)}
                        sx={{
                          backgroundColor: "rgba(255,255,255,0.9)",
                          "&:hover": { backgroundColor: "rgba(255,255,255,1)" },
                        }}
                      >
                        {index === primaryImageIndex ? (
                          <Star sx={{ color: "#DC143C", fontSize: 16 }} />
                        ) : (
                          <StarBorder sx={{ fontSize: 16 }} />
                        )}
                      </IconButton>
                    )}

                    <IconButton
                      size="small"
                      onClick={() => removeImage(index)}
                      sx={{
                        backgroundColor: "rgba(255,255,255,0.9)",
                        "&:hover": { backgroundColor: "rgba(255,255,255,1)" },
                      }}
                    >
                      <Delete sx={{ color: "#f44336", fontSize: 16 }} />
                    </IconButton>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Upload Button (Alternative) */}
      {images.length < maxImages && (
        <Button
          variant="outlined"
          startIcon={<ImageIcon />}
          onClick={() => fileInputRef.current?.click()}
          sx={{
            mt: 2,
            borderColor: "#DC143C",
            color: "#DC143C",
            "&:hover": {
              backgroundColor: "rgba(220, 20, 60, 0.1)",
              borderColor: "#B12A37",
            },
          }}
        >
          Add More Images
        </Button>
      )}
    </Box>
  );
};

export default ImageUpload;
