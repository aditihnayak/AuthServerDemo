import { Response } from "express";
import path from "path";
import { AuthenticatedRequest } from "../types";

export const getProfile = (req: AuthenticatedRequest, res: Response): void => {
  const acceptsJson = req.headers["accept"]?.includes("application/json");

  if (acceptsJson) {
    res.json({ message: `Hello, ${req.username}!`, username: req.username });
  } else {
    res.sendFile(path.join(__dirname, "..", "public", "profile.html"));
  }
};

// API endpoint to get profile data (used by profile.html via fetch)
export const getProfileData = (req: AuthenticatedRequest, res: Response): void => {
  res.json({ username: req.username });
};
