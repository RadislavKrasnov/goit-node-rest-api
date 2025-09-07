import express from "express";
import asyncHandler from "../helpers/asyncHandler.js";
import validate from "../helpers/validate.js";
import {
  register,
  login,
  logout,
  current,
  updateSubscription,
} from "../controllers/authControllers.js";
import {
  registerSchema,
  loginSchema,
  subscriptionSchema,
} from "../schemas/authSchemas.js";
import auth from "../helpers/authHandler.js";

const router = express.Router();

router.post("/register", validate(registerSchema), asyncHandler(register));
router.post("/login", validate(loginSchema), asyncHandler(login));
router.post("/logout", auth, asyncHandler(logout));
router.get("/current", auth, asyncHandler(current));
router.patch(
  "/subscription",
  auth,
  validate(subscriptionSchema),
  asyncHandler(updateSubscription)
);

export default router;
