import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import { Configs } from "../config/config.js";

export async function registerUser({ email, password }) {
  const existing = await User.findOne({ where: { email } });

  if (existing) {
    throw HttpError(409, "Email in use");
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashed });

  return { email: user.email, subscription: user.subscription };
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = { id: user.id };
  const token = jwt.sign(payload, Configs.jwt_secret, {
    expiresIn: Configs.jwt_expires,
  });

  user.token = token;
  await user.save();

  return {
    token,
    user: { email: user.email, subscription: user.subscription },
  };
}

export async function logoutUser(userId) {
  const user = await User.findByPk(userId);

  if (!user) throw HttpError(401, "Not authorized");

  user.token = null;
  await user.save();
}

export async function getCurrentUser(userId) {
  const user = await User.findByPk(userId);

  if (!user) throw HttpError(401, "Not authorized");

  return { email: user.email, subscription: user.subscription };
}

export async function updateSubscription(userId, subscription) {
  const user = await User.findByPk(userId);

  if (!user) throw HttpError(401, "Not authorized");

  user.subscription = subscription;
  await user.save();

  return { email: user.email, subscription: user.subscription };
}
