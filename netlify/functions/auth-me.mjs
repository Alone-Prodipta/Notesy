import { getUser } from "@netlify/identity";

// GET /api/auth/me — returns the currently logged-in user, or 401
export default async () => {
  const user = await getUser();
  if (!user) {
    return Response.json({ user: null }, { status: 401 });
  }
  return Response.json({
    user: { id: user.id, email: user.email, name: user.name, roles: user.roles || [] },
  });
};

export const config = { path: "/api/auth/me" };
