import {
    getContactById,
    listContacts,
    removeContact,
    addContact,
    updateContact as updateContactService
} from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js"

export const getAllContacts = async (req, res) => {
    const contacts = await listContacts();

    return res.json(contacts)
};

export const getOneContact = async (req, res) => {
    const { id } = req.params;
    const contact = await getContactById(id);

    if (!contact) {
        throw HttpError(404);
    }

    return res.json(contact);
};

export const deleteContact = async (req, res) => {
    const { id } = req.params;
    const removed = await removeContact(id);

    if (!removed) {
        throw HttpError(404);
    }

    return res.json(removed);
};

export const createContact = async (req, res) => {
    const { name, email, phone } = req.body;
    const newContact = await addContact(name, email, phone);

    return res.status(201).json(newContact);
};

export const updateContact = async (req, res) => {
    const { id } = req.params;

    if (!req.body || Object.keys(req.body).length === 0) {
        throw HttpError(400, "Body must have at least one field")
    }
    
    const updated = await updateContactService(id, req.body);

    if (!updated) {
      throw HttpError(404);
    }

    return res.json(updated);
};
