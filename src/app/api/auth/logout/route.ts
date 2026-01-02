import { cookies } from "next/headers";

export async function POST() {
  (await cookies()).delete("session");
  return Response.redirect(new URL("/", "http://localhost:3000"));
}