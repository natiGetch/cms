import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./lib/jwt";

export async function  middleware(req : NextRequest) {
    const token = req.cookies.get('token')?.value
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }
  try {
    const verifyToken = await decrypt(token)
    if(verifyToken)
    {
        return NextResponse.next();
    }
    else {
        return NextResponse.redirect(new URL("/login", req.url))
    }
  } catch (error) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
export const config = {
    matcher: [
       '/((?!api/login|login|_next/static|_next/image|favicon.ico).*)',
    ],
  };