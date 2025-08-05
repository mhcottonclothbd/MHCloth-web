"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Check, Palette, Plus, X } from "lucide-react";
import React, { useCallback, useState } from "react";

interface ColorOption {
  name: string;
  hex: string;
}

interface ColorPickerProps {
  selectedColors: string[];
  onColorsChange: (colors: string[]) => void;
  disabled?: boolean;
  maxColors?: number;
}

/**
 * Predefined color palette with hex values
 */
const PREDEFINED_COLORS: ColorOption[] = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Red", hex: "#FF0000" },
  { name: "Blue", hex: "#0000FF" },
  { name: "Green", hex: "#008000" },
  { name: "Yellow", hex: "#FFFF00" },
  { name: "Pink", hex: "#FFC0CB" },
  { name: "Purple", hex: "#800080" },
  { name: "Orange", hex: "#FFA500" },
  { name: "Brown", hex: "#A52A2A" },
  { name: "Gray", hex: "#808080" },
  { name: "Navy", hex: "#000080" },
  { name: "Maroon", hex: "#800000" },
  { name: "Teal", hex: "#008080" },
  { name: "Olive", hex: "#808000" },
  { name: "Silver", hex: "#C0C0C0" },
];

/**
 * Validates if a string is a valid hex color
 */
const isValidHexColor = (hex: string): boolean => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
};

/**
 * Gets color name from hex value or returns the hex if not found
 */
const getColorName = (hex: string): string => {
  const predefined = PREDEFINED_COLORS.find(
    (color) => color.hex.toLowerCase() === hex.toLowerCase()
  );
  return predefined ? predefined.name : hex;
};

/**
 * Enhanced Color Picker Component
 * Supports predefined colors, custom hex input, and visual color chips
 */
const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColors,
  onColorsChange,
  disabled = false,
  maxColors = 10,
}) => {
  const [customColor, setCustomColor] = useState("");
  const [customColorName, setCustomColorName] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Toggles a predefined color selection
   */
  const handlePredefinedColorToggle = useCallback(
    (colorOption: ColorOption) => {
      if (disabled) return;

      const colorIdentifier = colorOption.name;
      const isSelected = selectedColors.includes(colorIdentifier);

      if (isSelected) {
        onColorsChange(selectedColors.filter((c) => c !== colorIdentifier));
      } else if (selectedColors.length < maxColors) {
        onColorsChange([...selectedColors, colorIdentifier]);
      } else {
        setError(`Maximum ${maxColors} colors allowed`);
        setTimeout(() => setError(null), 3000);
      }
    },
    [selectedColors, onColorsChange, disabled, maxColors]
  );

  /**
   * Adds a custom color
   */
  const handleAddCustomColor = useCallback(() => {
    if (!customColor || disabled) return;

    if (!isValidHexColor(customColor)) {
      setError("Please enter a valid hex color (e.g., #FF0000)");
      return;
    }

    if (selectedColors.length >= maxColors) {
      setError(`Maximum ${maxColors} colors allowed`);
      return;
    }

    const colorToAdd = customColorName.trim() || customColor;

    if (selectedColors.includes(colorToAdd)) {
      setError("This color is already selected");
      return;
    }

    onColorsChange([...selectedColors, colorToAdd]);
    setCustomColor("");
    setCustomColorName("");
    setShowCustomInput(false);
    setError(null);
  }, [customColor, customColorName, selectedColors, onColorsChange, disabled, maxColors]);

  /**
   * Removes a selected color
   */
  const handleRemoveColor = useCallback(
    (colorToRemove: string) => {
      if (disabled) return;
      onColorsChange(selectedColors.filter((c) => c !== colorToRemove));
    },
    [selectedColors, onColorsChange, disabled]
  );

  /**
   * Gets the hex value for display
   */
  const getDisplayHex = (color: string): string => {
    const predefined = PREDEFINED_COLORS.find((c) => c.name === color);
    return predefined ? predefined.hex : isValidHexColor(color) ? color : "#808080";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Available Colors
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowCustomInput(!showCustomInput)}
          disabled={disabled}
        >
          <Plus className="h-4 w-4 mr-1" />
          Custom Color
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Selected Colors Display */}
      {selectedColors.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Selected Colors ({selectedColors.length}/{maxColors})</Label>
          <div className="flex flex-wrap gap-2">
            {selectedColors.map((color, index) => {
              const displayHex = getDisplayHex(color);
              return (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-2 pr-1 pl-3 py-1"
                >
                  <div
                    className="w-3 h-3 rounded-full border border-gray-300"
                    style={{ backgroundColor: displayHex }}
                  />
                  <span className="text-xs">{getColorName(color)}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-red-100"
                    onClick={() => handleRemoveColor(color)}
                    disabled={disabled}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {/* Custom Color Input */}
      {showCustomInput && (
        <div className="p-4 border border-dashed border-gray-300 rounded-lg space-y-3">
          <Label className="text-sm font-medium">Add Custom Color</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label htmlFor="custom-color" className="text-xs">
                Color Picker
              </Label>
              <input
                id="custom-color"
                type="color"
                value={customColor || "#000000"}
                onChange={(e) => setCustomColor(e.target.value)}
                className="w-full h-10 border border-gray-300 rounded cursor-pointer disabled:cursor-not-allowed"
                disabled={disabled}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="custom-hex" className="text-xs">
                Hex Code
              </Label>
              <Input
                id="custom-hex"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                placeholder="#FF0000"
                className="text-sm"
                disabled={disabled}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="custom-name" className="text-xs">
                Color Name (Optional)
              </Label>
              <Input
                id="custom-name"
                value={customColorName}
                onChange={(e) => setCustomColorName(e.target.value)}
                placeholder="Custom Red"
                className="text-sm"
                disabled={disabled}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              onClick={handleAddCustomColor}
              disabled={!customColor || disabled}
            >
              <Check className="h-4 w-4 mr-1" />
              Add Color
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setShowCustomInput(false);
                setCustomColor("");
                setCustomColorName("");
                setError(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Predefined Colors Grid */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Predefined Colors</Label>
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {PREDEFINED_COLORS.map((colorOption) => {
            const isSelected = selectedColors.includes(colorOption.name);
            return (
              <button
                key={colorOption.name}
                type="button"
                onClick={() => handlePredefinedColorToggle(colorOption)}
                disabled={disabled}
                className={cn(
                  "relative p-2 rounded-lg border-2 transition-all duration-200 group",
                  "hover:scale-105 hover:shadow-md",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300",
                  disabled && "opacity-50 cursor-not-allowed hover:scale-100"
                )}
                title={`${colorOption.name} (${colorOption.hex})`}
              >
                <div
                  className="w-8 h-8 rounded-md border border-gray-300 mx-auto"
                  style={{ backgroundColor: colorOption.hex }}
                />
                <p className="text-xs mt-1 text-center truncate">
                  {colorOption.name}
                </p>
                {isSelected && (
                  <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Help Text */}
      <p className="text-xs text-muted-foreground">
        Select up to {maxColors} colors. You can choose from predefined colors or add custom colors using hex codes.
      </p>
    </div>
  );
};

export default ColorPicker;