'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { assessmentContent } from './content';
import type { PublicAssessmentResult } from './result';
import type { AssessmentLocale, QuestionId } from './schema';

const DRAFT_KEY = 'bizmetria-free-draft/free-audit-schema/1.0.0';

interface AssessmentClientProps {
  readonly locale: AssessmentLocale;
}

type SelectedAnswers = Partial<Record<QuestionId, string[]>>;

interface ContactState {
  contactName: string;
  businessName: string;
  email: string;
  website: string;
  phone: string;
  preferredLanguage: AssessmentLocale;
}

const emptyContact = (locale: AssessmentLocale): ContactState => ({
  contactName: '',
  businessName: '',
  email: '',
  website: '',
  phone: '',
  preferredLanguage: locale,
});

export function AssessmentClient({ locale }: AssessmentClientProps) {
  const router = useRouter();
  const copy = assessmentContent[locale];
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<SelectedAnswers>({});
  const [businessTypeOther, setBusinessTypeOther] = useState('');
  const [contact, setContact] = useState<ContactState>(() => emptyContact(locale));
  const [emailMarketing, setEmailMarketing] = useState(false);
  const [smsMarketing, setSmsMarketing] = useState(false);
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [validationMessage, setValidationMessage] = useState('');

  // Draft persistence: a refresh mid-questionnaire restores step, answers,
  // and contact fields. The key carries the schema version, so a schema
  // change silently discards stale drafts. Restore runs in a frame callback
  // (never synchronously inside the effect), save follows state changes.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const raw = localStorage.getItem(DRAFT_KEY);
        if (!raw) return;
        const draft = JSON.parse(raw) as {
          step?: number;
          answers?: SelectedAnswers;
          businessTypeOther?: string;
          contact?: ContactState;
        };
        if (draft.answers && typeof draft.step === 'number') {
          setAnswers(draft.answers);
          setStep(Math.max(0, Math.min(draft.step, 11)));
          if (typeof draft.businessTypeOther === 'string') {
            setBusinessTypeOther(draft.businessTypeOther);
          }
          if (draft.contact) setContact({ ...emptyContact(locale), ...draft.contact });
        }
      } catch {
        // An unreadable draft is discarded, never surfaced.
      }
    });
    return () => cancelAnimationFrame(frame);
    // Mount-only: the draft belongs to whatever locale the visitor started in.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (Object.keys(answers).length === 0 && step === 0) return;
    try {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ step, answers, businessTypeOther, contact }),
      );
    } catch {
      // Storage unavailable (private mode, quota): drafts are best-effort.
    }
  }, [step, answers, businessTypeOther, contact]);

  const question = copy.questions[step];
  const isContactStep = step === copy.questions.length;
  const progress = Math.round(
    (Math.min(step, copy.questions.length) / copy.questions.length) * 100,
  );
  const selected = useMemo(
    () => (question ? (answers[question.id] ?? []) : []),
    [answers, question],
  );

  function selectSingle(questionId: QuestionId, value: string) {
    setAnswers((current) => ({ ...current, [questionId]: [value] }));
    setValidationMessage('');
  }

  function toggleMulti(questionId: QuestionId, value: string) {
    setAnswers((current) => {
      const currentValues = current[questionId] ?? [];
      let nextValues: string[];

      if (currentValues.includes(value)) {
        nextValues = currentValues.filter((item) => item !== value);
      } else if (questionId === 'Q07' && value === 'none') {
        nextValues = ['none'];
      } else {
        nextValues = [...currentValues.filter((item) => item !== 'none'), value];
      }

      return { ...current, [questionId]: nextValues };
    });
    setValidationMessage('');
  }

  function advance() {
    if (!question) return;
    const currentAnswers = answers[question.id] ?? [];
    if (currentAnswers.length === 0) {
      setValidationMessage(question.input === 'multi' ? copy.multiRequired : copy.required);
      return;
    }

    if (
      question.id === 'Q01' &&
      currentAnswers[0] === 'other' &&
      businessTypeOther.trim().length < 2
    ) {
      setValidationMessage(copy.required);
      return;
    }

    setStep((current) => current + 1);
    setValidationMessage('');
  }

  function goBack() {
    setStep((current) => Math.max(0, current - 1));
    setValidationMessage('');
  }

  function updateContact(field: keyof ContactState, value: string) {
    setContact((current) => ({ ...current, [field]: value }));
  }

  async function submitAssessment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'submitting') return;

    setStatus('submitting');
    setValidationMessage('');

    const single = (questionId: QuestionId) => answers[questionId]?.[0];
    const payload = {
      schemaVersion: 'free-audit-schema/1.0.0',
      locale,
      idempotencyKey: crypto.randomUUID(),
      answers: {
        Q01: single('Q01'),
        ...(single('Q01') === 'other' ? { businessTypeOther: businessTypeOther.trim() } : {}),
        Q02: single('Q02'),
        Q03: single('Q03'),
        Q04: [...(answers.Q04 ?? [])].sort(),
        Q05: single('Q05'),
        Q06: single('Q06'),
        Q07: [...(answers.Q07 ?? [])].sort(),
        Q08: single('Q08'),
        Q09: single('Q09'),
        Q10: single('Q10'),
        Q11: single('Q11'),
      },
      contact,
      consent: {
        emailMarketing,
        smsMarketing,
        policyVersion: 'consent-copy/en-es/1.0.0',
      },
      companyWebsite,
    };

    try {
      const response = await fetch('/api/free-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('assessment_unavailable');
      const body = (await response.json()) as { result: PublicAssessmentResult };
      sessionStorage.setItem('bizmetria-free-result', JSON.stringify(body.result));
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {
        // Best-effort cleanup.
      }
      // A stored result gets its permanent address (works from any device and
      // from the email); preview-mode results keep the session-only screen.
      const assessmentId: string = body.result.assessmentId;
      router.push(
        /^[0-9a-f-]{36}$/iu.test(assessmentId)
          ? `/${locale}/assessment/result/${assessmentId}`
          : `/${locale}/assessment/result`,
      );
    } catch {
      setStatus('error');
      setValidationMessage(copy.submitError);
    }
  }

  return (
    <section className="assessment-shell" id="assessment-start">
      <div className="assessment-intro">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1>{copy.title}</h1>
        <p>{copy.intro}</p>
        <div className="progress-label">
          <span>
            {isContactStep
              ? copy.contactTitle
              : `${copy.progress} ${step + 1} ${copy.of} ${copy.questions.length}`}
          </span>
          <strong>{progress}%</strong>
        </div>
        <div className="progress-track" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="assessment-card">
        {!isContactStep && question ? (
          <fieldset className="question-fieldset">
            <legend>{question.title}</legend>
            {question.hint ? <p className="question-hint">{question.hint}</p> : null}
            <div className="answer-grid">
              {question.options.map((option) => {
                const checked = selected.includes(option.value);
                return (
                  <label
                    className={`answer-option${checked ? ' answer-option-selected' : ''}`}
                    key={option.value}
                  >
                    <input
                      type={question.input === 'multi' ? 'checkbox' : 'radio'}
                      name={question.id}
                      value={option.value}
                      checked={checked}
                      onChange={() =>
                        question.input === 'multi'
                          ? toggleMulti(question.id, option.value)
                          : selectSingle(question.id, option.value)
                      }
                    />
                    <span>{option.label}</span>
                  </label>
                );
              })}
            </div>
            {question.id === 'Q01' && selected[0] === 'other' ? (
              <label className="floating-field">
                <span>{copy.otherBusinessType}</span>
                <input
                  type="text"
                  minLength={2}
                  maxLength={80}
                  value={businessTypeOther}
                  onChange={(event) => setBusinessTypeOther(event.target.value)}
                />
              </label>
            ) : null}
            {validationMessage ? (
              <p className="validation-message" role="alert">
                {validationMessage}
              </p>
            ) : null}
            <div className="assessment-actions">
              {step > 0 ? (
                <button className="button button-secondary" type="button" onClick={goBack}>
                  {copy.back}
                </button>
              ) : (
                <span />
              )}
              <button className="button button-primary" type="button" onClick={advance}>
                {copy.next}
              </button>
            </div>
          </fieldset>
        ) : (
          <form className="contact-form" onSubmit={submitAssessment}>
            <div>
              <h2>{copy.contactTitle}</h2>
              <p>{copy.contactIntro}</p>
            </div>
            <div className="contact-grid">
              <label>
                <span>{copy.contactName}</span>
                <input
                  required
                  minLength={2}
                  maxLength={100}
                  autoComplete="name"
                  value={contact.contactName}
                  onChange={(event) => updateContact('contactName', event.target.value)}
                />
              </label>
              <label>
                <span>{copy.businessName}</span>
                <input
                  required
                  minLength={2}
                  maxLength={140}
                  autoComplete="organization"
                  value={contact.businessName}
                  onChange={(event) => updateContact('businessName', event.target.value)}
                />
              </label>
              <label>
                <span>{copy.email}</span>
                <input
                  required
                  type="email"
                  maxLength={254}
                  autoComplete="email"
                  value={contact.email}
                  onChange={(event) => updateContact('email', event.target.value)}
                />
              </label>
              <label>
                <span>{copy.website}</span>
                <input
                  type="url"
                  autoComplete="url"
                  placeholder="https://"
                  value={contact.website}
                  onChange={(event) => updateContact('website', event.target.value)}
                />
              </label>
              <label>
                <span>{copy.phone}</span>
                <input
                  type="tel"
                  autoComplete="tel"
                  value={contact.phone}
                  onChange={(event) => updateContact('phone', event.target.value)}
                />
              </label>
              <label>
                <span>{locale === 'es' ? 'Idioma preferido' : 'Preferred language'}</span>
                <select
                  value={contact.preferredLanguage}
                  onChange={(event) =>
                    updateContact('preferredLanguage', event.target.value as AssessmentLocale)
                  }
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </label>
            </div>
            <label className="consent-option">
              <input
                type="checkbox"
                checked={emailMarketing}
                onChange={(event) => setEmailMarketing(event.target.checked)}
              />
              <span>{copy.emailConsent}</span>
            </label>
            <label className="consent-option">
              <input
                type="checkbox"
                checked={smsMarketing}
                onChange={(event) => setSmsMarketing(event.target.checked)}
              />
              <span>{copy.smsConsent}</span>
            </label>
            <p className="service-notice">{copy.serviceNotice}</p>
            <p className="service-notice">
              <Link href={`/${locale}/privacy`}>
                {locale === 'es' ? 'Política de privacidad' : 'Privacy Policy'}
              </Link>
            </p>
            <label className="honeypot" aria-hidden="true">
              Company website
              <input
                name="companyWebsite"
                tabIndex={-1}
                autoComplete="off"
                value={companyWebsite}
                onChange={(event) => setCompanyWebsite(event.target.value)}
              />
            </label>
            {validationMessage ? (
              <p className="validation-message" role="alert">
                {validationMessage}
              </p>
            ) : null}
            <div className="assessment-actions">
              <button className="button button-secondary" type="button" onClick={goBack}>
                {copy.back}
              </button>
              <button
                className="button button-primary"
                type="submit"
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? copy.submitting : copy.submit}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
