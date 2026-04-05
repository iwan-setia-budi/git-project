import { appEnv } from "@/config/env";
import { getAuthToken } from "@/services/authService";

function withTimeout(ms) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  return { controller, timeout };
}

function buildUrl(path) {
  const cleanBase = appEnv.apiBaseUrl.replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}

export async function apiRequest(path, options = {}) {
  const { controller, timeout } = withTimeout(appEnv.apiTimeoutMs);
  const token = getAuthToken();

  try {
    const response = await fetch(buildUrl(path), {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });

    if (!response.ok) {
      const message = `API error: ${response.status}`;
      throw new Error(message);
    }

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return response.json();
    }

    return response.text();
  } finally {
    clearTimeout(timeout);
  }
}
