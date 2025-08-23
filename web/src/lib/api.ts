const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

type ApiResult<T> = { ok: true; data: T } | { ok: false; message: string; status?: number };

async function handle<T>(res: Response): Promise<ApiResult<T>> {
  const contentType = res.headers.get("content-type") || "";
  const isJSON = contentType.includes("application/json");
  const payload = isJSON ? await res.json().catch(() => ({})) : await res.text();
  if (!res.ok) {
    const message = typeof payload === "string" ? payload : payload?.message || "Request failed";
    return { ok: false, message, status: res.status };
  }
  return { ok: true, data: payload as T };
}

export async function get<T>(path: string, init?: RequestInit & { next?: { revalidate?: number }, timeoutMs?: number }): Promise<ApiResult<T>> {
  try {
    if (!API_URL) return { ok: false, message: "API URL not configured" };
    const url = `${API_URL}${path}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), init?.timeoutMs ?? 3000);
    const res = await fetch(url, {
      ...init,
      method: "GET",
      headers: { "accept": "application/json", ...(init?.headers || {}) },
      next: init?.next,
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return handle<T>(res);
  } catch (e: any) {
    return { ok: false, message: e?.message || "Network error" };
  }
}

export async function post<T>(path: string, body?: unknown, init?: RequestInit & { timeoutMs?: number }): Promise<ApiResult<T>> {
  try {
    if (!API_URL) return { ok: false, message: "API URL not configured" };
    const url = `${API_URL}${path}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), (init as any)?.timeoutMs ?? 5000);
    const res = await fetch(url, {
      ...init,
      method: "POST",
      headers: { "content-type": "application/json", "accept": "application/json", ...(init?.headers || {}) },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return handle<T>(res);
  } catch (e: any) {
    return { ok: false, message: e?.message || "Network error" };
  }
}

export type Destination = {
  id: string;
  name: string;
  slug: string;
  country?: string;
  region?: string;
  description?: string;
  imageUrl?: string;
};

export type Package = {
  id: string;
  title: string;
  slug: string;
  priceUsd: number;
  durationDays: number;
  category?: string;
  luxury?: boolean;
  imageUrl?: string;
};

export type Paged<T> = { items: T[]; total: number; limit: number; offset: number };


