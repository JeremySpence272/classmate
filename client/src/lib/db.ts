import { PrismaClient, Prisma } from '@prisma/client'

// Add better logging for debugging
const logOptions: Prisma.LogLevel[] = process.env.NODE_ENV === 'development' 
  ? ['query', 'info', 'warn', 'error']
  : ['error']

// Create a more robust Prisma client
const prismaClientSingleton = () => {
  console.log('Initializing Prisma client with URL:', process.env.DATABASE_URL)
  
  return new PrismaClient({
    log: logOptions,
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })
}

declare global {
  // eslint-disable-next-line no-var
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

let prisma: ReturnType<typeof prismaClientSingleton>

// Handle potential connection errors
try {
  // Use existing client or create a new one
  prisma = globalThis.prisma ?? prismaClientSingleton()

  // Keep reference in development for hot reloading
  if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = prisma
  }
} catch (error) {
  console.error('Failed to initialize Prisma client:', error)
  throw error
}

export { prisma } 