import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import { Configs } from "../config/config.js";
import gravatar from "gravatar";
import { v4 as uuidv4 } from "uuid";
import path from "node:path";
import { fileTypeFromFile } from "file-type";
import fs from "fs/promises";

export async function registerUser({ email, password }) {
  const existing = await User.findOne({ where: { email } });

  if (existing) {
    throw HttpError(409, "Email in use");
  }

  const hashed = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email, { s: 250, d: "identicon" }, true);
  const user = await User.create({ email, password: hashed, avatarURL });

  return {
    email: user.email,
    subscription: user.subscription,
    avatarURL: user.avatarURL,
  };
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
    user: {
      email: user.email,
      subscription: user.subscription,
      avatarURL: user.avatarURL,
    },
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

  return {
    email: user.email,
    subscription: user.subscription,
    avatarURL: user.avatarURL,
  };
}

export async function updateSubscription(userId, subscription) {
  const user = await User.findByPk(userId);

  if (!user) throw HttpError(401, "Not authorized");

  user.subscription = subscription;
  await user.save();

  return { email: user.email, subscription: user.subscription };
}

export async function updateAvatar(userId, file) {
  const user = await User.findByPk(userId);

  const tempPath = file.path;
  const detected = await fileTypeFromFile(tempPath);

  if (
    !detected ||
    !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
      detected.mime
    )
  ) {
    await fs.unlink(tempPath);

    throw HttpError(400, "Invalid or unsupported file type");
  }

  const ext = `.${detected.ext}`;
  const filename = `${uuidv4()}${ext}`;

  const avatarDir = path.join(process.cwd(), "public", "avatars");
  await fs.mkdir(avatarDir, { recursive: true });

  const targetPath = path.join(avatarDir, filename);
  await fs.rename(tempPath, targetPath);

  if (user.avatarURL) {
    const oldAvatarPath = path.join(process.cwd(), "public", user.avatarURL);
    try {
      await fs.unlink(oldAvatarPath);
    } catch (error) {
      console.log(error);
    }
  }

  user.avatarURL = `avatars/${filename}`;
  await user.save();

  return user.avatarURL;
}
