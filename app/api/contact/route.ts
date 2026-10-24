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
 *   FormSubmit (default, nothing to configure)
 *     Sends to CONTACT_TO_EMAIL or the email in content/site.ts. Click the
 *     one-time "Activate form" email FormSubmit sends you. Set
 *     FORMSUBMIT_DISABLED=1 to turn it off.
 *
 * If delivery fails the form tells visitors their message was NOT sent and
 * offers a pre-filled email instead. It never pretends a message was sent.
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

    // Default: FormSubmit (no account or key). The first message to a new
    // address triggers a one-time "Activate form" email; until that link is
    // clicked FormSubmit reports failure, and so do we.
    const to = process.env.CONTACT_TO_EMAIL ?? site.social.email;
    if (to && process.env.FORMSUBMIT_DISABLED !== "1") {
      const origin = new URL(request.url).origin;
      const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Origin: origin,
          Referer: `${origin}/`,
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          "Company / brand": data.company || "—",
          "Project type": data.projectType,
          Budget: data.budget || "—",
          message: data.message,
          _replyto: data.email,
          _subject: subject,
          _template: "table",
          _captcha: "false",
        }),
      });
      const out = (await res.json().catch(() => null)) as { success?: string | boolean; message?: string } | null;
      if (!res.ok || String(out?.success) !== "true") throw new Error(`FormSubmit ${res.status}: ${out?.message ?? "no body"}`);
      return json({ ok: true });
    }
  } catch (err) {
    console.error("[contact] delivery failed", err);
    return json({ ok: false, code: "delivery_failed" }, 502);
  }

  return json({ ok: false, code: "not_configured" }, 503);
}
