import { db } from "./db";
import { users } from "../schema";
import { eq } from "drizzle-orm";
import { cookies as nextCookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = 'nur_session';
const SECRET_KEY = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "fallback_secret_for_development_only");

export async function encrypt(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(SECRET_KEY);
}

export async function decrypt(input: string): Promise<any> {
    const { payload } = await jwtVerify(input, SECRET_KEY, {
        algorithms: ["HS256"],
    });
    return payload;
}

export async function verifySession() {
    const cookieStore = await nextCookies();
    const session = cookieStore.get(COOKIE_NAME);

    if (!session?.value) return null;

    try {
        const payload = await decrypt(session.value);
        if (!payload || !payload.userId) return null;

        const [admin] = await db.select().from(users).where(eq(users.id, payload.userId as string)).limit(1);
        return admin || null;
    } catch (err) {
        return null;
    }
}
