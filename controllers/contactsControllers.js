import {
  getContactById,
  listContacts,
  removeContact,
  addContact,
  updateContact as updateContactService,
  updateStatusContact as updateStatusContactService,
} from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res) => {
  const { page = 1, limit = 20, sort = "ASC", favorite } = req.query;
  const owner = req.user.id;
  const contacts = await listContacts({
    page: Number(page),
    limit: Number(limit),
    sort,
    owner,
    favorite,
  });

  return res.json(contacts);
};

export const getOneContact = async (req, res) => {
  const { id } = req.params;
  const owner = req.user.id;
  const contact = await getContactById(id, owner);

  if (!contact) {
    throw HttpError(404);
  }

  return res.json(contact);
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  const owner = req.user.id;
  const removed = await removeContact(id, owner);

  if (!removed) {
    throw HttpError(404);
  }

  return res.json(removed);
};

export const createContact = async (req, res) => {
  const { name, email, phone } = req.body;
  const owner = req.user.id;
  const newContact = await addContact({ name, email, phone, owner });

  return res.status(201).json(newContact);
};

export const updateContact = async (req, res) => {
  const { id } = req.params;

  if (!req.body || Object.keys(req.body).length === 0) {
    throw HttpError(400, "Body must have at least one field");
  }

  const owner = req.user.id;
  const updated = await updateContactService(id, req.body, owner);

  if (!updated) {
    throw HttpError(404);
  }

  return res.json(updated);
};

export const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;
  const owner = req.user.id;
  const updated = await updateStatusContactService(contactId, req.body, owner);

  if (!updated) {
    throw HttpError(404);
  }

  return res.json(updated);
};
