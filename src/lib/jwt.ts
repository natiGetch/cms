import { SignJWT, jwtVerify } from 'jose';

const secretKey = new TextEncoder().encode(process.env.NEXT_JWT_SECRET); 
export async function encrypt(id: string, role: string): Promise<string | null> {
    try {
     
        const token = await new SignJWT({ id, role }) 
            .setProtectedHeader({ alg: 'HS256' }) 
            .setExpirationTime('7d') 
            .sign(secretKey); 

        return token; 
    } catch (error) {
        console.error("Error during encryption:", error);
        return null;
    }
}

export async function decrypt(token: string): Promise<{ id: string, role: string } | null> {
    try {
        const { payload } = await jwtVerify(token, secretKey); 
        return payload as { id: string, role: string }; 
    } catch (error) {
        console.error("Error during decryption:", error);
        return null;
    }
}
