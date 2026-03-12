import { Router } from "express";
import authenticate from "../middleware/authenticate";
import { getProfile, getProfileData } from "../controllers/profileController";

const router = Router();

router.get("/", authenticate, getProfile);
router.get("/data", authenticate, getProfileData);

export default router;
