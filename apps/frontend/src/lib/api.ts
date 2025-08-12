export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

type FetchInit = RequestInit & { retryOnUnauthorized?: boolean };

function getTokens() {
  if (typeof window === "undefined") return { access: null as string | null, refresh: null as string | null };
  return {
    access: localStorage.getItem("cp_token"),
    refresh: localStorage.getItem("cp_refresh"),
  };
}

function setTokens(access?: string | null, refresh?: string | null) {
  if (typeof window === "undefined") return;
  if (typeof access === "string") localStorage.setItem("cp_token", access);
  if (typeof refresh === "string") localStorage.setItem("cp_refresh", refresh);
}

async function refreshAccessToken(): Promise<string | null> {
  try {
    const { refresh } = getTokens();
    if (!refresh) return null;
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: refresh }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { accessToken?: string };
    if (data?.accessToken) {
      setTokens(data.accessToken, null);
      return data.accessToken;
    }
    return null;
  } catch {
    return null;
  }
}

export async function fetchWithAuth(input: string, init: FetchInit = {}): Promise<Response> {
  const { access } = getTokens();
  const { retryOnUnauthorized, ...rest } = init as any;
  const headers = new Headers(rest.headers);
  if (access) headers.set("Authorization", `Bearer ${access}`);
  let res = await fetch(input, { ...(rest as RequestInit), headers });
  if (res.status === 401 && retryOnUnauthorized !== false) {
    const newAccess = await refreshAccessToken();
    if (newAccess) {
      const retryHeaders = new Headers(rest.headers);
      retryHeaders.set("Authorization", `Bearer ${newAccess}`);
      res = await fetch(input, { ...(rest as RequestInit), headers: retryHeaders });
    }
  }
  return res;
}


