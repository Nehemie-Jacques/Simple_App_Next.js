"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { setSessionToken } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function signupAction(formatData: FormData) {
    const email = formatData.get("email") as string;
    const password = FormData.get("password") as string;

    if (!email || !password) return { error: "All fields are required." };

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return { error: "User already exists." };
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: { email, password: hashedPassword },
    });

    setSessionToken(user.id);

    redirect("/");
}

export async function loginAction(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) return { error: "All fields are required." };

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { error: "Invalid credentials." };

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return { error: "Invalid credentials." };

    setSessionToken(user.id);

    redirect("/");
}