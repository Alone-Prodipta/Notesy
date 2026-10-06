import { logout, verifyRequestOrigin, AuthError } from "@netlify/identity";

// POST /api/auth/logout — ends the session and clears the session cookie
export default async (req) => {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    verifyRequestOrigin(req);
    await logout();
    return Response.json({ ok: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return Response.json({ error: error.message }, { status: error.status || 400 });
    }
    console.error("Logout failed", error);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
};

export const config = { path: "/api/auth/logout" };
