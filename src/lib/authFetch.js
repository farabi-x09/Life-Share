import { authClient } from "@/lib/auth-client";

export async function authFetch(path, options = {}) {
  const { data } = await authClient.token();
  return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      Authorization: `Bearer ${data?.token}`,
    },
  });
}