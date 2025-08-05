'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, Moon, Sun } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { DashboardOverview } from './DashboardOverview'
import { OrderManagement } from './OrderManagement'
import { ProductManagement } from './ProductManagement'

import { useTheme } from '../hooks/useTheme'

type DashboardSection = 
  | 'overview'
  | 'orders'
  | 'products'

/**
 * Main admin dashboard component that manages the entire admin interface
 * Features responsive design, theme toggle, and modular section management
 */
export function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<DashboardSection>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { theme, toggleTheme, mounted } = useTheme()

  /**
   * Renders the appropriate content based on the active section
   */
  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <DashboardOverview />
      case 'orders':
        return <OrderManagement />
      case 'products':
        return <ProductManagement />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar 
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            onClose={() => setSidebarOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Desktop layout */}
      <div className="flex h-screen">
        {/* Desktop sidebar */}
        <div className="hidden lg:block w-64 border-r bg-card flex-shrink-0">
          <Sidebar 
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="border-b bg-card px-4 lg:px-6 h-16 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
              
              <h1 className="text-lg font-semibold truncate">
                Admin Dashboard
              </h1>
            </div>

            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9 flex-shrink-0"
            >
              {mounted && theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </header>

          {/* Main content area - scrollable */}
          <main className="flex-1 overflow-auto p-4 lg:p-6">
            <div className="max-w-full">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}