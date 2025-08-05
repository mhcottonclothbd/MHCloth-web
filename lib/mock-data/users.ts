import { User } from '@/types'

/**
 * Mock user data to replace Supabase authentication and user management
 * This file provides static user data for the application
 */

// Mock users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'admin@example.com',
    full_name: 'Admin User',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    created_at: '2023-06-15T10:30:00Z'
  },
  {
    id: 'user-2',
    email: 'jane.smith@example.com',
    full_name: 'Jane Smith',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    created_at: '2023-07-20T14:45:00Z'
  },
  {
    id: 'user-3',
    email: 'michael.brown@example.com',
    full_name: 'Michael Brown',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    created_at: '2023-08-05T09:15:00Z'
  },
  {
    id: 'user-4',
    email: 'emily.wilson@example.com',
    full_name: 'Emily Wilson',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    created_at: '2023-08-18T16:20:00Z'
  },
  {
    id: 'user-5',
    email: 'david.johnson@example.com',
    full_name: 'David Johnson',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    created_at: '2023-09-02T11:10:00Z'
  }
]

// Mock current user (simulating authenticated user)
export const mockCurrentUser: User = mockUsers[0] // Admin user

// Helper function to get user by ID
export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id)
}

// Helper function to get user by email
export const getUserByEmail = (email: string): User | undefined => {
  return mockUsers.find(user => user.email.toLowerCase() === email.toLowerCase())
}

// Helper function to update user profile
export const updateUserProfile = (userId: string, data: Partial<User>): User | undefined => {
  const userIndex = mockUsers.findIndex(user => user.id === userId)
  
  if (userIndex === -1) return undefined
  
  // Create updated user object
  const updatedUser = {
    ...mockUsers[userIndex],
    ...data,
    // Don't allow changing these fields
    id: mockUsers[userIndex].id,
    email: mockUsers[userIndex].email,
    created_at: mockUsers[userIndex].created_at
  }
  
  // Update the user in the array
  mockUsers[userIndex] = updatedUser
  
  return updatedUser
}