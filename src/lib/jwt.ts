import { SignJWT, jwtVerify } from 'jose';

const secretKey = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET || "default_secret");  // Ensure secret key is correctly encoded
export async function encrypt(payload: string): Promise<string | null> {
    try {
        const jwt = await new SignJWT({ data: payload })  
            .setProtectedHeader({ alg: 'HS256' }) 
            .setExpirationTime('1h')  
            .sign(secretKey);  

        return jwt;
    } catch (error) {
        console.error("Error during encryption:", error);
        return null;
    }
}

export async function decrypt(token: string): Promise<any | null> {
    try {
        const { payload } = await jwtVerify(token, secretKey)
        return payload;  
    } catch (error) {
        console.error("Error during decryption:", error);
        return null;
    }
}

