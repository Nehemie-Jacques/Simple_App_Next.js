import "dotenv/config";  
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    await prisma.cartItem.deleteMany().catch(() => { });
    await prisma.cart.deleteMany().catch(() => { });
    await prisma.orderItem.deleteMany().catch(() => { });
    await prisma.order.deleteMany().catch(() => { });
    await prisma.product.deleteMany().catch(() => { });
    await prisma.user.deleteMany().catch(() => { });

    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await prisma.user.create({
        data: {
            email: 'nehemiesighe1@gmail.com',
            firstName: 'Nehemie',
            lastName: 'Sighe',
            password: hashedPassword,
        },
    });

    const products = [
        {
            sku: 'SKU-001',
            title: 'T-shirt basique',
            description: 'T-shirt 100% coton',
            price: 9.99,
            stock: 50,
            imageUrl: '/images/tshirt.png',
        },
        {
            sku: 'SKU-002',
            title: 'Casquette',
            description: 'Casquette ajustable',
            price: 7.5,
            stock: 30,
            imageUrl: '/images/cap.png',
        },
        {
            sku: 'SKU-003',
            title: 'Mug',
            description: 'Mug en céramique 350ml',
            price: 5.0,
            stock: 100,
            imageUrl: '/images/mug.png',
        },
    ];

    for (const p of products) {
        await prisma.product.create({ data: p})
    }

    console.log('Database has been seeded successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });