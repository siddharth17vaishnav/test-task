import express from "express";
import {
  acceptRequest,
  getRequests,
  rejectRequest,
  sendFriendRequest,
  findFriends,
} from "../controllers/friends.controller";
import authenticateToken from "../middleware/authenticateToken";

const router = express.Router();

router.post("/api/friends", authenticateToken, sendFriendRequest);
router.put("/api/friends/:id/accept", authenticateToken, acceptRequest);
router.put("/api/friends/:id/reject", authenticateToken, rejectRequest);
router.get("/api/friends/requests", authenticateToken, getRequests);
router.get("/api/friends", authenticateToken, findFriends);

export { router as friendRouter };
