import React, { useState, useCallback } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardMedia,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  CloudUpload,
  Delete,
  Add,
} from "@mui/icons-material";
import { motion } from "framer-motion";

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  maxSizeKB?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onImagesChange,
  maxImages = 5,
  maxSizeKB = 2048,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (files: FileList) => {
    if (images.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const newImages: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file type
        if (!file.type.startsWith("image/")) {
          setError("Please select only image files");
          continue;
        }

        // Validate file size
        if (file.size > maxSizeKB * 1024) {
          setError(`File size must be less than ${maxSizeKB}KB`);
          continue;
        }

        // Convert to base64 for demo (in real app, upload to cloud storage)
        const base64 = await fileToBase64(file);
        newImages.push(base64);
      }

      onImagesChange([...images, ...newImages]);
    } catch (err) {
      setError("Failed to upload images");
      console.error("Image upload error:", err);
    } finally {
      setIsUploading(false);
    }
  }, [images, maxImages, maxSizeKB, onImagesChange]);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Part Images ({images.length}/{maxImages})
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Upload Area */}
      {images.length < maxImages && (
        <Box
          sx={{
            border: "2px dashed #ccc",
            borderRadius: 2,
            p: 3,
            textAlign: "center",
            mb: 3,
            cursor: "pointer",
            "&:hover": {
              borderColor: "#006620",
              backgroundColor: "#f5f5f5",
            },
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.multiple = true;
            input.accept = "image/*";
            input.onchange = (e) => {
              const files = (e.target as HTMLInputElement).files;
              if (files) {
                handleFileSelect(files);
              }
            };
            input.click();
          }}
        >
          {isUploading ? (
            <Box>
              <CircularProgress sx={{ mb: 2 }} />
              <Typography>Uploading images...</Typography>
            </Box>
          ) : (
            <Box>
              <CloudUpload sx={{ fontSize: 48, color: "#ccc", mb: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                Drop images here or click to select
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Maximum {maxImages} images, up to {maxSizeKB}KB each
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Supports JPG, PNG, GIF formats
              </Typography>
            </Box>
          )}
        </Box>
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
                <Card sx={{ position: "relative" }}>
                  <CardMedia
                    component="img"
                    height={140}
                    image={image}
                    alt={`Part image ${index + 1}`}
                    sx={{ objectFit: "cover" }}
                  />
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      backgroundColor: "rgba(0,0,0,0.7)",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "rgba(0,0,0,0.9)",
                      },
                    }}
                    size="small"
                    onClick={() => removeImage(index)}
                  >
                    <Delete />
                  </IconButton>
                  {index === 0 && (
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 8,
                        left: 8,
                        backgroundColor: "#006620",
                        color: "white",
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: "0.75rem",
                      }}
                    >
                      Primary
                    </Box>
                  )}
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}

      {images.length === 0 && (
        <Alert severity="info">
          No images uploaded yet. Add some images to showcase your part!
        </Alert>
      )}
    </Box>
  );
};

export default ImageUpload;