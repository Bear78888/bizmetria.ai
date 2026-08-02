# BizMetria Solutions Catalog — DRAFT v0.1 (awaiting owner approval)

Status: **DRAFT — prices and scope need owner sign-off before anything is shown
to a customer.** Owner directive (2026-08-02): propose popular, deliverable
solutions around answering calls, sending SMS, handling ~90% of routine email,
and pulling data from sources, combining, analyzing and reporting.

Principles (owner-approved concept):
- Curated list only: we sell exclusively what we are confident we can build.
- The paid report keeps working as a self-serve instruction; buying a solution
  saves time, it is never required.
- AI proposes which catalog item matches a recommendation; **price and scope
  come from this approved catalog, never invented per-customer by the model.**
- Delivery for every item: working build + all accesses + step-by-step PDF
  + short screencast; 1 revision round and 14 days of fix-support included.
- Customer can optionally request a call; no mandatory calls.

| # | ID | Solution | What the customer gets | Typical build | Price | Delivery |
|---|----|----------|------------------------|---------------|-------|----------|
| 1 | `intake_autoreply` | AI auto-reply to new inquiries | Every form/email inquiry answered in <1 min, 24/7, owner notified | Make + Claude + Resend | $390 | 5 business days |
| 2 | `voice_reception` | AI phone reception | Calls answered 24/7: FAQ, capture name/need/callback, SMS confirmation to caller | Retell + Twilio + Make | $1,290 | 10 business days |
| 3 | `sms_reminders` | Appointment SMS reminders | Confirm/reschedule flow that cuts no-shows | Twilio + Make + calendar | $490 | 7 business days |
| 4 | `email_assistant` | AI email assistant | Drafts or auto-sends replies to ~90% of routine mail; complex threads escalated to a human | Gmail/Outlook API + Claude | $890 | 10 business days |
| 5 | `followup_sequences` | Lead follow-up sequences | 5-touch email+SMS sequence per lead source; stops on reply | Make + Resend + Twilio | $690 | 7 business days |
| 6 | `reactivation` | Dormant-customer reactivation | One-off campaign to 6–12-month-quiet customers with response tracking | Make + Resend | $590 | 7 business days |
| 7 | `site_chatbot` | Website AI assistant | A Metria-style bot trained on the customer's business, with lead capture | Claude API + site embed | $790 | 7 business days |
| 8 | `lead_inbox` | All inquiries in one place | Forms, email, messengers land in one CRM/sheet, deduplicated, with source tags | Make + CRM/Sheets | $790 | 10 business days |
| 9 | `crm_sync` | CRM ↔ email ↔ calendar sync | End of double entry: contacts, threads and appointments stay consistent | Make + CRM APIs | $1,190 | 12 business days |
| 10 | `weekly_digest` | Weekly AI business digest | Monday email: leads, sales, reviews pulled from the customer's sources, combined and analyzed with plain-language takeaways | Make + Claude + sources | $790 | 10 business days |
| 11 | `metrics_dashboard` | Live metrics dashboard | Leads, conversion, response time from real sources on one screen | Sheets/BI + Make | $1,490 | 14 business days |
| 12 | `review_engine` | Review collection engine | Post-job review requests; unhappy customers routed to a private form first | Make + Twilio/Resend | $490 | 5 business days |
| 13 | `doc_generation` | Document auto-generation | Quotes/invoices generated from deal data into branded templates | Make + Docs API | $690 | 7 business days |

Bundle idea (upsell on checkout): any 3 solutions −15%.

Out of scope for v1 of the catalog (needs more delivery capacity first):
custom integrations with niche/legacy software, anything requiring on-site
work, solutions above ~$3,000.

Open items for the owner:
- [ ] Approve/adjust prices and the 13 items.
- [ ] Refund policy wording (suggest: full refund before work starts, 50% after).
- [ ] Who performs deliveries at volume (initially: Claude-assisted builds,
      owner reviews before handover).
