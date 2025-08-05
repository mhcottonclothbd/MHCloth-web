"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Check,
  DollarSign,
  Image as ImageIcon,
  Info,
  Package,
  Palette,
  Settings,
  Tag,
  Warehouse,
} from "lucide-react";
import React from "react";

interface FormTabsProps {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  errors?: Record<string, string>;
  completedSections?: string[];
}

interface TabSectionProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  description?: string;
  children: React.ReactNode;
  errors?: Record<string, string>;
  isCompleted?: boolean;
  isRequired?: boolean;
}

/**
 * Individual tab section component
 */
function TabSection({
  id,
  title,
  icon,
  description,
  children,
  errors = {},
  isCompleted = false,
  isRequired = false,
}: TabSectionProps) {
  const hasErrors = Object.keys(errors).some(key => key.startsWith(id));
  
  return (
    <TabsContent value={id} className="space-y-6 mt-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg",
              hasErrors ? "bg-red-100 text-red-600" : 
              isCompleted ? "bg-green-100 text-green-600" : 
              "bg-muted text-muted-foreground"
            )}>
              {icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                {title}
                {isRequired && <span className="text-red-500">*</span>}
              </h3>
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {hasErrors && (
              <Badge variant="destructive" className="text-xs">
                <AlertCircle className="h-3 w-3 mr-1" />
                Errors
              </Badge>
            )}
            {isCompleted && !hasErrors && (
              <Badge className="bg-green-100 text-green-700 text-xs">
                <Check className="h-3 w-3 mr-1" />
                Complete
              </Badge>
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          {children}
        </div>
      </div>
    </TabsContent>
  );
}

/**
 * Form progress indicator
 */
function FormProgress({ 
  completedSections = [], 
  totalSections = 6,
  errors = {} 
}: { 
  completedSections?: string[];
  totalSections?: number;
  errors?: Record<string, string>;
}) {
  const progress = (completedSections.length / totalSections) * 100;
  const hasErrors = Object.keys(errors).length > 0;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Form Progress: {completedSections.length}/{totalSections} sections
        </span>
        <span className={cn(
          "font-medium",
          hasErrors ? "text-red-600" : 
          progress === 100 ? "text-green-600" : 
          "text-primary"
        )}>
          {Math.round(progress)}%
        </span>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className={cn(
            "h-2 rounded-full transition-all duration-300",
            hasErrors ? "bg-red-500" :
            progress === 100 ? "bg-green-500" :
            "bg-primary"
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
      {hasErrors && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Please fix the errors before saving
        </p>
      )}
    </div>
  );
}

/**
 * Enhanced Form Tabs Component
 * Organizes product form into logical sections with progress tracking
 */
export function FormTabs({
  children,
  activeTab = "basic",
  onTabChange,
  errors = {},
  completedSections = [],
}: FormTabsProps) {
  const tabs = [
    {
      id: "basic",
      label: "Basic Info",
      icon: <Package className="h-4 w-4" />,
      required: true,
    },
    {
      id: "pricing",
      label: "Pricing",
      icon: <DollarSign className="h-4 w-4" />,
      required: true,
    },
    {
      id: "inventory",
      label: "Inventory",
      icon: <Warehouse className="h-4 w-4" />,
      required: true,
    },
    {
      id: "media",
      label: "Media",
      icon: <ImageIcon className="h-4 w-4" />,
      required: false,
    },
    {
      id: "variants",
      label: "Variants",
      icon: <Palette className="h-4 w-4" />,
      required: false,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="h-4 w-4" />,
      required: false,
    },
  ];

  const getTabStatus = (tabId: string) => {
    const hasErrors = Object.keys(errors).some(key => key.startsWith(tabId));
    const isCompleted = completedSections.includes(tabId);
    
    if (hasErrors) return "error";
    if (isCompleted) return "completed";
    return "default";
  };

  return (
    <div className="space-y-6">
      {/* Form Progress */}
      <FormProgress 
        completedSections={completedSections}
        totalSections={tabs.length}
        errors={errors}
      />
      
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        {/* Tab Navigation */}
        <TabsList className="grid w-full grid-cols-6 h-auto p-1">
          {tabs.map((tab) => {
            const status = getTabStatus(tab.id);
            const hasErrors = status === "error";
            const isCompleted = status === "completed";
            
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={cn(
                  "flex flex-col items-center gap-1 p-3 h-auto relative",
                  hasErrors && "text-red-600 data-[state=active]:text-red-600",
                  isCompleted && !hasErrors && "text-green-600 data-[state=active]:text-green-600"
                )}
              >
                <div className="flex items-center gap-1">
                  {tab.icon}
                  {tab.required && <span className="text-red-500 text-xs">*</span>}
                </div>
                <span className="text-xs font-medium">{tab.label}</span>
                
                {/* Status Indicators */}
                {hasErrors && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
                {isCompleted && !hasErrors && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Tab Content */}
        {children}
      </Tabs>
      
      {/* Keyboard Shortcuts Help */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Info className="h-4 w-4" />
            <span>
              <strong>Keyboard shortcuts:</strong> Ctrl+S to save, Esc to cancel, Tab to navigate between fields
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Export individual tab section component for use in forms
 */
export { TabSection };

export default FormTabs;