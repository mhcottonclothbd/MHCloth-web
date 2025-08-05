import type { Product } from '@/types'

// In-memory storage for products (in a real app, this would be a database)
let products: Product[] = []

export const ProductStorage = {
  getAll: () => [...products],
  
  getById: (id: string) => products.find(p => p.id === id),
  
  create: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    const newProduct: Product = {
      ...product,
      id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    products.push(newProduct)
    return newProduct
  },
  
  update: (id: string, updates: Partial<Product>) => {
    const index = products.findIndex(p => p.id === id)
    if (index === -1) return null
    
    const updatedProduct: Product = {
      ...products[index],
      ...updates,
      updated_at: new Date().toISOString(),
    }
    products[index] = updatedProduct
    return updatedProduct
  },
  
  delete: (id: string) => {
    const index = products.findIndex(p => p.id === id)
    if (index === -1) return false
    
    products.splice(index, 1)
    return true
  },
  
  filter: (filters: {
    category?: string
    search?: string
    featured?: boolean
    onSale?: boolean
    status?: string
  }) => {
    let filtered = [...products]
    
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(p => p.category === filters.category)
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.sku?.toLowerCase().includes(searchTerm)
      )
    }
    
    if (filters.featured) {
      filtered = filtered.filter(p => p.is_featured || p.featured)
    }
    
    if (filters.onSale) {
      filtered = filtered.filter(p => p.is_on_sale)
    }
    
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(p => p.status === filters.status)
    }
    
    return filtered
  }
} 