import { signup, verifyRequestOrigin, AuthError } from "@netlify/identity";

// POST /api/auth/signup — creates a new Notesy account
export default async (req) => {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    verifyRequestOrigin(req);
    const { name, email, password } = await req.json();
    if (!email || !password) {
      return Response.json({ error: "Email and password are required." }, { status: 400 });
    }

    const user = await signup(email, password, { full_name: name || "" });
    return Response.json({
      user: { id: user.id, email: user.email, name: user.name },
      // When autoconfirm is off, the user must confirm via email before logging in
      needsConfirmation: !user.confirmedAt,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      const messages = {
        403: "Sign ups are currently disabled.",
        422: "Invalid email or password (passwords need at least 6 characters).",
      };
      const status = error.status || 400;
      return Response.json({ error: messages[status] || error.message }, { status });
    }
    console.error("Signup failed", error);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
};

export const config = { path: "/api/auth/signup" };
