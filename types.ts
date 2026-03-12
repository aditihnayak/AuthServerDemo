import { Request } from "express";

// ─── Domain Types ────────────────────────────────────────────────────────────

export interface User {
  passwordHash: string;
  userAgent: string;
}

export interface SessionData {
  username: string;
  createdAt: number;
}

export interface OtpRecord {
  otp: string;
  newUserAgent: string;
  expiresAt: number;
}

export interface OtpVerifyResult {
  ok: boolean;
  error?: string;
  newUserAgent?: string;
}

// ─── Express Extensions ─────────────────────────────────────────────────────

export interface AuthenticatedRequest extends Request {
  username?: string;
}
