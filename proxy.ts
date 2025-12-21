import { NextResponse, NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const currentPassword = request.cookies.get("pswd")?.value;
  const decodedPassword = currentPassword
    ? Buffer.from(currentPassword, "base64").toString("utf-8")
    : null;
  const password = process.env.PASSWORD;
  if (decodedPassword !== password) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login).*)"],
};
