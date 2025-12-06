import { PrismaClient } from '@prisma/client';

/**
 * Instance globale de PrismaClient pour éviter les connexions multiples en développement.
 * En production, une nouvelle instance est créée à chaque déploiement.
 * En développement, l'instance est réutilisée grâce au cache global.
 */

// Déclaration du type global pour TypeScript
declare global {
  var prisma: PrismaClient | undefined;
}

// Fonction pour créer une nouvelle instance Prisma avec configuration
const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
  });
};

// Utiliser l'instance globale en développement, créer une nouvelle en production
export const prisma = global.prisma ?? createPrismaClient();

// En développement, sauvegarder l'instance dans le global pour la réutiliser
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Gestionnaire de déconnexion propre lors de l'arrêt de l'application
if (process.env.NODE_ENV === 'production') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect();
  });
}

export default prisma;