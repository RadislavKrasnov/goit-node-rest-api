import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";
import asyncHandler from "../helpers/asyncHandler.js";
import validate from "../helpers/validate.js";
import {
  createContactSchema,
  getAllContactsSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from "../schemas/contactsSchemas.js";
import auth from "../helpers/authHandler.js";

const contactsRouter = express.Router();

contactsRouter.get(
  "/",
  validate(getAllContactsSchema, "query"),
  asyncHandler(getAllContacts)
);

contactsRouter.get("/:id", auth, asyncHandler(getOneContact));

contactsRouter.delete("/:id", auth, asyncHandler(deleteContact));

contactsRouter.post(
  "/",
  auth,
  validate(createContactSchema),
  asyncHandler(createContact)
);

contactsRouter.put(
  "/:id",
  auth,
  validate(updateContactSchema),
  asyncHandler(updateContact)
);
contactsRouter.patch(
  "/:contactId/favorite",
  auth,
  validate(updateFavoriteSchema),
  asyncHandler(updateStatusContact)
);

export default contactsRouter;
