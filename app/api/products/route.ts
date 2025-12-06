import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * GET /api/products
 * Récupère la liste de tous les produits disponibles.
 * @returns Liste des produits ou erreur 500 en cas d'échec.
 */
export async function GET() {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                sku: true,
                title: true,
                description: true,
                price: true,
                stock: true,
                imageUrl: true,
                createdAt: true,
            },
        });
        
        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        console.error("Error fetching products:", error instanceof Error ? error.message : "Unknown error");
        
        return NextResponse.json(
            { error: "Failed to fetch products" },
            { status: 500 }
        );
    }
}

/**
 * POST /api/products
 * Crée un nouveau produit (optionnel - pour administration).
 * @returns Le produit créé ou erreur 400/500.
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();
        
        // Validation basique
        const { sku, title, price, stock } = body;
        if (!sku || !title || price === undefined || stock === undefined) {
            return NextResponse.json(
                { error: "Missing required fields: sku, title, price, stock" },
                { status: 400 }
            );
        }

        const product = await prisma.product.create({
            data: {
                sku: body.sku,
                title: body.title,
                description: body.description || "",
                price: parseFloat(body.price),
                stock: parseInt(body.stock),
                imageUrl: body.imageUrl || null,
            },
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error("Error creating product:", error instanceof Error ? error.message : "Unknown error");
        
        return NextResponse.json(
            { error: "Failed to create product" },
            { status: 500 }
        );
    }
}