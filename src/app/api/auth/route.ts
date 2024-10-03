import { auth } from "firebase-admin";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { customInitApp } from "../../../../firebase-admin-config";
import { COOKIE_NAME } from "@/utils/constants/globalConstants";

customInitApp();

export async function POST() {
  const authorization = headers().get("Authorization");

  if (authorization?.startsWith("Bearer ")) {
    const idToken = authorization.split("Bearer ")[1];

    try {
      const decodedToken = await auth().verifyIdToken(idToken);

      if (decodedToken) {
        //Generar cookie
        const expiresIn = 60 * 60 * 24 * 1 * 1000;
        const sessionCookie = await auth().createSessionCookie(idToken, {
          expiresIn
        });

        const options = {
          name: COOKIE_NAME,
          value: sessionCookie,
          maxAge: expiresIn,
          httpOnly: true,
          secure: true
        };

        cookies().set(options as any);
      }

      return NextResponse.json({}, { status: 200 });
    } catch (error) {
      console.error("Error en la validación del token route.ts");
      return NextResponse.json({}, { status: 401 });
    }
  }
}

export async function GET() {
  const session = cookies().get(COOKIE_NAME || "")?.value || "";

  if (!session) {
    return NextResponse.json({ isLogged: false }, { status: 401 });
  }

  const decodedClaims = await auth().verifySessionCookie(session, true);

  if (!decodedClaims) {
    console.info("Error en la validación del token route.ts");
    return NextResponse.json({ isLogged: false }, { status: 401 });
  }

  return NextResponse.json({ isLogged: true }, { status: 200 });
}
