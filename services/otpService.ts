import * as store from "../store/inMemoryStore";
import { randomOtp } from "../utils/token";
import { otpExpiryMs } from "../config";
import { OtpVerifyResult } from "../types";

export const createOtp = (username: string, newUserAgent: string): string => {
  const otp = randomOtp();
  store.setOtp(username, {
    otp,
    newUserAgent,
    expiresAt: Date.now() + otpExpiryMs,
  });
  return otp;
};

export const verifyOtp = (username: string, inputOtp: string): OtpVerifyResult => {
  const record = store.getOtp(username);

  if (!record)                        return { ok: false, error: "No pending OTP. Login again." };
  if (Date.now() > record.expiresAt)  return { ok: false, error: "OTP expired. Login again." };
  if (inputOtp !== record.otp)        return { ok: false, error: "Invalid OTP." };

  return { ok: true, newUserAgent: record.newUserAgent };
};

export const clearOtp = (username: string): void => {
  store.deleteOtp(username);
};
