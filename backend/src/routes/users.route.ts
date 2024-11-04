import express from "express";
import {
  addUser,
  refreshToken,
  updatePassword,
  userById,
  userLogin,
} from "../controllers/users.controller";
import authenticateToken from "../middleware/authenticateToken";
import {
  addUserValidate,
  loginUserValidate,
  updatePasswordValidate,
} from "../validations/user.validator";

const router = express.Router();

router.post("/api/user/login", loginUserValidate, userLogin);
router.post("/api/user", addUserValidate, addUser);
router.put("/api/user/update-password", updatePasswordValidate, updatePassword);
router.post("/api/refresh-token", refreshToken);
router.get("/api/user", authenticateToken, userById);

export { router as userRouter };
