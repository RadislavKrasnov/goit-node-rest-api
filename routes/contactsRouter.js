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
  paginationSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from "../schemas/contactsSchemas.js";

const contactsRouter = express.Router();

contactsRouter.get(
  "/",
  validate(paginationSchema, "query"),
  asyncHandler(getAllContacts)
);

contactsRouter.get("/:id", asyncHandler(getOneContact));

contactsRouter.delete("/:id", asyncHandler(deleteContact));

contactsRouter.post(
  "/",
  validate(createContactSchema),
  asyncHandler(createContact)
);

contactsRouter.put(
  "/:id",
  validate(updateContactSchema),
  asyncHandler(updateContact)
);
contactsRouter.patch(
  "/:contactId/favorite",
  validate(updateFavoriteSchema),
  asyncHandler(updateStatusContact)
);

export default contactsRouter;
