import { Contact } from "../models/contact.js";

export async function listContacts({
  page = 1,
  limit = 20,
  sort = "ASC",
  owner,
  favorite,
} = {}) {
  const where = { owner };
  const offset = (page - 1) * limit;

  if (typeof favorite !== "undefined") {
    if (favorite === "true" || favorite === true) where.favorite = true;
    else if (favorite === "false" || favorite === false) where.favorite = false;
  }

  const { rows, count } = await Contact.findAndCountAll({
    where,
    limit,
    offset,
    order: [["id", sort.toUpperCase()]],
  });

  return {
    total: count,
    page: page,
    limit: limit,
    totalPages: Math.ceil(count / limit),
    data: rows,
  };
}

export async function getContactById(contactId) {
  return await Contact.findByPk(contactId);
}

export async function removeContact(contactId) {
  const contact = await Contact.findByPk(contactId);
  if (!contact) return null;
  await contact.destroy();

  return contact;
}

export async function addContact(name, email, phone) {
  return await Contact.create({ name, email, phone });
}

export async function updateContact(contactId, data) {
  const contact = await Contact.findByPk(contactId);
  if (!contact) return null;
  await contact.update(data);

  return contact;
}

export async function updateStatusContact(contactId, body) {
  const contact = await Contact.findByPk(contactId);
  if (!contact) return null;
  await contact.update({ favorite: body.favorite });

  return contact;
}
