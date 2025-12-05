import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

interface CreateOrderBody {
  userId: string;
  items: OrderItem[];
}

export async function POST(req: Request) {
  const body: CreateOrderBody = await req.json();
  
  // Calculer le total avec des types sûrs
  const total = body.items.reduce((sum: number, item: OrderItem) => 
    sum + item.quantity * item.unitPrice, 0);

  const order = await prisma.order.create({
    data: {
      user: { connect: { id: body.userId } },
      total,
      status: 'pending',
      items: {
        create: body.items.map((item: OrderItem) => ({
          product: { connect: { id: item.productId } },
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      },
    },
    include: { items: true },
  });

  return NextResponse.json(order);
}