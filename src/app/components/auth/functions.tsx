export async function createFirebaseSession(idToken: string) {
  try {
    const res = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });

    if (!res.ok) {
      throw new Error("Failed to create session");
    }

    return true;
  } catch (err) {
    console.error("Session creation error:", err);
    return false;
  }
}
