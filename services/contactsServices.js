import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contactsPath = path.join(__dirname, "../db/contacts.json");

async function readContactsFile(params) {
  const data = await fs.readFile(contactsPath, "utf-8");

  if (!data) {
    return [];
  }

  return JSON.parse(data);
}

export async function listContacts() {
  return await readContactsFile();
}

export async function getContactById(contactId) {
  const contacts = await readContactsFile();
  const contact = contacts.find((c) => c.id === contactId);

  return contact || null;
}

export async function removeContact(contactId) {
  const contacts = await readContactsFile();
  const index = contacts.findIndex((c) => c.id === contactId);

  if (index === -1) return null;

  const [removed] = contacts.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  return removed;
}

export async function addContact(name, email, phone) {
  const contacts = await readContactsFile();
  const newContact = {
    id: randomUUID(),
    name,
    email,
    phone,
  };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  return newContact;
}

export async function updateContact(contactId, data) {
  const contacts = await readContactsFile();
  const index = contacts.findIndex((c) => c.id === contactId);

  if (index === -1) return null;

  const updatedContact = {
    ...contacts[index],
    ...data,
  };

  contacts[index] = updatedContact;
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  return updatedContact;
}
