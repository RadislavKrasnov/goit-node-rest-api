import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
} from "../controllers/contactsControllers.js";
import asyncHandler from "../helpers/asyncHandler.js";
import validateBody from "../helpers/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

const contactsRouter = express.Router();

contactsRouter.get("/", asyncHandler(getAllContacts));

contactsRouter.get("/:id", asyncHandler(getOneContact));

contactsRouter.delete("/:id", asyncHandler(deleteContact));

contactsRouter.post(
  "/",
  validateBody(createContactSchema),
  asyncHandler(createContact)
);

contactsRouter.put(
  "/:id",
  validateBody(updateContactSchema),
  asyncHandler(updateContact)
);

export default contactsRouter;
