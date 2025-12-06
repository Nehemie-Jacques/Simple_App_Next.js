import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function Get() {
    const products = await prisma.product.findMany();
    return NextResponse.json(products);
}