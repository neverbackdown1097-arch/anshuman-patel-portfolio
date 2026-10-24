import { site } from "@/content/site";
import { validateContact, type ContactInput, type ContactResponse } from "@/lib/contact";

/**
 * Contact form delivery. Configure ONE of these in your host's environment:
 *
 *   Resend (email straight to your inbox)
 *     RESEND_API_KEY      re_…
 *     CONTACT_TO_EMAIL    where enquiries go (defaults to the email in content/site.ts)
 *     CONTACT_FROM_EMAIL  a sender on a domain you verified in Resend,
 *                         e.g. "Portfolio <hello@yourdomain.com>"
 *
 *   Formspree (no domain needed)
 *     FORMSPREE_ENDPOINT  https://formspree.io/f/xxxxxxx
 *
 * With neither set, the route answers 503 "not_configured" and the form tells
 * visitors to email you directly. It never pretends a message was sent.
 */

const json = (body: ContactResponse, status = 200) => Response.json(body, { status });

export async function POST(request: Request) {
  let body: Partial<ContactInput> & { website?: string; startedAt?: number };
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, code: "invalid", errors: {} }, 400);
  }

  // Honeypot field and a minimum fill time quietly stop most bots.
  if (body.website || (body.startedAt && Date.now() - body.startedAt < 2500)) {
    return json({ ok: false, code: "spam" }, 400);
  }

  const errors = validateContact(body);
  if (Object.keys(errors).length) return json({ ok: false, code: "invalid", errors }, 400);

  const data: ContactInput = {
    name: body.name!.trim(),
    email: body.email!.trim(),
    company: body.company?.trim() ?? "",
    projectType: body.projectType!.trim(),
    budget: body.budget?.trim() ?? "",
    message: body.message!.trim(),
  };
  const subject = `New project enquiry — ${data.projectType} — ${data.name}`;
  const text = [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Company / brand: ${data.company || "—"}`,
    `Project type: ${data.projectType}`,
    `Budget: ${data.budget || "—"}`,
    "",
    data.message,
  ].join("\n");

  try {
    if (process.env.RESEND_API_KEY) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
          to: [process.env.CONTACT_TO_EMAIL ?? site.social.email],
          reply_to: data.email,
          subject,
          text,
        }),
      });
      if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
      return json({ ok: true });
    }

    if (process.env.FORMSPREE_ENDPOINT) {
      const res = await fetch(process.env.FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, _replyto: data.email, _subject: subject }),
      });
      if (!res.ok) throw new Error(`Formspree ${res.status}: ${await res.text()}`);
      return json({ ok: true });
    }
  } catch (err) {
    console.error("[contact] delivery failed", err);
    return json({ ok: false, code: "delivery_failed" }, 502);
  }

  return json({ ok: false, code: "not_configured" }, 503);
}
