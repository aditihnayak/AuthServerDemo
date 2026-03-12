import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import { port } from "./config";
import { validateSession } from "./services/sessionService";
import authRoutes from "./routes/auth";
import profileRoutes from "./routes/profile";

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// ─── Page Routes ─────────────────────────────────────────────────────────────

// Root → redirect based on session
app.get("/", (req, res) => {
  const token = req.cookies?.sessionToken;
  const username = validateSession(token);
  if (username) {
    res.redirect("/profile");
  } else {
    res.redirect("/login");
  }
});

// Serve login page
app.get("/login", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Serve signup page
app.get("/signup", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "signup.html"));
});

// ─── API Routes ──────────────────────────────────────────────────────────────

app.use("/api", authRoutes);
app.use("/profile", profileRoutes);

// ─── Debug ───────────────────────────────────────────────────────────────────

import { dump } from "./store/inMemoryStore";
app.get("/debug/store", (_req, res) => {
  res.json(dump());
});

// ─── Start ───────────────────────────────────────────────────────────────────

app.listen(port, () => console.log(`Auth server running on http://localhost:${port}`));
