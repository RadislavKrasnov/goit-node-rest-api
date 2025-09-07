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

export async function getContactById(contactId, owner) {
  return await Contact.findOne({ where: { id: contactId, owner } });
}

export async function removeContact(contactId, owner) {
  const contact = await Contact.findOne({ where: { id: contactId, owner } });

  if (!contact) return null;

  await contact.destroy();

  return contact;
}

export async function addContact({ name, email, phone, owner }) {
  return await Contact.create({ name, email, phone, owner });
}

export async function updateContact(contactId, data, owner) {
  const contact = await Contact.findOne({ where: { id: contactId, owner } });

  if (!contact) return null;

  await contact.update(data);

  return contact;
}

export async function updateStatusContact(contactId, body, owner) {
  const contact = await Contact.findOne({ where: { id: contactId, owner } });

  if (!contact) return null;
  
  await contact.update({ favorite: body.favorite });

  return contact;
}
