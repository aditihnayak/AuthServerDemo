import { Request, Response } from "express";
import * as store from "../store/inMemoryStore";
import { hashPassword, comparePassword } from "../utils/hash";
import { createSession, destroySession } from "../services/sessionService";
import { createOtp, verifyOtp, clearOtp } from "../services/otpService";
import { sendOtp } from "../services/mailer";

// ─── Helper: is this an AJAX/JSON request or a form submission? ──────────────

const wantsJson = (req: Request): boolean =>
  req.headers["content-type"]?.includes("application/json") ||
  req.headers["accept"]?.includes("application/json") || false;

// ─── Signup ──────────────────────────────────────────────────────────────────

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  const userAgent = req.headers["user-agent"] || "";

  if (!username || !password) {
    if (wantsJson(req)) {
      res.status(400).json({ error: "username and password required" });
    } else {
      res.redirect("/signup?error=" + encodeURIComponent("Username and password are required."));
    }
    return;
  }

  if (store.userExists(username)) {
    if (wantsJson(req)) {
      res.status(409).json({ error: "Username already taken." });
    } else {
      res.redirect("/signup?error=" + encodeURIComponent("Username already taken."));
    }
    return;
  }

  const passwordHash = await hashPassword(password);
  store.setUser(username, { passwordHash, userAgent });

  console.log(`\n=== STORE STATE AFTER SIGNUP (${username}) ===`);
  console.dir(store.dump(), { depth: null, colors: true });

  if (wantsJson(req)) {
    res.json({ message: "Signup successful." });
  } else {
    res.redirect("/login?success=" + encodeURIComponent("Account created! Please log in."));
  }
};

// ─── Login ───────────────────────────────────────────────────────────────────

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password, otp } = req.body;
  const userAgent = req.headers["user-agent"] || "";

  const user = store.getUser(username);
  if (!user || !(await comparePassword(password, user.passwordHash))) {
    if (wantsJson(req)) {
      res.status(401).json({ error: "Invalid username or password." });
    } else {
      res.redirect("/login?error=" + encodeURIComponent("Invalid username or password."));
    }
    return;
  }

  // Same browser → log straight in
  if (userAgent === user.userAgent) {
    const token = createSession(username);
    res.cookie("sessionToken", token, { httpOnly: true, sameSite: "lax", maxAge: 7 * 24 * 60 * 60 * 1000 });

    console.log(`\n=== STORE STATE AFTER SAME-BROWSER LOGIN (${username}) ===`);
    console.dir(store.dump(), { depth: null, colors: true });

    if (wantsJson(req)) {
      res.json({ message: "Login successful.", sessionToken: token });
    } else {
      res.redirect("/profile");
    }
    return;
  }

  // Different browser → OTP flow
  if (!otp) {
    const generatedOtp = createOtp(username, userAgent);
    await sendOtp(username, generatedOtp);

    if (wantsJson(req)) {
      res.status(206).json({ message: "New browser detected. Use the OTP to continue.", demoOtp: generatedOtp });
    } else {
      // Show OTP directly on the page (demo mode — in production, send via email/SMS)
      res.redirect(
        "/login?otp=true&username=" + encodeURIComponent(username) +
        "&demoOtp=" + encodeURIComponent(generatedOtp) +
        "&info=" + encodeURIComponent("New browser detected! Enter the OTP below to verify.")
      );
    }
    return;
  }

  const result = verifyOtp(username, otp);
  if (!result.ok) {
    if (wantsJson(req)) {
      res.status(401).json({ error: result.error });
    } else {
      res.redirect(
        "/login?otp=true&username=" + encodeURIComponent(username) +
        "&error=" + encodeURIComponent(result.error || "Invalid OTP.")
      );
    }
    return;
  }

  // OTP passed → update trusted browser, open session
  store.setUser(username, { ...user, userAgent: result.newUserAgent! });
  clearOtp(username);

  const token = createSession(username);
  res.cookie("sessionToken", token, { httpOnly: true, sameSite: "lax", maxAge: 7 * 24 * 60 * 60 * 1000 });

  console.log(`\n=== STORE STATE AFTER OTP LOGIN (${username}) ===`);
  console.dir(store.dump(), { depth: null, colors: true });

  if (wantsJson(req)) {
    res.json({ message: "OTP verified. Login successful.", sessionToken: token });
  } else {
    res.redirect("/profile");
  }
};

// ─── Logout ──────────────────────────────────────────────────────────────────

export const logout = (req: Request, res: Response): void => {
  const token = req.cookies?.sessionToken as string | undefined;
  destroySession(token);
  res.clearCookie("sessionToken");

  if (wantsJson(req)) {
    res.json({ message: "Logged out." });
  } else {
    res.redirect("/login?success=" + encodeURIComponent("You have been logged out."));
  }
};
