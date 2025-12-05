"use server"

import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

const COOKIE_NAME = "session_token";
const SECRET = process.env.JWT_SECRET || "default_secret";

export async function setSessionToken(userId: string) {
    const token = jwt.sign({ userId }, SECRET, { expiresIn: '7d' });

    (await cookies()).set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days
    });
}

export async function clearSessionToken() {
    (await cookies()).delete(COOKIE_NAME);
}

export async function getUserFromCookie(): Promise<{ userId: string } | null> {
    const token = (await cookies()).get(COOKIE_NAME)?.value;
    if (!token) return null;

    try {
        const decoded = jwt.verify(token, SECRET) as { userId: string };
        return decoded;
    } catch (err) {
        console.error("Invalid token:", err);
        return null;
    }
}