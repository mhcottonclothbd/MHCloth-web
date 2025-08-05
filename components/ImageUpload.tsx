"use client";

// Note: Backend functionality removed - this is now frontend-only
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Check,
  Image as ImageIcon,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import React, { useCallback, useRef, useState, useEffect } from "react";

interface ImageUploadProps {
  /** Current image URLs */
  images: string[];
  /** Callback when images change */
  onImagesChange: (images: string[]) => void;
  /** Maximum number of images allowed */
  maxImages?: number;
  /** Whether to show image optimization */
  enableOptimization?: boolean;
  /** Custom class name */
  className?: string;
  /** Whether the component is disabled */
  disabled?: boolean;
  /** Allow URL input */
  allowUrlInput?: boolean;
  /** Allow clipboard paste */
  allowClipboardPaste?: boolean;
}

interface UploadState {
  uploading: boolean;
  progress: number;
  error?: string;
  success?: string;
}

/**
 * ImageUpload component with drag-and-drop functionality
 * Handles file selection, upload to Supabase Storage, and image management
 */
const ImageUpload: React.FC<ImageUploadProps> = ({
  images = [],
  onImagesChange,
  maxImages = 5,
  enableOptimization = true,
  className,
  disabled = false,
  allowUrlInput = true,
  allowClipboardPaste = true,
}) => {
  // Ensure images is always an array
  const safeImages = images || [];
  const [uploadState, setUploadState] = useState<UploadState>({
    uploading: false,
    progress: 0,
  });
  const [dragActive, setDragActive] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /**
   * Handles file upload process
   */
  const handleFileUpload = useCallback(
    async (files: FileList | File[]) => {
      if (disabled) return;

      const fileArray = Array.from(files);
      const remainingSlots = maxImages - safeImages.length;

      if (fileArray.length > remainingSlots) {
        setUploadState({
          uploading: false,
          progress: 0,
          error: `Can only upload ${remainingSlots} more image(s). Maximum ${maxImages} images allowed.`,
        });
        return;
      }

      setUploadState({ uploading: true, progress: 0 });

      try {
        const newImageUrls: string[] = [];

        for (let i = 0; i < fileArray.length; i++) {
          const file = fileArray[i];

          // Validate file type
          if (!file.type.startsWith("image/")) {
            throw new Error(`${file.name} is not a valid image file`);
          }

          // Create local URL for frontend-only functionality
          // Note: In a real app, this would upload to a backend service
          const localUrl = URL.createObjectURL(file);
          newImageUrls.push(localUrl);
          
          // Simulate upload delay
          await new Promise(resolve => setTimeout(resolve, 500));

          // Update progress
          const progress = ((i + 1) / fileArray.length) * 100;
          setUploadState((prev) => ({ ...prev, progress }));
        }

        // Update images array
        onImagesChange([...safeImages, ...newImageUrls]);

        setUploadState({
          uploading: false,
          progress: 100,
          success: `Successfully uploaded ${newImageUrls.length} image(s)`,
        });

        // Clear success message after 3 seconds
        setTimeout(() => {
          setUploadState((prev) => ({ ...prev, success: undefined }));
        }, 3000);
      } catch (error) {
        console.error("Upload error:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : typeof error === "string"
            ? error
            : JSON.stringify(error) || "Upload failed";
        setUploadState({
          uploading: false,
          progress: 0,
          error: errorMessage,
        });
      }
    },
    [safeImages, onImagesChange, maxImages, enableOptimization, disabled]
  );

  /**
   * Validates and adds image URL
   */
  const handleUrlAdd = useCallback(
    async (url: string) => {
      if (disabled || !url.trim()) return;

      const remainingSlots = maxImages - safeImages.length;
      if (remainingSlots <= 0) {
        setUploadState({
          uploading: false,
          progress: 0,
          error: `Maximum ${maxImages} images reached.`,
        });
        return;
      }

      setUploadState({ uploading: true, progress: 50 });

      try {
        // Validate URL format
        const urlObj = new URL(url);
        
        // Check if it's an image URL by extension or content-type
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
        const hasImageExtension = imageExtensions.some(ext => 
          urlObj.pathname.toLowerCase().includes(ext)
        );

        if (!hasImageExtension) {
          // Try to fetch and check content-type
          const response = await fetch(url, { method: 'HEAD' });
          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.startsWith('image/')) {
            throw new Error('URL does not point to a valid image');
          }
        }

        // Add URL to images
        onImagesChange([...safeImages, url]);
        setUrlInput("");
        setShowUrlInput(false);

        setUploadState({
          uploading: false,
          progress: 100,
          success: 'Image URL added successfully',
        });

        setTimeout(() => {
          setUploadState((prev) => ({ ...prev, success: undefined }));
        }, 3000);
      } catch (error) {
        console.error('URL validation error:', error);
        setUploadState({
          uploading: false,
          progress: 0,
          error: error instanceof Error ? error.message : 'Invalid image URL',
        });
      }
    },
    [safeImages, onImagesChange, maxImages, disabled]
  );

  /**
   * Handles clipboard paste
   */
  const handlePaste = useCallback(
    async (e: ClipboardEvent) => {
      if (!allowClipboardPaste || disabled) return;

      const items = e.clipboardData?.items;
      if (!items) return;

      const files: File[] = [];
      const urls: string[] = [];

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) files.push(file);
        } else if (item.type === 'text/plain') {
          const text = await new Promise<string>((resolve) => {
            item.getAsString(resolve);
          });
          
          // Check if text is a URL
          try {
            const url = new URL(text.trim());
            if (url.protocol === 'http:' || url.protocol === 'https:') {
              urls.push(text.trim());
            }
          } catch {
            // Not a valid URL, ignore
          }
        }
      }

      if (files.length > 0) {
        handleFileUpload(files);
      } else if (urls.length > 0) {
        for (const url of urls) {
          await handleUrlAdd(url);
        }
      }
    },
    [allowClipboardPaste, disabled, handleFileUpload, handleUrlAdd]
  );

  /**
   * Set up clipboard paste listener
   */
  useEffect(() => {
    if (!allowClipboardPaste || disabled) return;

    const handlePasteEvent = (e: ClipboardEvent) => {
      // Only handle paste if the container is focused or contains the active element
      if (containerRef.current && 
          (containerRef.current.contains(document.activeElement) || 
           document.activeElement === containerRef.current)) {
        handlePaste(e);
      }
    };

    document.addEventListener('paste', handlePasteEvent);
    return () => document.removeEventListener('paste', handlePasteEvent);
  }, [allowClipboardPaste, disabled, handlePaste]);

  /**
   * Handles drag and drop events
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

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFileUpload(e.dataTransfer.files);
      }
    },
    [handleFileUpload]
  );

  /**
   * Handles file input change
   */
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFileUpload(e.target.files);
      }
    },
    [handleFileUpload]
  );

  /**
   * Opens file selection dialog
   */
  const openFileDialog = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled]);

  /**
   * Removes an image from the list
   */
  const removeImage = useCallback(
    (index: number) => {
      if (disabled) return;
      const newImages = safeImages.filter((_, i) => i !== index);
      onImagesChange(newImages);
    },
    [safeImages, onImagesChange, disabled]
  );

  /**
   * Reorders images (moves image to new position)
   */
  const reorderImage = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (disabled) return;
      const newImages = [...safeImages];
      const [movedImage] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, movedImage);
      onImagesChange(newImages);
    },
    [safeImages, onImagesChange, disabled]
  );

  return (
    <div ref={containerRef} className={cn("space-y-4", className)} tabIndex={0}>
      {/* Upload Area */}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 transition-colors",
          dragActive ? "border-emerald-500 bg-emerald-50" : "border-gray-300",
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:border-emerald-400",
          safeImages.length >= maxImages && "opacity-50 cursor-not-allowed"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={safeImages.length < maxImages ? openFileDialog : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled || safeImages.length >= maxImages}
        />

        <div className="text-center">
          {uploadState.uploading ? (
            <div className="space-y-2">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-600" />
              <p className="text-sm text-gray-600">Uploading images...</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadState.progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="mx-auto h-8 w-8 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {safeImages.length >= maxImages
                    ? `Maximum ${maxImages} images reached`
                    : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, WebP up to 5MB ({safeImages.length}/{maxImages})
                  {allowClipboardPaste && " • Paste images from clipboard"}
                </p>
                {allowUrlInput && safeImages.length < maxImages && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowUrlInput(!showUrlInput);
                    }}
                    className="mt-2 text-xs text-emerald-600 hover:text-emerald-700 underline"
                  >
                    Or add image URL
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* URL Input Form */}
      {showUrlInput && allowUrlInput && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="border border-gray-200 rounded-lg p-4 bg-gray-50"
        >
          <div className="space-y-3">
            <div>
              <label htmlFor="image-url" className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <div className="flex space-x-2">
                <input
                  id="image-url"
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleUrlAdd(urlInput);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleUrlAdd(urlInput)}
                  disabled={!urlInput.trim() || uploadState.uploading}
                  className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowUrlInput(false);
                    setUrlInput("");
                  }}
                  className="px-3 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              💡 Paste a direct link to an image (PNG, JPG, WebP)
            </p>
          </div>
        </motion.div>
      )}

      {/* Status Messages */}
      <AnimatePresence>
        {uploadState.error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md"
          >
            <AlertCircle className="h-4 w-4 text-red-600" />
            <p className="text-sm text-red-800">{uploadState.error}</p>
            <button
              onClick={() =>
                setUploadState((prev) => ({ ...prev, error: undefined }))
              }
              className="ml-auto text-red-600 hover:text-red-800"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}

        {uploadState.success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-md"
          >
            <Check className="h-4 w-4 text-green-600" />
            <p className="text-sm text-green-800">{uploadState.success}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Preview Grid */}
      {safeImages.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">
            Product Images ({safeImages.length}/{maxImages})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence>
              {safeImages.map((imageUrl, index) => (
                <motion.div
                  key={imageUrl}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200"
                >
                  {imageUrl && imageUrl.trim() ? (
                    <img
                      src={imageUrl}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgMTMwQzExNi41NjkgMTMwIDEzMCAxMTYuNTY5IDEzMCAxMDBDMTMwIDgzLjQzMTUgMTE2LjU2OSA3MCAxMDAgNzBDODMuNDMxNSA3MCA3MCA4My40MzE1IDcwIDEwMEM3MCAxMTYuNTY5IDgzLjQzMTUgMTMwIDEwMCAxMzBaIiBmaWxsPSIjOUI5QjlCIi8+CjxwYXRoIGQ9Ik0xNzAgMTcwSDMwVjE0MEw2MCA5MEw5MCA5MEwxMjAgMTIwTDE1MCA5MEwxNzAgMTIwVjE3MFoiIGZpbGw9IiM5QjlCOUIiLz4KPC9zdmc+";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}

                  {/* Image Controls */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                      {!disabled && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(index);
                          }}
                          className="p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                          title="Remove image"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Main Image Indicator */}
                  {index === 0 && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-emerald-600 text-white text-xs rounded-full">
                      Main
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {safeImages.length > 1 && (
            <p className="text-xs text-gray-500">
              💡 The first image will be used as the main product image
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
