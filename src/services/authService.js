import { appEnv } from "@/config/env";

export function getAuthToken() {
  try {
    return localStorage.getItem(appEnv.authTokenKey);
  } catch {
    return null;
  }
}

export function setAuthToken(token) {
  if (!token) return;
  localStorage.setItem(appEnv.authTokenKey, token);
}

export function clearAuthToken() {
  localStorage.removeItem(appEnv.authTokenKey);
}

export function isAuthenticated() {
  return Boolean(getAuthToken());
}
