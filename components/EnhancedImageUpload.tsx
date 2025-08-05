"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Check,
  Download,
  GripVertical,
  Image as ImageIcon,
  Link,
  Loader2,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

interface ImageItem {
  id: string;
  src: string | File;
  url?: string;
  isUploading?: boolean;
  progress?: number;
  error?: string;
}

interface EnhancedImageUploadProps {
  images: (string | File)[];
  onImagesChange: (images: (string | File)[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

interface UploadState {
  uploading: boolean;
  progress: number;
  error?: string;
  success?: string;
}

/**
 * Validates if a URL is a valid image URL
 */
const isValidImageUrl = (url: string): boolean => {
  try {
    new URL(url);
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
  } catch {
    return false;
  }
};

/**
 * Compresses an image file
 */
const compressImage = (file: File, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new window.Image();
    
    img.onload = () => {
      // Calculate new dimensions (max 1200px width/height)
      const maxSize = 1200;
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        },
        'image/jpeg',
        quality
      );
    };
    
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Enhanced Image Upload Component
 * Supports file upload, URL input, drag reordering, and image optimization
 */
export function EnhancedImageUpload({
  images,
  onImagesChange,
  maxImages = 8,
  disabled = false,
}: EnhancedImageUploadProps) {
  const [uploadState, setUploadState] = useState<UploadState>({
    uploading: false,
    progress: 0,
  });
  const [dragActive, setDragActive] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Handles file upload with compression
   */
  const handleFileUpload = useCallback(
    async (files: FileList | File[]) => {
      if (disabled) return;

      const fileArray = Array.from(files);
      const remainingSlots = maxImages - images.length;

      if (fileArray.length > remainingSlots) {
        setUploadState({
          uploading: false,
          progress: 0,
          error: `You can only upload up to ${maxImages} images`,
        });
        return;
      }

      setUploadState({ uploading: true, progress: 0 });

      try {
        const newImages: (string | File)[] = [];

        for (let i = 0; i < fileArray.length; i++) {
          const file = fileArray[i];

          if (!file.type.startsWith("image/")) {
            throw new Error(`Invalid file type. Only images are allowed`);
          }

          if (file.size > 10 * 1024 * 1024) {
            throw new Error(`File too large. Max size is 10MB`);
          }

          // Compress image if it's larger than 2MB
          let processedFile = file;
          if (file.size > 2 * 1024 * 1024) {
            processedFile = await compressImage(file);
          }

          newImages.push(processedFile);

          const progress = ((i + 1) / fileArray.length) * 100;
          setUploadState((prev) => ({ ...prev, progress }));
        }

        onImagesChange([...images, ...newImages]);

        setUploadState({
          uploading: false,
          progress: 100,
          success: `Successfully added ${newImages.length} image(s)`,
        });

        setTimeout(() => {
          setUploadState((prev) => ({ ...prev, success: undefined }));
        }, 3000);
      } catch (error) {
        console.error("Upload error:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Upload failed";
        setUploadState({
          uploading: false,
          progress: 0,
          error: errorMessage,
        });
      }
    },
    [images, onImagesChange, maxImages, disabled]
  );

  /**
   * Handles URL input for adding images
   */
  const handleAddImageUrl = useCallback(async () => {
    if (!imageUrl.trim() || disabled) return;

    if (!isValidImageUrl(imageUrl)) {
      setUrlError("Please enter a valid image URL (jpg, png, gif, webp, svg)");
      return;
    }

    if (images.length >= maxImages) {
      setUrlError(`Maximum ${maxImages} images allowed`);
      return;
    }

    if (images.includes(imageUrl)) {
      setUrlError("This image URL is already added");
      return;
    }

    try {
      // Test if the URL is accessible
      const response = await fetch(imageUrl, { method: 'HEAD' });
      if (!response.ok) {
        throw new Error('Image URL is not accessible');
      }

      onImagesChange([...images, imageUrl]);
      setImageUrl("");
      setUrlError(null);
    } catch (error) {
      setUrlError("Failed to load image from URL. Please check the URL.");
    }
  }, [imageUrl, images, onImagesChange, maxImages, disabled]);

  /**
   * Handles drag events
   */
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  /**
   * Handles drop event
   */
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileUpload(e.dataTransfer.files);
      }
    },
    [handleFileUpload]
  );

  /**
   * Handles file input change
   */
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (e.target.files && e.target.files[0]) {
        handleFileUpload(e.target.files);
      }
    },
    [handleFileUpload]
  );

  /**
   * Removes an image from the list
   */
  const removeImage = useCallback(
    (index: number) => {
      const newImages = images.filter((_, i) => i !== index);
      onImagesChange(newImages);
    },
    [images, onImagesChange]
  );

  /**
   * Handles drag start for reordering
   */
  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index);
  }, []);

  /**
   * Handles drag over for reordering
   */
  const handleDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      if (draggedIndex === null || draggedIndex === index) return;

      const newImages = [...images];
      const draggedImage = newImages[draggedIndex];
      newImages.splice(draggedIndex, 1);
      newImages.splice(index, 0, draggedImage);
      
      onImagesChange(newImages);
      setDraggedIndex(index);
    },
    [draggedIndex, images, onImagesChange]
  );

  /**
   * Handles drag end for reordering
   */
  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
  }, []);

  const getImageSrc = (image: string | File) => {
    if (typeof image === "string") {
      return image;
    }
    return URL.createObjectURL(image);
  };

  /**
   * Opens file dialog
   */
  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="space-y-4">
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            File Upload
          </TabsTrigger>
          <TabsTrigger value="url" className="flex items-center gap-2">
            <Link className="h-4 w-4" />
            URL Input
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          {/* File Upload Area */}
          <div
            className={cn(
              "relative border-2 border-dashed rounded-lg p-6 transition-colors",
              dragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-muted-foreground/50",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleChange}
              className="hidden"
              disabled={disabled}
            />

            <div className="text-center">
              {uploadState.uploading ? (
                <div className="space-y-2">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Uploading and optimizing... {Math.round(uploadState.progress)}%
                  </p>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadState.progress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">
                      Drag & drop images here, or{" "}
                      <button
                        type="button"
                        onClick={openFileDialog}
                        className="text-primary hover:underline"
                        disabled={disabled}
                      >
                        browse
                      </button>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG, WebP, GIF, SVG up to 10MB each (max {maxImages} images)
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Images larger than 2MB will be automatically optimized
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="url" className="space-y-4">
          {/* URL Input */}
          <div className="space-y-3">
            <Label htmlFor="image-url">Image URL</Label>
            <div className="flex gap-2">
              <Input
                id="image-url"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setUrlError(null);
                }}
                placeholder="https://example.com/image.jpg"
                disabled={disabled}
                className={urlError ? "border-red-500" : ""}
              />
              <Button
                type="button"
                onClick={handleAddImageUrl}
                disabled={!imageUrl.trim() || disabled || images.length >= maxImages}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            {urlError && (
              <p className="text-sm text-red-600">{urlError}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Supported formats: JPG, PNG, WebP, GIF, SVG
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Error/Success Messages */}
      {uploadState.error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <p className="text-sm text-red-700">{uploadState.error}</p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              setUploadState((prev) => ({ ...prev, error: undefined }))
            }
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {uploadState.success && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <Check className="h-4 w-4 text-green-600" />
          <p className="text-sm text-green-700">{uploadState.success}</p>
        </div>
      )}

      {/* Image Preview Grid with Drag Reordering */}
      {images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">
              Images ({images.length}/{maxImages})
            </Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onImagesChange([])}
                disabled={disabled}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative group cursor-move"
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
              >
                <div className="aspect-square rounded-lg overflow-hidden border border-muted bg-muted">
                  <Image
                    src={getImageSrc(image)}
                    alt={`Product image ${index + 1}`}
                    fill
                    className="object-cover"
                    onLoad={(e) => {
                      if (typeof image !== "string") {
                        URL.revokeObjectURL(e.currentTarget.src);
                      }
                    }}
                  />
                </div>

                {/* Primary Badge */}
                {index === 0 && (
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-primary text-primary-foreground text-xs">
                      Primary
                    </Badge>
                  </div>
                )}

                {/* Drag Handle */}
                <div className="absolute top-2 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-black/50 text-white rounded p-1">
                    <GripVertical className="h-3 w-3" />
                  </div>
                </div>

                {/* Remove Button */}
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>

                {/* Image Index */}
                <div className="absolute bottom-2 left-2">
                  <Badge variant="secondary" className="text-xs">
                    {index + 1}
                  </Badge>
                </div>
              </div>
            ))}

            {/* Add More Button */}
            {images.length < maxImages && (
              <button
                type="button"
                onClick={openFileDialog}
                className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 flex items-center justify-center transition-colors"
                disabled={disabled}
              >
                <div className="text-center">
                  <Plus className="h-6 w-6 mx-auto text-muted-foreground mb-1" />
                  <p className="text-xs text-muted-foreground">Add More</p>
                </div>
              </button>
            )}
          </div>

          {/* Help Text */}
          <p className="text-xs text-muted-foreground">
            Drag images to reorder them. The first image will be used as the primary product image.
          </p>
        </div>
      )}
    </div>
  );
}

export default EnhancedImageUpload;