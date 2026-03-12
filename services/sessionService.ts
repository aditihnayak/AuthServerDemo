import * as store from "../store/inMemoryStore";
import { randomToken } from "../utils/token";
import { sessionExpiryMs } from "../config";

export const createSession = (username: string): string => {
  const token = randomToken();
  store.setSession(token, { username, createdAt: Date.now() });
  return token;
};

export const validateSession = (token: string | undefined): string | null => {
  if (!token) return null;

  const session = store.getSession(token);
  if (!session) return null;

  const expired = Date.now() - session.createdAt > sessionExpiryMs;
  if (expired) {
    store.deleteSession(token);
    return null;
  }

  return session.username;
};

export const destroySession = (token: string | undefined): void => {
  if (token) store.deleteSession(token);
};
