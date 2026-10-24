/** Shared contact-form contract, used by the form and the API route. */

export type ContactInput = {
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  message: string;
};

export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

export type ContactResponse =
  | { ok: true }
  | { ok: false; code: "invalid"; errors: ContactErrors }
  | { ok: false; code: "not_configured" | "delivery_failed" | "spam" };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const limits = { name: 100, email: 200, company: 120, message: 4000, minMessage: 20 };

export function validateContact(input: Partial<ContactInput>): ContactErrors {
  const e: ContactErrors = {};
  const name = input.name?.trim() ?? "";
  const email = input.email?.trim() ?? "";
  const message = input.message?.trim() ?? "";
  if (!name) e.name = "Please tell me your name.";
  else if (name.length > limits.name) e.name = "That name is a little long.";
  if (!email) e.email = "I need an email address to reply to.";
  else if (!EMAIL.test(email) || email.length > limits.email) e.email = "That email address doesn't look right.";
  if ((input.company?.length ?? 0) > limits.company) e.company = "Please shorten the company name.";
  if (!input.projectType?.trim()) e.projectType = "Choose the closest project type.";
  if (!message) e.message = "Tell me a little about the project.";
  else if (message.length < limits.minMessage)
    e.message = `A few more details, please (at least ${limits.minMessage} characters).`;
  else if (message.length > limits.message) e.message = `Please keep it under ${limits.message} characters.`;
  return e;
}
