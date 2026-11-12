import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, X, Check } from "lucide-react";
import type { Programme } from "@/data/programmes";
import { prepareEnquiry } from "@/lib/enquiry";

export function EnrolmentDialog({
  programme,
  onClose,
}: {
  programme: Programme | null;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [draft, setDraft] = useState<ReturnType<typeof prepareEnquiry> | null>(
    null,
  );
  const [copied, setCopied] = useState("");
  const draftLink = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    if (!programme) return;
    setDraft(null);
    setCopied("");
    dialog.current?.querySelector("form")?.reset();
    if (!dialog.current?.open) dialog.current?.showModal();
    document.body.classList.add("dialog-open");
    return () => document.body.classList.remove("dialog-open");
  }, [programme]);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!programme) return;
    const fields = new FormData(event.currentTarget);
    const message = `I'd like to discuss enrolling in ${programme.interest} (listed at £${programme.price} GBP).\n\nExperience: ${fields.get("experience")}\nPhone / WhatsApp (optional): ${fields.get("phone") || "Not supplied"}\n\n${fields.get("goals")}\n\nPlease confirm availability, delivery, access, payment frequency and purchase/refund terms before enrolment.`;
    setDraft(
      prepareEnquiry({
        name: String(fields.get("name")),
        email: String(fields.get("email")),
        interest: `Enrolment — ${programme.interest}`,
        message,
      }),
    );
    requestAnimationFrame(() => draftLink.current?.focus());
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(
        `To: youvsyou@zakifx.com\n\n${draft?.body}`,
      );
      setCopied("Copied. Paste into an email and send to the academy.");
    } catch {
      setCopied(
        "Use the email draft link or email youvsyou@zakifx.com directly.",
      );
    }
  }
  return (
    <dialog
      ref={dialog}
      className="enrolment-dialog"
      aria-labelledby="enrolment-heading"
      onClose={() => {
        document.body.classList.remove("dialog-open");
        onClose();
      }}
    >
      <button
        className="icon-button privacy-close"
        aria-label="Close enrolment form"
        onClick={() => dialog.current?.close()}
      >
        <X size={25} />
      </button>
      <p className="mono">Your next step · Enrolment enquiry</p>
      <h2 id="enrolment-heading">
        Let’s get
        <br />
        <em>you started.</em>
      </h2>
      {programme && (
        <>
          <div className="selected-programme">
            <span>{programme.interest}</span>
            <strong>
              £{programme.price}
              <small> GBP</small>
            </strong>
          </div>
          <form
            className="enrolment-form"
            onSubmit={submit}
            onChange={() => {
              setDraft(null);
              setCopied("");
            }}
          >
            <div className="form-row">
              <label htmlFor="enrol-name">
                Your name
                <input
                  id="enrol-name"
                  name="name"
                  autoComplete="name"
                  placeholder="Full name"
                  required
                  maxLength={100}
                />
              </label>
              <label htmlFor="enrol-email">
                Email address
                <input
                  id="enrol-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                  maxLength={200}
                />
              </label>
            </div>
            <div className="form-row">
              <label htmlFor="enrol-phone">
                Phone / WhatsApp <span>(optional)</span>
                <input
                  id="enrol-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="Including country code"
                  maxLength={35}
                />
              </label>
              <label htmlFor="enrol-experience">
                Trading experience
                <select
                  id="enrol-experience"
                  name="experience"
                  required
                  defaultValue=""
                >
                  <option value="">Choose your starting point</option>
                  <option>New to trading</option>
                  <option>Learning the fundamentals</option>
                  <option>Some practical experience</option>
                  <option>Experienced, looking to refine</option>
                </select>
              </label>
            </div>
            <label htmlFor="enrol-goals">
              What would you like to work on?
              <textarea
                id="enrol-goals"
                name="goals"
                rows={3}
                placeholder="A little about your goals or any questions…"
                required
                maxLength={2000}
              />
            </label>
            <p className="enrolment-note">
              <Check size={13} /> No payment is taken here. The academy confirms
              availability and terms with you before enrolment.
            </p>
            <p className="enrolment-privacy">
              Your details stay on this device until you choose to send the
              prepared email to ZAKI FX.
            </p>
            <button className="button button-dark" type="submit">
              <span>Prepare enrolment enquiry</span>
              <ArrowUpRight size={20} />
            </button>
          </form>
          {draft && (
            <div className="draft-result" role="status">
              <strong>Your enrolment enquiry is ready.</strong>
              <p>
                Review and send the draft in your email app. Preparing this form
                does not send an enquiry or confirm a place.
              </p>
              <a ref={draftLink} href={draft.mailto}>
                Open email draft <ArrowUpRight size={16} />
              </a>
              <button type="button" onClick={copy}>
                Copy enquiry
              </button>
              {copied && <p>{copied}</p>}
            </div>
          )}
        </>
      )}
    </dialog>
  );
}
