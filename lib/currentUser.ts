"use server";

import { prisma } from "@/lib/prisma";
import { getUserFromCookie } from "@/lib/auth";

/**
 * Récupère l'utilisateur actuellement connecté depuis le cookie de session.
 * @returns L'utilisateur avec ses informations de base, ou null si non connecté ou utilisateur inexistant.
 */
export async function getCurrentUser() {
    // Récupérer la session depuis le cookie (nécessite await car c'est une Promise)
    const session = await getUserFromCookie();
    if (!session) return null;

    try {
        // Récupérer l'utilisateur complet depuis la base de données
        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { 
                id: true, 
                email: true, 
                firstName: true,
                lastName: true,
                createdAt: true 
            },
        });

        return user;
    } catch (error) {
        // Logger l'erreur si la requête DB échoue
        console.error("Error fetching current user:", error instanceof Error ? error.message : "Unknown error");
        return null;
    }
}