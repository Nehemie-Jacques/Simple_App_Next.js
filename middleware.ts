import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

const protectedPaths = ["/checkout","/profile", "/account"];

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const needsAuth = protectedPaths.some((path) =>
        pathname.startsWith(path)
    );
    if (!needsAuth) return NextResponse.next();

    const token = req.cookies.get("session_token")?.value;

    if (!token) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("from", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Vérifier que le SECRET est défini
    if (!SECRET) {
        console.error("JWT_SECRET is not defined in environment variables");
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("from", pathname);
        return NextResponse.redirect(loginUrl);
    }

    try {
        jwt.verify(token, SECRET);
        return NextResponse.next();
    } catch (error) {
        // Logger l'erreur de vérification JWT pour le debug
        console.error("JWT verification failed:", error instanceof Error ? error.message : "Unknown error");
        
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("from", pathname);
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete("session_token");
        return response;
    }
}

export const config = {
    matcher: ["/checkout/:path*", "/profile/:path*", "/account/:path*"],
};