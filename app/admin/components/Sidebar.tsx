"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Home,
  Package,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";

type DashboardSection = "overview" | "orders" | "products";

interface SidebarProps {
  activeSection: DashboardSection;
  onSectionChange: (section: DashboardSection) => void;
  onClose?: () => void;
}

interface NavigationItem {
  id: DashboardSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

/**
 * Navigation items configuration for the admin dashboard
 */
const navigationItems: NavigationItem[] = [
  {
    id: "overview",
    label: "Overview",
    icon: Home,
    description: "Dashboard analytics and KPIs",
  },
  {
    id: "orders",
    label: "Orders",
    icon: ShoppingCart,
    description: "Manage customer orders",
  },
  {
    id: "products",
    label: "Products",
    icon: Package,
    description: "Product catalog management",
  },
];

/**
 * Sidebar navigation component for the admin dashboard
 * Features responsive design and active state management
 */
export function Sidebar({
  activeSection,
  onSectionChange,
  onClose,
}: SidebarProps) {
  /**
   * Handles navigation item click
   */
  const handleItemClick = (section: DashboardSection) => {
    onSectionChange(section);
    onClose?.();
  };

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">MHCloth</h2>
            <p className="text-xs text-muted-foreground">Admin Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <div className="space-y-1">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 py-2">
            Main Navigation
          </h3>

          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <Button
                key={item.id}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-auto p-3",
                  isActive && "bg-secondary/80 text-secondary-foreground"
                )}
                onClick={() => handleItemClick(item.id)}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <div className="flex flex-col items-start">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.description}
                  </span>
                </div>
              </Button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <TrendingUp className="w-3 h-3" />
          <span>System Status: Online</span>
        </div>
      </div>
    </div>
  );
}
