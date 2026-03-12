import { Response, NextFunction } from "express";
import { validateSession } from "../services/sessionService";
import { AuthenticatedRequest } from "../types";

const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const token = req.cookies?.sessionToken as string | undefined;
  const username = validateSession(token);

  if (!username) {
    // Redirect browser users to login; return JSON for API calls
    const acceptsJson = req.headers["accept"]?.includes("application/json");
    if (acceptsJson) {
      res.status(401).json({ error: "Unauthorized. Please log in." });
    } else {
      res.redirect("/login?error=" + encodeURIComponent("Please log in first."));
    }
    return;
  }

  req.username = username;
  next();
};

export default authenticate;
