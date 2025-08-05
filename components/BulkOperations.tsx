"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Product } from "@/types";
import {
  AlertTriangle,
  Check,
  Copy,
  Download,
  FileText,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import React, { useCallback, useRef, useState } from "react";

interface BulkOperationsProps {
  products: Product[];
  onProductsImport: (products: Partial<Product>[]) => Promise<void>;
  onProductDuplicate: (productId: string, modifications?: Partial<Product>) => Promise<void>;
  disabled?: boolean;
}

interface ImportState {
  importing: boolean;
  progress: number;
  error?: string;
  success?: string;
  preview?: Partial<Product>[];
}

interface ExportState {
  exporting: boolean;
  error?: string;
  success?: string;
}

interface DuplicateState {
  duplicating: boolean;
  error?: string;
  success?: string;
}

/**
 * Converts products to CSV format
 */
const convertToCSV = (products: Product[]): string => {
  const headers = [
    'name',
    'description',
    'price',
    'sku',
    'stock_quantity',
    'low_stock_threshold',
    'category',
    'brand',
    'status',
    'is_featured',
    'is_on_sale',
    'sizes',
    'colors',
    'image_urls'
  ];

  const csvContent = [
    headers.join(','),
    ...products.map(product => [
      `"${product.name || ''}",`,
      `"${product.description || ''}",`,
      `"${product.price || 0}",`,
      `"${product.sku || ''}",`,
      `"${product.stock_quantity || 0}",`,
      `"${product.low_stock_threshold || 0}",`,
      `"${product.category || ''}",`,
      `"${product.brand || ''}",`,
      `"${product.status || 'draft'}",`,
      `"${product.is_featured || false}",`,
      `"${product.is_on_sale || false}",`,
      `"${(product.sizes || []).join(';')}",`,
      `"${(product.colors || []).join(';')}",`,
      `"${(product.image_urls || []).join(';')}"`
    ].join(''))
  ].join('\n');

  return csvContent;
};

/**
 * Parses CSV content to products
 */
const parseCSV = (csvContent: string): Partial<Product>[] => {
  const lines = csvContent.split('\n').filter(line => line.trim());
  if (lines.length < 2) throw new Error('CSV must contain headers and at least one data row');

  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const products: Partial<Product>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
    const product: Partial<Product> = {};

    headers.forEach((header, index) => {
      const value = values[index] || '';
      
      switch (header) {
        case 'name':
        case 'description':
        case 'sku':
        case 'category':
        case 'brand':
        case 'status':
          product[header as keyof Product] = value as any;
          break;
        case 'price':
        case 'stock_quantity':
        case 'low_stock_threshold':
          product[header as keyof Product] = parseFloat(value) || 0 as any;
          break;
        case 'is_featured':
        case 'is_on_sale':
          (product as any)[header] = value.toLowerCase() === 'true';
          break;
        case 'sizes':
        case 'colors':
        case 'image_urls':
          product[header as keyof Product] = value ? value.split(';').filter(Boolean) as any : [];
          break;
      }
    });

    if (product.name) {
      products.push(product);
    }
  }

  return products;
};

/**
 * Downloads a file with given content
 */
const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Bulk Operations Component
 * Handles CSV import/export and product duplication
 */
export function BulkOperations({
  products,
  onProductsImport,
  onProductDuplicate,
  disabled = false,
}: BulkOperationsProps) {
  const [importState, setImportState] = useState<ImportState>({
    importing: false,
    progress: 0,
  });
  const [exportState, setExportState] = useState<ExportState>({
    exporting: false,
  });
  const [duplicateState, setDuplicateState] = useState<DuplicateState>({
    duplicating: false,
  });
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [duplicateModifications, setDuplicateModifications] = useState<Partial<Product>>({});
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Handles CSV export
   */
  const handleExport = useCallback(async () => {
    if (disabled || products.length === 0) return;

    setExportState({ exporting: true });

    try {
      const csvContent = convertToCSV(products);
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `products-export-${timestamp}.csv`;
      
      downloadFile(csvContent, filename, 'text/csv');
      
      setExportState({
        exporting: false,
        success: `Successfully exported ${products.length} products`,
      });

      setTimeout(() => {
        setExportState(prev => ({ ...prev, success: undefined }));
      }, 3000);
    } catch (error) {
      console.error('Export error:', error);
      setExportState({
        exporting: false,
        error: error instanceof Error ? error.message : 'Export failed',
      });
    }
  }, [products, disabled]);

  /**
   * Handles CSV file selection
   */
  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!file.name.endsWith('.csv')) {
        setImportState({
          importing: false,
          progress: 0,
          error: 'Please select a CSV file',
        });
        return;
      }

      setImportState({ importing: true, progress: 10 });

      try {
        const content = await file.text();
        setImportState(prev => ({ ...prev, progress: 50 }));
        
        const parsedProducts = parseCSV(content);
        setImportState(prev => ({ ...prev, progress: 80, preview: parsedProducts }));
        
        setImportState(prev => ({ ...prev, progress: 100, importing: false }));
      } catch (error) {
        console.error('Import parsing error:', error);
        setImportState({
          importing: false,
          progress: 0,
          error: error instanceof Error ? error.message : 'Failed to parse CSV file',
        });
      }
    },
    []
  );

  /**
   * Confirms and processes import
   */
  const handleImportConfirm = useCallback(async () => {
    if (!importState.preview || disabled) return;

    setImportState(prev => ({ ...prev, importing: true, progress: 0 }));

    try {
      await onProductsImport(importState.preview);
      
      setImportState({
        importing: false,
        progress: 100,
        success: `Successfully imported ${importState.preview.length} products`,
        preview: undefined,
      });
      
      setImportDialogOpen(false);
      
      setTimeout(() => {
        setImportState(prev => ({ ...prev, success: undefined }));
      }, 3000);
    } catch (error) {
      console.error('Import error:', error);
      setImportState(prev => ({
        ...prev,
        importing: false,
        error: error instanceof Error ? error.message : 'Import failed',
      }));
    }
  }, [importState.preview, onProductsImport, disabled]);

  /**
   * Handles product duplication
   */
  const handleDuplicate = useCallback(async () => {
    if (!selectedProduct || disabled) return;

    setDuplicateState({ duplicating: true });

    try {
      await onProductDuplicate(selectedProduct, duplicateModifications);
      
      setDuplicateState({
        duplicating: false,
        success: 'Product duplicated successfully',
      });
      
      setDuplicateDialogOpen(false);
      setSelectedProduct("");
      setDuplicateModifications({});
      
      setTimeout(() => {
        setDuplicateState(prev => ({ ...prev, success: undefined }));
      }, 3000);
    } catch (error) {
      console.error('Duplicate error:', error);
      setDuplicateState({
        duplicating: false,
        error: error instanceof Error ? error.message : 'Duplication failed',
      });
    }
  }, [selectedProduct, duplicateModifications, onProductDuplicate, disabled]);

  /**
   * Downloads CSV template
   */
  const downloadTemplate = useCallback(() => {
    const template = [
      'name,description,price,sku,stock_quantity,low_stock_threshold,category,brand,status,is_featured,is_on_sale,sizes,colors,image_urls',
      '"Sample Product","Product description","29.99","SKU001","100","10","Clothing","Brand Name","active","false","false","S;M;L","Red;Blue","https://example.com/image1.jpg;https://example.com/image2.jpg"'
    ].join('\n');
    
    downloadFile(template, 'products-template.csv', 'text/csv');
  }, []);

  return (
    <div className="space-y-6">
      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Products
          </CardTitle>
          <CardDescription>
            Export all products to a CSV file for backup or external use
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {products.length} products available for export
              </p>
            </div>
            <Button
              onClick={handleExport}
              disabled={disabled || exportState.exporting || products.length === 0}
              className="flex items-center gap-2"
            >
              {exportState.exporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {exportState.exporting ? 'Exporting...' : 'Export CSV'}
            </Button>
          </div>
          
          {exportState.error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <p className="text-sm text-red-700">{exportState.error}</p>
            </div>
          )}
          
          {exportState.success && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <Check className="h-4 w-4 text-green-600" />
              <p className="text-sm text-green-700">{exportState.success}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Import Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Products
          </CardTitle>
          <CardDescription>
            Import products from a CSV file. Download the template to see the required format.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={downloadTemplate}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Download Template
            </Button>
            
            <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  disabled={disabled}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Import CSV
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Import Products from CSV</DialogTitle>
                  <DialogDescription>
                    Select a CSV file to import products. Make sure it follows the template format.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="csv-file">CSV File</Label>
                    <Input
                      id="csv-file"
                      type="file"
                      accept=".csv"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      disabled={importState.importing}
                    />
                  </div>
                  
                  {importState.importing && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Processing CSV file...</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${importState.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {importState.preview && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Preview ({importState.preview.length} products)</h4>
                      </div>
                      <div className="max-h-40 overflow-y-auto border rounded-lg">
                        <div className="space-y-2 p-3">
                          {importState.preview.slice(0, 5).map((product, index) => (
                            <div key={index} className="text-sm border-b pb-2 last:border-b-0">
                              <div className="font-medium">{product.name}</div>
                              <div className="text-muted-foreground">
                                SKU: {product.sku} | Price: ${product.price} | Stock: {product.stock_quantity}
                              </div>
                            </div>
                          ))}
                          {importState.preview.length > 5 && (
                            <div className="text-sm text-muted-foreground text-center pt-2">
                              ... and {importState.preview.length - 5} more products
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {importState.error && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <p className="text-sm text-red-700">{importState.error}</p>
                    </div>
                  )}
                </div>
                
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setImportDialogOpen(false);
                      setImportState({ importing: false, progress: 0, preview: undefined });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleImportConfirm}
                    disabled={!importState.preview || importState.importing}
                  >
                    {importState.importing ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Import Products
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {importState.success && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <Check className="h-4 w-4 text-green-600" />
              <p className="text-sm text-green-700">{importState.success}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Duplicate Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Copy className="h-5 w-5" />
            Duplicate Product
          </CardTitle>
          <CardDescription>
            Create a copy of an existing product with optional modifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Dialog open={duplicateDialogOpen} onOpenChange={setDuplicateDialogOpen}>
            <DialogTrigger asChild>
              <Button
                disabled={disabled || products.length === 0}
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Duplicate Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Duplicate Product</DialogTitle>
                <DialogDescription>
                  Select a product to duplicate and optionally modify the copy
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="product-select">Select Product</Label>
                  <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a product to duplicate" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} ({product.sku})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <Label>Modifications (Optional)</Label>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="new-name" className="text-xs">New Name</Label>
                      <Input
                        id="new-name"
                        placeholder="Leave empty to auto-generate"
                        value={duplicateModifications.name || ""}
                        onChange={(e) => setDuplicateModifications(prev => ({
                          ...prev,
                          name: e.target.value
                        }))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="new-sku" className="text-xs">New SKU</Label>
                      <Input
                        id="new-sku"
                        placeholder="Leave empty to auto-generate"
                        value={duplicateModifications.sku || ""}
                        onChange={(e) => setDuplicateModifications(prev => ({
                          ...prev,
                          sku: e.target.value
                        }))}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="new-description" className="text-xs">Description Changes</Label>
                    <Textarea
                      id="new-description"
                      placeholder="Leave empty to keep original"
                      value={duplicateModifications.description || ""}
                      onChange={(e) => setDuplicateModifications(prev => ({
                        ...prev,
                        description: e.target.value
                      }))}
                      rows={3}
                    />
                  </div>
                </div>
                
                {duplicateState.error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <p className="text-sm text-red-700">{duplicateState.error}</p>
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setDuplicateDialogOpen(false);
                    setSelectedProduct("");
                    setDuplicateModifications({});
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDuplicate}
                  disabled={!selectedProduct || duplicateState.duplicating}
                >
                  {duplicateState.duplicating ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Copy className="h-4 w-4 mr-2" />
                  )}
                  Duplicate
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {duplicateState.success && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <Check className="h-4 w-4 text-green-600" />
              <p className="text-sm text-green-700">{duplicateState.success}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default BulkOperations;