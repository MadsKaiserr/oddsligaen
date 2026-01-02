import { cookies } from "next/headers";

export async function POST() {
  (await cookies()).delete("session");
  return Response.redirect(new URL("/", process.env.NEXT_PUBLIC_SITE_URL));
}