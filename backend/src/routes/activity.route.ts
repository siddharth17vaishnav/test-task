import express from "express";
import { getActivity } from "../controllers/activity.controller";
import authenticateToken from "../middleware/authenticateToken";

const router = express.Router();

router.get("/api/activity", authenticateToken, getActivity);

export { router as activityRouter };
