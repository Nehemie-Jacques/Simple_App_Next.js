import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function Get() {
    const products = await prisma.product.findMany();
    return NextResponse.json(products);
}