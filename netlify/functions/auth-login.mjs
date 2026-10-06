import { login, verifyRequestOrigin, AuthError } from "@netlify/identity";

// POST /api/auth/login — logs a user in and sets the session cookie
export default async (req) => {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    verifyRequestOrigin(req);
    const { email, password } = await req.json();
    if (!email || !password) {
      return Response.json({ error: "Email and password are required." }, { status: 400 });
    }

    const user = await login(email, password);
    return Response.json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    if (error instanceof AuthError) {
      const status = error.status || 400;
      const message =
        status === 401 || status === 400 || status === 404
          ? "Invalid email or password, or your email is not confirmed yet."
          : error.message;
      return Response.json({ error: message }, { status });
    }
    console.error("Login failed", error);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
};

export const config = { path: "/api/auth/login" };
