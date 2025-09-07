import * as authService from "../services/authService.js";
import HttpError from "../helpers/HttpError.js";

export const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.registerUser({ email, password });
  
  return res.status(201).json({ user });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginUser({ email, password });
  
  return res.json(result);
};

export const logout = async (req, res) => {
  const user = req.user;
  
  if (!user) throw HttpError(401, "Not authorized");

  await authService.logoutUser(user.id);
  
  return res.status(204).send();
};

export const current = async (req, res) => {
  const user = req.user;
  
  if (!user) throw HttpError(401, "Not authorized");

  const data = await authService.getCurrentUser(user.id);
  
  return res.json(data);
};

export const updateSubscription = async (req, res) => {
  const user = req.user;
  
  if (!user) throw HttpError(401, "Not authorized");

  const { subscription } = req.body;
  const data = await authService.updateSubscription(user.id, subscription);
  
  return res.json(data);
};
