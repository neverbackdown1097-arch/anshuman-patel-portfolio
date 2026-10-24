"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { site } from "@/content/site";
import { limits, validateContact, type ContactErrors, type ContactInput, type ContactResponse } from "@/lib/contact";
import { Select } from "./select";

type Status = "idle" | "submitting" | "success" | "not_configured" | "failed";

const empty: ContactInput = { name: "", email: "", company: "", projectType: "", budget: "", message: "" };

/** Event other components dispatch to pre-select a project type, e.g. from Services. */
export const INQUIRE_EVENT = "portfolio:inquire";

export function inquire(projectType: string) {
  window.dispatchEvent(new CustomEvent(INQUIRE_EVENT, { detail: projectType }));
}

export function ContactForm() {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);
  const startedAt = useRef(0);
  const [values, setValues] = useState<ContactInput>(empty);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    startedAt.current = Date.now();
    const onInquire = (e: Event) => {
      const type = (e as CustomEvent<string>).detail;
      setValues((v) => ({ ...v, projectType: type }));
      window.setTimeout(() => formRef.current?.querySelector<HTMLInputElement>("input[name=name]")?.focus({ preventScroll: true }), 700);
    };
    window.addEventListener(INQUIRE_EVENT, onInquire);
    return () => window.removeEventListener(INQUIRE_EVENT, onInquire);
  }, []);

  useEffect(() => {
    if (status === "success") doneRef.current?.focus();
  }, [status]);

  const setValue = (key: keyof ContactInput, value: string) => {
    const next = { ...values, [key]: value };
    setValues(next);
    if (attempted) setErrors(validateContact(next));
  };
  const set = (key: keyof ContactInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValue(key, e.target.value);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAttempted(true);
    const found = validateContact(values);
    setErrors(found);
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name=${firstInvalid}]`)?.focus();
      return;
    }
    setStatus("submitting");
    const honeypot = (formRef.current?.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "";
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website: honeypot, startedAt: startedAt.current }),
      });
      const data = (await res.json().catch(() => null)) as ContactResponse | null;
      if (data?.ok) {
        setStatus("success");
      } else if (data && data.code === "invalid") {
        setErrors(data.errors);
        setStatus("idle");
      } else if (data?.code === "not_configured") {
        setStatus("not_configured");
      } else {
        setStatus("failed");
      }
    } catch {
      setStatus("failed");
    }
  };

  const mailto = () => {
    const body = [
      values.message,
      "",
      `— ${values.name}`,
      values.company && `Company / brand: ${values.company}`,
      values.projectType && `Project type: ${values.projectType}`,
      values.budget && `Budget: ${values.budget}`,
    ]
      .filter((l) => l !== "" && l !== undefined)
      .join("\n");
    return `mailto:${site.social.email}?subject=${encodeURIComponent(`Project enquiry — ${values.projectType || "New project"}`)}&body=${encodeURIComponent(body)}`;
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-t border-line pt-10"
        role="status"
      >
        <p className="label text-live">● Message sent</p>
        <h3 ref={doneRef} tabIndex={-1} className="display mt-6 text-5xl text-bone outline-none md:text-6xl">
          Thank you, {values.name.split(" ")[0]}.
        </h3>
        <p className="mt-6 max-w-md text-lg text-bone/80">
          Your brief is in my inbox. I&apos;ll read it properly and reply to <span className="text-bone">{values.email}</span>.
        </p>
        <button
          type="button"
          className="label link-underline mt-10 text-mute hover:text-bone"
          onClick={() => {
            setValues(empty);
            setAttempted(false);
            setErrors({});
            startedAt.current = Date.now();
            setStatus("idle");
          }}
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  const field = (key: keyof ContactInput) => ({
    id: `${id}-${key}`,
    name: key,
    value: values[key],
    onChange: set(key),
    onBlur: () => attempted && setErrors(validateContact(values)),
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `${id}-${key}-error` : undefined,
  });

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate aria-describedby={`${id}-required`} className="space-y-9">
      <p id={`${id}-required`} className="label text-dim">
        Fields marked * are required
      </p>

      <div className="grid gap-9 sm:grid-cols-2">
        <Field label="Name" required error={errors.name} htmlFor={`${id}-name`} errorId={`${id}-name-error`}>
          <input {...field("name")} type="text" autoComplete="name" maxLength={limits.name} required className={inputCls} />
        </Field>
        <Field label="Email" required error={errors.email} htmlFor={`${id}-email`} errorId={`${id}-email-error`}>
          <input {...field("email")} type="email" autoComplete="email" inputMode="email" maxLength={limits.email} required className={inputCls} />
        </Field>
        <Field label="Company or brand" optional error={errors.company} htmlFor={`${id}-company`} errorId={`${id}-company-error`}>
          <input {...field("company")} type="text" autoComplete="organization" maxLength={limits.company} className={inputCls} />
        </Field>
        <Field label="Project type" required error={errors.projectType} htmlFor={`${id}-projectType`} errorId={`${id}-projectType-error`}>
          <Select
            id={`${id}-projectType`}
            name="projectType"
            value={values.projectType}
            options={site.contact.projectTypes}
            placeholder="Select one"
            invalid={Boolean(errors.projectType)}
            describedBy={errors.projectType ? `${id}-projectType-error` : undefined}
            onChange={(v) => setValue("projectType", v)}
            onBlur={() => attempted && setErrors(validateContact(values))}
          />
        </Field>
      </div>

      <Field label="Budget range" optional error={errors.budget} htmlFor={`${id}-budget`} errorId={`${id}-budget-error`}>
        <Select
          id={`${id}-budget`}
          name="budget"
          value={values.budget}
          options={site.contact.budgets}
          placeholder="Prefer not to say"
          emptyLabel="Prefer not to say"
          onChange={(v) => setValue("budget", v)}
        />
      </Field>

      <Field label="Project description" required error={errors.message} htmlFor={`${id}-message`} errorId={`${id}-message-error`}>
        <textarea
          {...field("message")}
          rows={5}
          maxLength={limits.message}
          required
          placeholder="What are you making, who is it for, and when do you need it?"
          className={`${inputCls} resize-y leading-relaxed`}
        />
      </Field>

      {/* Honeypot: hidden from people and assistive tech, tempting to bots. */}
      <div aria-hidden className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <AnimatePresence>
        {(status === "not_configured" || status === "failed") && (
          <motion.div
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="border-l-2 border-signal bg-signal/[0.06] px-5 py-4 text-sm leading-relaxed text-bone/90">
              {status === "not_configured" ? (
                <>
                  <strong className="font-medium text-bone">Your message was not sent.</strong> The contact form hasn&apos;t
                  been connected to an inbox yet.{" "}
                </>
              ) : (
                <>
                  <strong className="font-medium text-bone">Your message was not sent.</strong> Something went wrong on the way
                  to my inbox — please try again.{" "}
                </>
              )}
              You can also{" "}
              <a href={mailto()} className="text-signal underline underline-offset-4">
                send it by email
              </a>{" "}
              — your details are already filled in.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col items-start gap-6 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status === "submitting"}
          aria-busy={status === "submitting"}
          className="label group inline-flex w-full items-center justify-center gap-4 whitespace-nowrap bg-signal px-8 py-5 text-ink transition-[background-color,transform] duration-300 hover:bg-bone active:scale-[0.98] disabled:cursor-wait disabled:opacity-70 sm:w-auto"
        >
          {status === "submitting" ? "Sending…" : "Send project brief"}
          <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">
            →
          </span>
        </button>
        <p className="text-sm text-mute">
          Prefer email?{" "}
          <a href={`mailto:${site.social.email}`} className="link-underline text-bone/90 hover:text-bone">
            {site.social.email}
          </a>
        </p>
      </div>
    </form>
  );
}

const inputCls =
  "block w-full border-0 border-b border-line bg-transparent px-0 py-3 text-lg text-bone placeholder:text-dim transition-colors duration-300 hover:border-bone/40 focus:border-signal focus:outline-none focus-visible:outline-none aria-[invalid]:border-signal";


function Field({
  label,
  required,
  optional,
  error,
  htmlFor,
  errorId,
  children,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  htmlFor: string;
  errorId: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="label flex gap-2 text-mute">
        {label}
        {required && (
          <span aria-hidden className="text-signal">
            *
          </span>
        )}
        {optional && <span className="text-dim">(optional)</span>}
      </label>
      {children}
      {error && (
        <p id={errorId} className="mt-2 text-sm text-signal">
          {error}
        </p>
      )}
    </div>
  );
}
