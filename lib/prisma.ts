import { PrismaClient } from '../app/generated/prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new PrismaClient(undefined as any); 

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;