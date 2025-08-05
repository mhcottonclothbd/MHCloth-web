"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Product, Subcategory } from "@/types";
import { 
  getSubcategoriesForCategory, 
  getSubcategoryById,
  getSubcategoriesByMainCategory 
} from "@/data/subcategories";
import { 
  mensCategories, 
  womensCategories, 
  kidsCategories 
} from "@/data/categories";
import BulkOperations from "@/components/BulkOperations";
import ColorPicker from "@/components/ColorPicker";
import EnhancedImageUpload from "@/components/EnhancedImageUpload";
import FormTabs, { TabSection } from "@/components/FormTabs";
import {
  AlertTriangle,
  Check,
  Download,
  Edit,
  Eye,
  Grid3X3,
  Image as ImageIcon,
  List,
  Loader2,
  Plus,
  Save,
  Search,
  Star,
  Tag,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface ProductFormProps {
  product?: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (product: Partial<Product>) => Promise<void>;
}

interface FormErrors {
  name?: string;
  sku?: string;
  price?: string;
  images?: string;
  stock_quantity?: string;
}

interface UploadState {
  uploading: boolean;
  progress: number;
  error?: string;
  success?: string;
}

/**
 * Enhanced ImageUpload component for product images
 */
function ProductImageUpload({
  images,
  onImagesChange,
  maxImages = 5,
  disabled = false,
}: {
  images: (string | File)[];
  onImagesChange: (images: (string | File)[]) => void;
  maxImages?: number;
  disabled?: boolean;
}) {
  const [uploadState, setUploadState] = useState<UploadState>({
    uploading: false,
    progress: 0,
  });
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

          if (file.size > 5 * 1024 * 1024) {
            throw new Error(`File too large. Max size is 5MB`);
          }

          newImages.push(file);

          await new Promise((resolve) => setTimeout(resolve, 100));

          const progress = ((i + 1) / fileArray.length) * 100;
          setUploadState((prev: UploadState) => ({ ...prev, progress }));
        }

        onImagesChange([...images, ...newImages]);

        setUploadState({
          uploading: false,
          progress: 100,
          success: `Successfully added ${newImages.length} image(s)`,
        });

        setTimeout(() => {
          setUploadState((prev: UploadState) => ({
            ...prev,
            success: undefined,
          }));
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
      {/* Upload Area */}
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
                Uploading... {Math.round(uploadState.progress)}%
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
                  JPG, PNG, WebP, GIF up to 5MB each (max {maxImages} images)
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

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

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border border-muted">
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
      )}
    </div>
  );
}

/**
 * Enhanced Product form component for adding/editing products
 */
function ProductForm({
  product,
  open,
  onOpenChange,
  onSave,
}: ProductFormProps) {
  const [formData, setFormData] = useState<Partial<Product>>(() => ({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    original_price: product?.original_price || 0,
    category: product?.category || "mens",
    subcategory_id: product?.subcategory_id || "",
    sku: product?.sku || "",
    stock_quantity: product?.stock_quantity || 0,
    low_stock_threshold: product?.low_stock_threshold || 5,
    brand: product?.brand || "MHCloth",
    status: product?.status || "active",
    is_featured: product?.is_featured || false,
    is_on_sale: product?.is_on_sale || false,
    sizes: product?.sizes || [],
    colors: product?.colors || [],
    tags: product?.tags || [],
    images: product?.image_urls || [],
  }));

  // State for managing active tab and hiding details
  const [activeTab, setActiveTab] = useState("details");

  // Available categories and subcategories based on main category
  const availableCategories = useMemo(() => {
    switch (formData.category) {
      case "mens":
        return mensCategories;
      case "womens":
        return womensCategories;
      case "kids":
        return kidsCategories;
      default:
        return mensCategories;
    }
  }, [formData.category]);

  const availableSubcategories = useMemo(() => {
    if (!formData.category) return [];
    return getSubcategoriesByMainCategory(formData.category as 'mens' | 'womens' | 'kids');
  }, [formData.category]);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when product changes
  useEffect(() => {
    setFormData({
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || 0,
      original_price: product?.original_price || 0,
      category: product?.category || "mens",
      subcategory_id: product?.subcategory_id || "",
      sku: product?.sku || "",
      stock_quantity: product?.stock_quantity || 0,
      low_stock_threshold: product?.low_stock_threshold || 5,
      brand: product?.brand || "MHCloth",
      status: product?.status || "active",
      is_featured: product?.is_featured || false,
      is_on_sale: product?.is_on_sale || false,
      sizes: product?.sizes || [],
      colors: product?.colors || [],
      tags: product?.tags || [],
      images: product?.image_urls || [],
    });
    setErrors({});
  }, [product]);

  /**
   * Validates form data
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.sku?.trim()) {
      newErrors.sku = "SKU is required";
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (!formData.images || formData.images.length === 0) {
      newErrors.images = "At least one product image is required";
    }

    if (!formData.stock_quantity || formData.stock_quantity < 0) {
      newErrors.stock_quantity = "Stock quantity must be 0 or greater";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSave(formData);
      onOpenChange(false);

      // Reset form for new products
      if (!product) {
        setFormData({
          name: "",
          description: "",
          price: 0,
          original_price: 0,
          category: "mens",
          subcategory_id: "",
          sku: "",
          stock_quantity: 0,
          low_stock_threshold: 5,
          brand: "MHCloth",
          status: "active",
          is_featured: false,
          is_on_sale: false,
          sizes: [],
          colors: [],
          tags: [],
          images: [],
        });
      }
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSizeToggle = (size: string) => {
    setFormData((prev: Partial<Product>) => ({
      ...prev,
      sizes: prev.sizes?.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...(prev.sizes || []), size],
    }));
  };

  const handleColorToggle = (color: string) => {
    setFormData((prev: Partial<Product>) => ({
      ...prev,
      colors: prev.colors?.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...(prev.colors || []), color],
    }));
  };

  /**
   * Handles color selection from the ColorPicker component
   */
  const handleColorsChange = (selectedColors: string[]) => {
    setFormData((prev: Partial<Product>) => ({
      ...prev,
      colors: selectedColors,
    }));
  };

  /**
   * Calculates discount percentage
   */
  const discountPercentage = useMemo(() => {
    if (
      formData.original_price &&
      formData.price &&
      formData.original_price > formData.price
    ) {
      return Math.round(
        ((formData.original_price - formData.price) / formData.original_price) *
          100
      );
    }
    return 0;
  }, [formData.original_price, formData.price]);

  // Check if current tab should hide details
  const shouldHideDetails = ["images", "pricing", "inventory", "variants"].includes(activeTab);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? "Edit Product" : "Add New Product"}
          </DialogTitle>
          <DialogDescription>
            {product
              ? "Update the details of this product."
              : "Fill in the details to create a new product."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Product Details Section - Hidden when advanced tabs are active */}
          {!shouldHideDetails && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Enter product name"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">{errors.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU *</Label>
                  <Input
                    id="sku"
                    value={formData.sku || ""}
                    onChange={(e) =>
                      setFormData((prev: Partial<Product>) => ({
                        ...prev,
                        sku: e.target.value,
                      }))
                    }
                    placeholder="Product SKU"
                    className={errors.sku ? "border-red-500" : ""}
                  />
                  {errors.sku && (
                    <p className="text-sm text-red-600">{errors.sku}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Product description"
                  rows={3}
                />
              </div>

              {/* Category and Brand Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => {
                      setFormData((prev) => ({ ...prev, category: value, subcategory_id: "" }))
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mens">Men's Clothing</SelectItem>
                      <SelectItem value="womens">Women's Clothing</SelectItem>
                      <SelectItem value="kids">Kids Clothing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <Select
                    value={formData.subcategory_id || ""}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, subcategory_id: value }))
                    }
                    disabled={!formData.category}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSubcategories.map((subcategory) => (
                        <SelectItem key={subcategory.id} value={subcategory.id}>
                          {subcategory.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    value={formData.brand || ""}
                    onChange={(e) =>
                      setFormData((prev: Partial<Product>) => ({
                        ...prev,
                        brand: e.target.value,
                      }))
                    }
                    placeholder="Brand name"
                  />
                </div>
              </div>

              {/* Status and Price Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: "active" | "draft" | "archived") =>
                      setFormData((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Regular Price (৳) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        price: Number(e.target.value),
                      }))
                    }
                    placeholder="0"
                    className={errors.price ? "border-red-500" : ""}
                    required
                  />
                  {errors.price && (
                    <p className="text-sm text-red-600">{errors.price}</p>
                  )}
                </div>
              </div>

              {/* Feature Toggles */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        is_featured: checked as boolean,
                      }))
                    }
                  />
                  <Label htmlFor="featured" className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    Featured Product
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="on-sale"
                    checked={formData.is_on_sale}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        is_on_sale: checked as boolean,
                      }))
                    }
                  />
                  <Label htmlFor="on-sale" className="flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    On Sale
                  </Label>
                </div>
              </div>
            </div>
          )}

          {/* Tabs Section */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="grid grid-cols-2 sm:grid-cols-5 mb-4 h-auto">
              <TabsTrigger value="details" className="text-xs sm:text-sm">Details</TabsTrigger>
              <TabsTrigger value="images" className="text-xs sm:text-sm">Images</TabsTrigger>
              <TabsTrigger value="pricing" className="text-xs sm:text-sm">Pricing</TabsTrigger>
              <TabsTrigger value="inventory" className="text-xs sm:text-sm">Inventory</TabsTrigger>
              <TabsTrigger value="variants" className="text-xs sm:text-sm">Variants</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              {/* Details content is already rendered above */}
            </TabsContent>

            <TabsContent value="images" className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-medium flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Product Images *
                </Label>
                <p className="text-sm text-muted-foreground">
                  Upload high-quality images of your product. The first image
                  will be used as the primary image.
                </p>
              </div>

              <ProductImageUpload
                images={formData.images || []}
                onImagesChange={(images) =>
                  setFormData((prev) => ({ ...prev, images }))
                }
                maxImages={5}
                disabled={isSubmitting}
              />

              {errors.images && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <p className="text-sm text-red-700">{errors.images}</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="pricing" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Regular Price (৳) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        price: Number(e.target.value),
                      }))
                    }
                    placeholder="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="original_price">Original Price (৳)</Label>
                  <Input
                    id="original_price"
                    type="number"
                    value={formData.original_price}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        original_price: Number(e.target.value),
                      }))
                    }
                    placeholder="0"
                  />
                </div>
              </div>

              {formData.original_price &&
                formData.price &&
                formData.original_price > formData.price && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Discount:{" "}
                      {Math.round(
                        ((formData.original_price - formData.price) /
                          formData.original_price) *
                          100
                      )}
                      %
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Savings: ৳
                      {(
                        formData.original_price - formData.price
                      ).toLocaleString()}
                    </p>
                  </div>
                )}
            </TabsContent>

            <TabsContent value="inventory" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stock_quantity">Stock Quantity *</Label>
                  <Input
                    id="stock_quantity"
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        stock_quantity: Number(e.target.value),
                      }))
                    }
                    placeholder="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="low_stock_threshold">Low Stock Alert</Label>
                  <Input
                    id="low_stock_threshold"
                    type="number"
                    value={formData.low_stock_threshold}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        low_stock_threshold: Number(e.target.value),
                      }))
                    }
                    placeholder="5"
                  />
                </div>
              </div>

              {formData.stock_quantity !== undefined &&
                formData.low_stock_threshold !== undefined &&
                formData.stock_quantity <= formData.low_stock_threshold && (
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        Low stock warning: Current stock is at or below the
                        threshold
                      </p>
                    </div>
                  </div>
                )}
            </TabsContent>

            <TabsContent value="variants" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">
                    Available Sizes
                  </Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {[
                      "XS",
                      "S",
                      "M",
                      "L",
                      "XL",
                      "XXL",
                      "28",
                      "30",
                      "32",
                      "34",
                      "36",
                      "2-3Y",
                      "4-5Y",
                      "6-7Y",
                      "8-9Y",
                    ].map((size) => (
                      <Button
                        key={size}
                        type="button"
                        variant={
                          formData.sizes?.includes(size) ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handleSizeToggle(size)}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">
                    Available Colors
                  </Label>
                  <ColorPicker
                    selectedColors={formData.colors || []}
                    onColorsChange={handleColorsChange}
                    maxColors={10}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              {product ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Gets status badge color based on product status
 */
function getStatusColor(status: string) {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "draft":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "archived":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
}

/**
 * Product Management component with catalog, forms, and inventory tracking
 */
export function ProductManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );

  useEffect(() => {
    const loadCategories = async () => {
      try {
        // Load categories from mock data
        const { mensCategories, womensCategories, kidsCategories } = await import('@/data/categories');
        const allCategories = [
          ...mensCategories.map(cat => ({ id: cat.id, name: cat.name })),
          ...womensCategories.map(cat => ({ id: cat.id, name: cat.name })),
          ...kidsCategories.map(cat => ({ id: cat.id, name: cat.name }))
        ];
        setCategories(allCategories);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };

    loadCategories();
  }, []);

  // Reset form when product changes
  /**
   * Load products from mock data
   */
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      const { mockProducts } = await import('@/lib/mock-data/products');
      setProducts(mockProducts);
    } catch (err) {
      console.error("Error loading products:", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load categories from mock data
   */
  const loadCategoriesData = async () => {
    try {
      const { mensCategories, womensCategories, kidsCategories } = await import('@/data/categories');
      const allCategories = [
        ...mensCategories.map(cat => ({ id: cat.id, name: cat.name })),
        ...womensCategories.map(cat => ({ id: cat.id, name: cat.name })),
        ...kidsCategories.map(cat => ({ id: cat.id, name: cat.name }))
      ];
      setCategories(allCategories);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadProducts();
    loadCategoriesData();
  }, []);

  /**
   * Filtered products based on search and filter criteria
   */
  const filteredProducts = useMemo(() => {
    return products.filter((product: Product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || product.category === categoryFilter;
      const matchesStatus =
        statusFilter === "all" || product.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [searchTerm, categoryFilter, statusFilter]);

  /**
   * Handles product selection for bulk operations
   */
  const handleProductSelect = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts((prev: string[]) => [...prev, productId]);
    } else {
      setSelectedProducts((prev: string[]) =>
        prev.filter((id) => id !== productId)
      );
    }
  };

  /**
   * Handles select all products
   */
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(
        filteredProducts.map((product: Product) => product.id)
      );
    } else {
      setSelectedProducts([]);
    }
  };

  /**
   * Opens product form for editing
   */
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  /**
   * Opens product form for adding new product
   */
  const handleAddProduct = () => {
    setEditingProduct(undefined);
    setShowProductForm(true);
  };

  /**
   * Handles product save (add/update)
   */
  const handleSaveProduct = async (
    productData: Partial<Product>
  ): Promise<void> => {
    try {
      const formData = new FormData();

      // Add product data to FormData
      formData.append("name", productData.name || "");
      formData.append("description", productData.description || "");
      formData.append("price", String(productData.price || 0));
      formData.append(
        "original_price",
        String(productData.original_price || 0)
      );
      formData.append("category_id", productData.category || "mens");
      formData.append("sku", productData.sku || "");
      formData.append(
        "stock_quantity",
        String(productData.stock_quantity || 0)
      );
      formData.append(
        "low_stock_threshold",
        String(productData.low_stock_threshold || 5)
      );
      formData.append("brand", productData.brand || "MHCloth");
      formData.append("is_active", String(productData.status === "active"));
      formData.append("is_featured", String(productData.is_featured || false));
      formData.append("is_on_sale", String(productData.is_on_sale || false));

      // Add images if any
      if (productData.images && productData.images.length > 0) {
        productData.images.forEach((image, index) => {
          // Check if image is a File object by testing for File properties
          if (
            typeof image !== "string" &&
            "name" in image &&
            "type" in image &&
            "size" in image
          ) {
            formData.append("images", image as unknown as File);
          } else if (
            typeof image === "string" &&
            !image.startsWith("data:") &&
            !image.startsWith("http")
          ) {
            // For local blob URLs or file paths that need to be converted to files
            // In a real implementation, you would need to fetch the blob and convert it
            console.log("Local image URL detected:", image);
          } else if (typeof image === "string") {
            // For remote URLs or data URLs, you might want to store them directly
            formData.append("image_urls", image);
          }
        });
      }

      const url = editingProduct
        ? `/api/admin/products/${editingProduct.id}`
        : "/api/admin/products";

      const method = editingProduct ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save product");
      }

      const result = await response.json();
      console.log("Product saved successfully:", result);

      // Refresh products list
      await loadProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      throw error;
    }
  };

  /**
   * Gets stock status indicator
   */
  const getStockStatus = (product: Product) => {
    if (product.stock_quantity === 0) {
      return {
        label: "Out of Stock",
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      };
    } else if (
      product.stock_quantity &&
      product.low_stock_threshold &&
      product.stock_quantity <= product.low_stock_threshold
    ) {
      return {
        label: "Low Stock",
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      };
    } else {
      return {
        label: "In Stock",
        color:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Product Management
          </h1>
          <p className="text-muted-foreground">
            Manage your product catalog and inventory
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleAddProduct}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products, SKU, or brand..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="mens">Men's</SelectItem>
                <SelectItem value="womens">Women's</SelectItem>
                <SelectItem value="kids">Kids</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-1 border rounded-md">
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {selectedProducts.length} product(s) selected
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  Update Status
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Selected
                </Button>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products Display */}
      <Card>
        <CardHeader>
          <CardTitle>Products ({filteredProducts.length})</CardTitle>
          <CardDescription>
            Complete product catalog with inventory status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {viewMode === "list" ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        selectedProducts.length === filteredProducts.length &&
                        filteredProducts.length > 0
                      }
                      onCheckedChange={(checked: boolean) =>
                        handleSelectAll(checked)
                      }
                    />
                  </TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product);
                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedProducts.includes(product.id)}
                          onCheckedChange={(checked: boolean) =>
                            handleProductSelect(product.id, checked)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              SKU: {product.sku}
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                              {product.is_featured && (
                                <Badge variant="secondary" className="text-xs">
                                  <Star className="h-3 w-3 mr-1" />
                                  Featured
                                </Badge>
                              )}
                              {product.is_on_sale && (
                                <Badge variant="secondary" className="text-xs">
                                  <Tag className="h-3 w-3 mr-1" />
                                  Sale
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {product.category === "mens"
                            ? "Men's"
                            : product.category === "womens"
                            ? "Women's"
                            : "Kids"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            ৳{product.price.toLocaleString()}
                          </p>
                          {product.original_price &&
                            product.original_price > product.price && (
                              <p className="text-sm text-muted-foreground line-through">
                                ৳{product.original_price.toLocaleString()}
                              </p>
                            )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {product.stock_quantity}
                          </p>
                          <Badge className={cn("text-xs", stockStatus.color)}>
                            {stockStatus.label}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getStatusColor(product.status || "active")}
                        >
                          {product.status?.charAt(0).toUpperCase() +
                            (product.status?.slice(1) || "")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product);
                return (
                  <Card key={product.id} className="overflow-hidden">
                    <div className="aspect-square bg-muted flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className="font-medium text-sm leading-tight">
                            {product.name}
                          </h3>
                          <Checkbox
                            checked={selectedProducts.includes(product.id)}
                            onCheckedChange={(checked: boolean) =>
                              handleProductSelect(product.id, checked)
                            }
                          />
                        </div>

                        <p className="text-xs text-muted-foreground">
                          SKU: {product.sku}
                        </p>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">
                              ৳{product.price.toLocaleString()}
                            </p>
                            {product.original_price &&
                              product.original_price > product.price && (
                                <p className="text-xs text-muted-foreground line-through">
                                  ৳{product.original_price.toLocaleString()}
                                </p>
                              )}
                          </div>
                          <Badge className={cn("text-xs", stockStatus.color)}>
                            {stockStatus.label}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <Badge
                            className={getStatusColor(
                              product.status || "active"
                            )}
                          >
                            {product.status?.charAt(0).toUpperCase() +
                              (product.status?.slice(1) || "")}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEditProduct(product)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {product.is_featured && (
                            <Badge variant="secondary" className="text-xs">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                          {product.is_on_sale && (
                            <Badge variant="secondary" className="text-xs">
                              <Tag className="h-3 w-3 mr-1" />
                              Sale
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Product Form Modal */}
      <ProductForm
        product={editingProduct}
        open={showProductForm}
        onOpenChange={setShowProductForm}
        onSave={handleSaveProduct}
      />
    </div>
  );
}

/**
 * Handles select all products
 */