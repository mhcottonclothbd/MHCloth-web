/**
 * Environment variable validation and configuration
 * Ensures all required environment variables are present and valid
 */

import { z } from 'zod'

// Define the schema for environment variables
const envSchema = z.object({
  // Clerk Authentication
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1, 'Clerk publishable key is required'),
  CLERK_SECRET_KEY: z.string().min(1, 'Clerk secret key is required'),
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().default('/account/sign-in'),
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().default('/account/sign-up'),
  NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: z.string().default('/dashboard'),
  NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: z.string().default('/dashboard'),

  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key is required'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  // App Configuration
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_APP_NAME: z.string().default('MHCloth'),
  NEXT_PUBLIC_APP_DESCRIPTION: z.string().default('Modern e-commerce platform'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Email Configuration (optional)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  FROM_EMAIL: z.string().email().optional(),

  // Payment Configuration (optional)
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  // Analytics (optional)
  NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: z.string().optional(),

  // Redis (optional)
  REDIS_URL: z.string().optional(),

  // File Upload (optional)
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  // Rate Limiting
  RATE_LIMIT_MAX: z.string().default('100').transform(Number),
  RATE_LIMIT_WINDOW: z.string().default('900000').transform(Number),

  // Security
  ENCRYPTION_KEY: z.string().min(32, 'Encryption key must be at least 32 characters').optional(),

  // Feature Flags
  NEXT_PUBLIC_ENABLE_ANALYTICS: z.string().default('false').transform((val: string) => val === 'true'),
  NEXT_PUBLIC_ENABLE_CHAT_SUPPORT: z.string().default('false').transform((val: string) => val === 'true'),
  NEXT_PUBLIC_MAINTENANCE_MODE: z.string().default('false').transform((val: string) => val === 'true'),

  // Next.js
  NEXT_TELEMETRY_DISABLED: z.string().optional(),
})

// Validate environment variables
function validateEnv() {
  try {
    const env = envSchema.parse(process.env)
    return env
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map((err: z.ZodIssue) => `${err.path.join('.')}: ${err.message}`)
      throw new Error(
        `❌ Invalid environment variables:\n${missingVars.join('\n')}\n\n` +
        `Please check your .env.local file and ensure all required variables are set.\n` +
        `Copy .env.example to .env.local and fill in the values.`
      )
    }
    throw error
  }
}

// Export validated environment variables
export const env = {
  ...validateEnv(),
  // Computed properties
  get isProduction(): boolean {
    return this.NODE_ENV === 'production'
  },
  get isDevelopment(): boolean {
    return this.NODE_ENV === 'development'
  },
  get isTest(): boolean {
    return this.NODE_ENV === 'test'
  }
}

// Type-safe environment variables
export type Env = z.infer<typeof envSchema>

// Helper functions
export const isProduction = env.NODE_ENV === 'production'
export const isDevelopment = env.NODE_ENV === 'development'
export const isTest = env.NODE_ENV === 'test'

// Feature flags
export const features = {
  analytics: env.NEXT_PUBLIC_ENABLE_ANALYTICS,
  chatSupport: env.NEXT_PUBLIC_ENABLE_CHAT_SUPPORT,
  maintenanceMode: env.NEXT_PUBLIC_MAINTENANCE_MODE,
  stripe: !!(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && env.STRIPE_SECRET_KEY),
  email: !!(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS),
  redis: !!env.REDIS_URL,
  cloudinary: !!(env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY),
}

// Database configuration
export const database = {
  supabase: {
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
  },
}

// App configuration
export const app = {
  name: env.NEXT_PUBLIC_APP_NAME,
  description: env.NEXT_PUBLIC_APP_DESCRIPTION,
  url: env.NEXT_PUBLIC_APP_URL,
}

// Rate limiting configuration
export const rateLimit = {
  max: env.RATE_LIMIT_MAX,
  window: env.RATE_LIMIT_WINDOW,
}

// Clerk configuration
export const clerk = {
  publishableKey: env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  secretKey: env.CLERK_SECRET_KEY,
  signInUrl: env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
  signUpUrl: env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
  afterSignInUrl: env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL,
  afterSignUpUrl: env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL,
}

/**
 * Runtime environment check
 * Call this in your app to ensure environment is properly configured
 */
export function checkEnvironment() {
  if (isDevelopment) {
    console.log('🔧 Development mode - Environment validated')
  }
  
  if (env.NEXT_PUBLIC_MAINTENANCE_MODE) {
    console.warn('🚧 Maintenance mode is enabled')
  }
  
  // Log enabled features in development
  if (isDevelopment) {
    console.log('🎯 Enabled features:', Object.entries(features)
      .filter(([, enabled]) => enabled)
      .map(([name]) => name)
      .join(', ') || 'none'
    )
  }
}

// Auto-validate on import in development
if (isDevelopment) {
  checkEnvironment()
}