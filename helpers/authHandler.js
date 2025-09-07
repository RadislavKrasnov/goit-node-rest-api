import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import HttpError from "./HttpError.js";
import { Configs } from "../config/config.js";

const auth = async (req, _, next) => {
  try {
    const header = req.headers.authorization || "";
    const [type, token] = header.split(" ");
    if (type !== "Bearer" || !token) {
      throw HttpError(401, "Not authorized");
    }

    let payload;

    try {
      payload = jwt.verify(token, Configs.jwt_secret);
    } catch (e) {
      throw HttpError(401, "Not authorized");
    }

    const user = await User.findByPk(payload.id);
    
    if (!user || user.token !== token) {
      throw HttpError(401, "Not authorized");
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

export default auth;
