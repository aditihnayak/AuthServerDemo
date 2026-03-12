import bcrypt from "bcrypt";
import { bcryptSaltRounds } from "../config";

export const hashPassword = (plain: string): Promise<string> =>
  bcrypt.hash(plain, bcryptSaltRounds);

export const comparePassword = (plain: string, hashed: string): Promise<boolean> =>
  bcrypt.compare(plain, hashed);
