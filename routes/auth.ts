import { Router } from "express";
import blockRestClients from "../middleware/blockRestClients";
import { signup, login, logout } from "../controllers/authController";

const router = Router();

router.post("/signup", blockRestClients,signup);
router.post("/login", blockRestClients, login);
router.post("/logout", logout);

export default router;
