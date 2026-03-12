import crypto from "crypto";

export const randomToken = (): string => crypto.randomBytes(16).toString("hex");
export const randomOtp = (): string => Math.floor(100000 + Math.random() * 900000).toString();
