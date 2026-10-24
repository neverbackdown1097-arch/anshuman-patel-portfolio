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
  | { ok: false; code: "not_configured" | "delivery_failed" | "spam" | "deliver_in_browser" };

/**
 * Sends a validated enquiry through FormSubmit from the browser.
 * Resolves true only when FormSubmit confirms delivery. Before the one-time
 * activation link (emailed to `to`) is clicked, it reports failure.
 */
export async function sendViaFormSubmit(to: string, data: ContactInput): Promise<boolean> {
  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      "Company / brand": data.company || "—",
      "Project type": data.projectType,
      Budget: data.budget || "—",
      message: data.message,
      _replyto: data.email,
      _subject: `New project enquiry — ${data.projectType} — ${data.name}`,
      _template: "table",
      _captcha: "false",
    }),
  });
  const out = (await res.json().catch(() => null)) as { success?: string | boolean } | null;
  return res.ok && String(out?.success) === "true";
}

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
