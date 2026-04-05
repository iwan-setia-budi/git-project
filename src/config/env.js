const DEFAULT_TIMEOUT_MS = 10000;

function toNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const appEnv = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "",
  authTokenKey: import.meta.env.VITE_AUTH_TOKEN_KEY || "auth_token",
  authRefreshPath: import.meta.env.VITE_AUTH_REFRESH_URL || "/api/auth/refresh",
  apiTimeoutMs: toNumber(import.meta.env.VITE_API_TIMEOUT, DEFAULT_TIMEOUT_MS),
  environment: import.meta.env.VITE_ENVIRONMENT || "development",
};

export function hasApiConfig() {
  return Boolean(appEnv.apiBaseUrl);
}
