import { Request, Response, NextFunction } from "express";

const BLOCKED: string[] = ["postman", "insomnia", "httpie", "curl", "restclient", "thunderclient"];

const blockRestClients = (req: Request, res: Response, next: NextFunction): void => {
  const ua = (req.headers["user-agent"] || "").toLowerCase();
  const blocked = BLOCKED.some((tool) => ua.includes(tool));
  console.log(`\n=== BLOCKING REST CLIENT (${ua}) ===`);

  if (blocked) {
    res.status(403).json({ error: "Login via REST clients is not allowed." });
    return;
  }

  next();
};

export default blockRestClients;
