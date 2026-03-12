import rateLimit from "express-rate-limit";

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // max 10 login attempts per window
  message: { error: "Too many login attempts. Try again in 15 minutes." },
});

export default rateLimiter;
