import Joi from "joi";

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const subscriptionSchema = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").required(),
});

export const resendVerifySchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      "any.required": "missing required field email",
    }),
});

export const verifyParamsSchema = Joi.object({
  verificationToken: Joi.string().required(),
});
