import { User, SessionData, OtpRecord } from "../types";

// Single source of truth for all in-memory data.
// To add a DB later, replace the logic in each function here only.

const users: Record<string, User> = {};
const sessions: Record<string, SessionData> = {};
const otpStore: Record<string, OtpRecord> = {};

// Users
export const getUser = (username: string): User | undefined => users[username];
export const setUser = (username: string, data: User): void => { users[username] = data; };
export const userExists = (username: string): boolean => !!users[username];

// Sessions
export const getSession = (token: string): SessionData | undefined => sessions[token];
export const setSession = (token: string, data: SessionData): void => { sessions[token] = data; };
export const deleteSession = (token: string): void => { delete sessions[token]; };

// OTP
export const getOtp = (username: string): OtpRecord | undefined => otpStore[username];
export const setOtp = (username: string, data: OtpRecord): void => { otpStore[username] = data; };
export const deleteOtp = (username: string): void => { delete otpStore[username]; };

// Debug — dump entire store
export const dump = () => ({ users, sessions, otpStore });
