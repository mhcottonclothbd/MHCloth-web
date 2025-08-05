import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Package } from "lucide-react";
import ColorPicker from "@/components/ColorPicker";

interface Variant {
  id: string;
  size?: string;
  color?: string;
  material?: string;
  stock: number;
  sku?: string;
  price?: number;
}

interface VariantManagerProps {
  /**
   * Current variants
   */
  variants: Variant[];
  /**
   * Callback when variants change
   */
  onVariantsChange: (variants: Variant[]) => void;
  /**
   * Available sizes for the category
   */
  availableSizes?: string[];
  /**
   * Base product SKU for generating variant SKUs
   */
  baseSku?: string;
  /**
   * Base product price
   */
  basePrice?: number;
  /**
   * Whether the component is disabled
   */
  disabled?: boolean;
  /**
   * Custom className
   */
  className?: string;
}

/**
 * Reusable component for managing product variants
 * Supports sizes, colors, materials, and stock quantities
 * @param variants - Current variants array
 * @param onVariantsChange - Callback for variant updates
 * @param availableSizes - Sizes available for selection
 * @param baseSku - Base SKU for generating variant SKUs
 * @param basePrice - Base price for variants
 * @param disabled - Disable the component
 * @param className - Custom styling
 */
const VariantManager: React.FC<VariantManagerProps> = ({
  variants,
  onVariantsChange,
  availableSizes = [],
  baseSku = "",
  basePrice = 0,
  disabled = false,
  className = ""
}) => {
  const [newVariant, setNewVariant] = useState<Partial<Variant>>({
    size: "",
    color: "#000000",
    material: "",
    stock: 0,
    price: basePrice
  });
  const [showAddForm, setShowAddForm] = useState(false);

  /**
   * Generates a unique SKU for a variant
   */
  const generateVariantSku = (variant: Partial<Variant>): string => {
    const parts = [baseSku];
    if (variant.size) parts.push(variant.size);
    if (variant.color) {
      // Convert hex color to short code
      const colorCode = variant.color.replace('#', '').substring(0, 3).toUpperCase();
      parts.push(colorCode);
    }
    if (variant.material) parts.push(variant.material.substring(0, 3).toUpperCase());
    return parts.filter(Boolean).join('-');
  };

  /**
   * Adds a new variant
   */
  const addVariant = () => {
    if (!newVariant.size && !newVariant.color && !newVariant.material) {
      return; // At least one attribute must be specified
    }

    const variant: Variant = {
      id: Date.now().toString(),
      size: newVariant.size || undefined,
      color: newVariant.color || undefined,
      material: newVariant.material || undefined,
      stock: newVariant.stock || 0,
      sku: generateVariantSku(newVariant),
      price: newVariant.price || basePrice
    };

    onVariantsChange([...variants, variant]);
    setNewVariant({
      size: "",
      color: "#000000",
      material: "",
      stock: 0,
      price: basePrice
    });
    setShowAddForm(false);
  };

  /**
   * Removes a variant
   */
  const removeVariant = (id: string) => {
    onVariantsChange(variants.filter(v => v.id !== id));
  };

  /**
   * Updates a variant field
   */
  const updateVariant = (id: string, field: keyof Variant, value: any) => {
    const updatedVariants = variants.map(variant => {
      if (variant.id === id) {
        const updated = { ...variant, [field]: value };
        // Regenerate SKU if attributes change
        if (field === 'size' || field === 'color' || field === 'material') {
          updated.sku = generateVariantSku(updated);
        }
        return updated;
      }
      return variant;
    });
    onVariantsChange(updatedVariants);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Product Variants</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowAddForm(!showAddForm)}
          disabled={disabled}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Variant
        </Button>
      </div>

      {/* Add Variant Form */}
      {showAddForm && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-4">
          <h4 className="font-medium text-sm">Add New Variant</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Size Selection */}
            {availableSizes.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm">Size</Label>
                <select
                  value={newVariant.size || ""}
                  onChange={(e) => setNewVariant(prev => ({ ...prev, size: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select size</option>
                  {availableSizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Color Selection */}
            <div className="space-y-2">
              <Label className="text-sm">Color</Label>
              <ColorPicker
                selectedColors={newVariant.color ? [newVariant.color] : []}
                onColorsChange={(colors) => setNewVariant(prev => ({ ...prev, color: colors[0] || "" }))}
                maxColors={1}
              />
            </div>

            {/* Material Input */}
            <div className="space-y-2">
              <Label className="text-sm">Material</Label>
              <Input
                type="text"
                value={newVariant.material || ""}
                onChange={(e) => setNewVariant(prev => ({ ...prev, material: e.target.value }))}
                placeholder="e.g., Cotton, Polyester"
                className="text-sm"
              />
            </div>

            {/* Stock Quantity */}
            <div className="space-y-2">
              <Label className="text-sm">Stock</Label>
              <Input
                type="number"
                min="0"
                value={newVariant.stock || 0}
                onChange={(e) => setNewVariant(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                className="text-sm"
              />
            </div>
          </div>

          {/* Price Override */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm">Price Override (optional)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={newVariant.price || basePrice}
                onChange={(e) => setNewVariant(prev => ({ ...prev, price: parseFloat(e.target.value) || basePrice }))}
                placeholder={`Default: $${basePrice}`}
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Generated SKU</Label>
              <Input
                type="text"
                value={generateVariantSku(newVariant)}
                readOnly
                className="text-sm bg-gray-100"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setShowAddForm(false);
                setNewVariant({
                  size: "",
                  color: "#000000",
                  material: "",
                  stock: 0,
                  price: basePrice
                });
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={addVariant}
              disabled={!newVariant.size && !newVariant.color && !newVariant.material}
            >
              Add Variant
            </Button>
          </div>
        </div>
      )}

      {/* Existing Variants */}
      {variants.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">
            Current Variants ({variants.length})
          </h4>
          <div className="space-y-2">
            {variants.map((variant) => (
              <div
                key={variant.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-white"
              >
                <div className="flex items-center gap-3">
                  <Package className="h-4 w-4 text-gray-400" />
                  <div className="flex flex-wrap gap-2">
                    {variant.size && (
                      <Badge variant="outline" className="text-xs">
                        Size: {variant.size}
                      </Badge>
                    )}
                    {variant.color && (
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        <span
                          className="w-3 h-3 rounded-full border border-gray-300"
                          style={{ backgroundColor: variant.color }}
                        />
                        {variant.color}
                      </Badge>
                    )}
                    {variant.material && (
                      <Badge variant="outline" className="text-xs">
                        {variant.material}
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    Stock: {variant.stock} • SKU: {variant.sku}
                    {variant.price !== basePrice && (
                      <span className="ml-2 text-emerald-600 font-medium">
                        ${variant.price}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    value={variant.stock}
                    onChange={(e) => updateVariant(variant.id, 'stock', parseInt(e.target.value) || 0)}
                    className="w-20 text-sm"
                    disabled={disabled}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeVariant(variant.id)}
                    disabled={disabled}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {variants.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Package className="mx-auto h-8 w-8 mb-2 opacity-50" />
          <p className="text-sm">No variants added yet</p>
          <p className="text-xs">Add variants to manage different sizes, colors, and materials</p>
        </div>
      )}
    </div>
  );
};

export default VariantManager;