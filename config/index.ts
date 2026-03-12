export const port: number = Number(process.env.PORT) || 3000;
export const otpExpiryMs: number = 5 * 60 * 1000;           // 5 minutes
export const sessionExpiryMs: number = 7 * 24 * 60 * 60 * 1000; // 7 days
export const bcryptSaltRounds: number = 10;
