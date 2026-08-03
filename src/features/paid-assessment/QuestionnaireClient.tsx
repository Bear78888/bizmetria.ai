'use client';

import { useEffect, useRef, useState } from 'react';

import {
  label,
  optionLabels,
  prohibitedDataWarning,
  sectionTitles,
  uiCopy,
  fieldLabels,
  type Locale,
} from './copy';
import { formSections, type FieldConfig } from './form-config';
import { paidQuestionnaireSchema } from './schema';

interface QuestionnaireClientProps {
  readonly locale: Locale;
  readonly assessmentId: string;
  readonly initialData: Record<string, unknown>;
  readonly initialVersion: number;
  readonly initialStatus: string;
}

interface MetricRow {
  metric_id?: string | undefined;
  value_band_or_text?: string | undefined;
  unit?: string | undefined;
  period?: string | undefined;
  quality?: string | undefined;
}

interface StepRow {
  step_id: string;
  sequence: number;
  step_label?: string | undefined;
  owner_role?: string | undefined;
  work_mode?: string | undefined;
  system_category?: string | undefined;
}

interface InventoryRow {
  category_id?: string | undefined;
  product_label?: string | undefined;
  purpose?: string | undefined;
}

const fieldSchemas = paidQuestionnaireSchema.shape;

const EDITABLE_STATUSES = new Set(['not_started', 'in_progress', 'correction_required']);

/** A field is sent to the server only once its current value parses. */
function fieldIsValid(fieldId: string, value: unknown): boolean {
  const schema = fieldSchemas[fieldId as keyof typeof fieldSchemas];
  if (!schema) return false;
  return schema.safeParse(value).success;
}

export default function QuestionnaireClient({
  locale,
  assessmentId,
  initialData,
  initialVersion,
  initialStatus,
}: QuestionnaireClientProps) {
  const [answers, setAnswers] = useState<Record<string, unknown>>(initialData);
  const [status, setStatus] = useState(initialStatus);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [conflict, setConflict] = useState(false);
  const [rejectedFields, setRejectedFields] = useState<readonly string[]>([]);
  const [submitState, setSubmitState] = useState<'idle' | 'submitting'>('idle');
  const [submitIssues, setSubmitIssues] = useState<readonly { path: string; message: string }[]>(
    [],
  );

  const versionRef = useRef(initialVersion);
  const dirtyRef = useRef<Set<string>>(new Set());
  const savingRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Refs mirror state that timers need to read later: a debounce fires with
  // the closure of the render that armed it, and must still see the latest
  // answers and conflict flag. Both are only written in event handlers.
  const answersRef = useRef(initialData);
  const conflictRef = useRef(false);

  // Any status past the editable ones means the answers are locked in and the
  // report pipeline owns the assessment (submitted, analysing, under review).
  const submitted = !EDITABLE_STATUSES.has(status);
  const readOnly = submitted || conflict;

  // The report is generated straight from the written answers — the server
  // dedupes, so re-kicking after a reload or a lost request is harmless.
  const kickAnalysis = () => {
    void fetch('/api/paid-analysis/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assessmentId }),
    }).catch(() => undefined);
  };

  useEffect(() => {
    if (submitted) kickAnalysis();
    // Mount-only on purpose: one safety kick covers a submit whose kick was
    // lost (closed tab); later status changes kick from the submit handler.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const flush = async () => {
    if (savingRef.current || conflictRef.current) return;
    const dirty = [...dirtyRef.current];
    const fields: Record<string, unknown> = {};
    for (const fieldId of dirty) {
      const value = answersRef.current[fieldId];
      if (value !== undefined && fieldIsValid(fieldId, value)) {
        fields[fieldId] = value;
      }
    }
    if (Object.keys(fields).length === 0) return;

    savingRef.current = true;
    setSaveState('saving');
    try {
      const response = await fetch('/api/paid-assessment/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessmentId,
          expectedVersion: versionRef.current,
          fields,
        }),
      });
      const body = (await response.json()) as {
        version?: number;
        status?: string;
        rejectedFields?: string[];
        error?: string;
      };
      if (response.status === 409) {
        conflictRef.current = true;
        setConflict(true);
        setSaveState('error');
        return;
      }
      if (!response.ok) {
        setSaveState('error');
        return;
      }
      versionRef.current = body.version ?? versionRef.current;
      if (body.status) setStatus(body.status);
      setRejectedFields(body.rejectedFields ?? []);
      for (const fieldId of Object.keys(fields)) dirtyRef.current.delete(fieldId);
      setSaveState('saved');
    } catch {
      setSaveState('error');
    } finally {
      savingRef.current = false;
      if (dirtyRef.current.size > 0 && !conflictRef.current) {
        // Changes arrived while the save was in flight; queue another pass.
        timerRef.current = setTimeout(() => void flush(), 800);
      }
    }
  };

  const setField = (fieldId: string, value: unknown) => {
    setAnswers((current) => ({ ...current, [fieldId]: value }));
    answersRef.current = { ...answersRef.current, [fieldId]: value };
    dirtyRef.current.add(fieldId);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => void flush(), 1500);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const submit = async () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    await flush();
    setSubmitState('submitting');
    setSubmitIssues([]);
    try {
      const response = await fetch('/api/paid-assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentId, expectedVersion: versionRef.current }),
      });
      const body = (await response.json()) as {
        version?: number;
        status?: string;
        error?: string;
        issues?: { path: string; message: string }[];
      };
      if (response.status === 409 && body.error === 'version_conflict') {
        conflictRef.current = true;
        setConflict(true);
        return;
      }
      if (response.ok && body.status) {
        versionRef.current = body.version ?? versionRef.current;
        setStatus(body.status);
        kickAnalysis();
        return;
      }
      setSubmitIssues(body.issues ?? []);
    } finally {
      setSubmitState('idle');
    }
  };

  const text = (entry: { en: string; es: string } | undefined) => label(entry, locale);

  if (submitted) {
    return (
      <section className="result-section" aria-labelledby="questionnaire-done">
        <h1 id="questionnaire-done">{text(uiCopy.pageTitle)}</h1>
        <p role="status">{text(uiCopy.submitted)}</p>
        <a className="button button-primary" href={`/${locale}/account`}>
          {text(uiCopy.toAccount)}
        </a>
      </section>
    );
  }

  return (
    <section className="result-section questionnaire" aria-labelledby="questionnaire-heading">
      <h1 id="questionnaire-heading">{text(uiCopy.pageTitle)}</h1>
      <p>{text(uiCopy.pageIntro)}</p>
      <p className="form-message" role="note">
        {text(prohibitedDataWarning)}
      </p>

      {conflict ? (
        <div className="form-message form-message-error" role="alert">
          <p>{text(uiCopy.conflict)}</p>
          <button
            className="button button-secondary"
            onClick={() => window.location.reload()}
            type="button"
          >
            {text(uiCopy.reload)}
          </button>
        </div>
      ) : null}

      {formSections.map((section) => (
        <fieldset key={section.id} className="questionnaire-section" disabled={readOnly}>
          <legend>{text(sectionTitles[section.id])}</legend>
          {section.fields.map((field) =>
            field.visibleWhen && !field.visibleWhen(answers) ? null : (
              <FieldControlView
                key={field.id}
                field={field}
                locale={locale}
                value={answers[field.id]}
                answers={answers}
                rejected={rejectedFields.includes(field.id)}
                onChange={(value) => setField(field.id, value)}
              />
            ),
          )}
        </fieldset>
      ))}

      <div aria-live="polite" className="questionnaire-status">
        {saveState === 'saving' ? text(uiCopy.saving) : null}
        {saveState === 'saved' ? text(uiCopy.saved) : null}
        {saveState === 'error' && !conflict ? text(uiCopy.saveFailed) : null}
      </div>

      {submitIssues.length > 0 ? (
        <div className="form-message form-message-error" role="alert">
          <p>{text(uiCopy.submitInvalid)}</p>
          <ul>
            {submitIssues.map((issue) => {
              const rootField = issue.path.split('.')[0] ?? issue.path;
              return (
                <li key={`${issue.path}:${issue.message}`}>
                  {text(fieldLabels[rootField]) || rootField}
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <button
        className="button button-primary"
        disabled={readOnly || submitState === 'submitting'}
        onClick={() => void submit()}
        type="button"
      >
        {submitState === 'submitting' ? text(uiCopy.submitting) : text(uiCopy.submit)}
      </button>
    </section>
  );
}

interface FieldControlViewProps {
  readonly field: FieldConfig;
  readonly locale: Locale;
  readonly value: unknown;
  readonly answers: Record<string, unknown>;
  readonly rejected: boolean;
  readonly onChange: (value: unknown) => void;
}

function FieldControlView({
  field,
  locale,
  value,
  answers,
  rejected,
  onChange,
}: FieldControlViewProps) {
  const name = label(fieldLabels[field.id], locale);
  const optionalTag = field.required ? '' : ` (${label(uiCopy.optional, locale)})`;
  const control = field.control;

  const body = (() => {
    switch (control.kind) {
      case 'select':
        return (
          <select
            value={typeof value === 'string' ? value : ''}
            onChange={(event) => onChange(event.target.value || undefined)}
          >
            <option value="">{label(uiCopy.selectPlaceholder, locale)}</option>
            {control.options.map((option) => (
              <option key={option} value={option}>
                {label(optionLabels[control.registry]?.[option], locale) || option}
              </option>
            ))}
          </select>
        );
      case 'multi': {
        const selected = Array.isArray(value) ? (value as string[]) : [];
        return (
          <div className="checkbox-group">
            {control.options.map((option) => {
              const checked = selected.includes(option);
              return (
                <label key={option} className="checkbox-option">
                  <input
                    checked={checked}
                    disabled={!checked && selected.length >= control.max}
                    onChange={(event) => {
                      const next = event.target.checked
                        ? [...selected, option]
                        : selected.filter((item) => item !== option);
                      onChange(next.length > 0 ? next : undefined);
                    }}
                    type="checkbox"
                  />
                  {label(optionLabels[control.registry]?.[option], locale) || option}
                </label>
              );
            })}
          </div>
        );
      }
      case 'text':
        return (
          <input
            maxLength={control.maxLength}
            onChange={(event) => onChange(event.target.value || undefined)}
            type="text"
            value={typeof value === 'string' ? value : ''}
          />
        );
      case 'textarea':
        return (
          <textarea
            maxLength={control.maxLength}
            onChange={(event) => onChange(event.target.value || undefined)}
            rows={3}
            value={typeof value === 'string' ? value : ''}
          />
        );
      case 'roles': {
        const roles = Array.isArray(value) ? (value as string[]) : [];
        return (
          <RowListEditor
            addLabel={label(uiCopy.addRow, locale)}
            canAdd={roles.length < control.max}
            onAdd={() => onChange([...roles, ''])}
            removeLabel={label(uiCopy.removeRow, locale)}
            rows={roles.map((role, index) => (
              <input
                key={index}
                maxLength={80}
                onChange={(event) => {
                  const next = [...roles];
                  next[index] = event.target.value;
                  onChange(next);
                }}
                type="text"
                value={role}
              />
            ))}
            onRemove={(index) => {
              const next = roles.filter((_, i) => i !== index);
              onChange(next.length > 0 ? next : undefined);
            }}
          />
        );
      }
      case 'metrics': {
        const metrics = Array.isArray(value) ? (value as MetricRow[]) : [];
        const measureOptions = (answers.success_measure_ids as string[] | undefined) ?? [];
        const selectable = measureOptions.filter((id) => id !== 'not_currently_measured');
        return (
          <RowListEditor
            addLabel={label(uiCopy.addRow, locale)}
            canAdd={metrics.length < 5}
            onAdd={() => onChange([...metrics, { quality: 'estimated' }])}
            removeLabel={label(uiCopy.removeRow, locale)}
            rows={metrics.map((metric, index) => (
              <div key={index} className="structured-row">
                <label>
                  {label(uiCopy.metricMetric, locale)}
                  <select
                    onChange={(event) => {
                      const next = [...metrics];
                      next[index] = { ...metric, metric_id: event.target.value || undefined };
                      onChange(next);
                    }}
                    value={metric.metric_id ?? ''}
                  >
                    <option value="">{label(uiCopy.selectPlaceholder, locale)}</option>
                    {selectable.map((id) => (
                      <option key={id} value={id}>
                        {label(optionLabels.success_measure?.[id], locale) || id}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  {label(uiCopy.metricValue, locale)}
                  <input
                    maxLength={80}
                    onChange={(event) => {
                      const next = [...metrics];
                      next[index] = {
                        ...metric,
                        value_band_or_text: event.target.value || undefined,
                      };
                      onChange(next);
                    }}
                    type="text"
                    value={metric.value_band_or_text ?? ''}
                  />
                </label>
                <label>
                  {label(uiCopy.metricUnit, locale)}
                  <input
                    maxLength={40}
                    onChange={(event) => {
                      const next = [...metrics];
                      next[index] = { ...metric, unit: event.target.value || undefined };
                      onChange(next);
                    }}
                    type="text"
                    value={metric.unit ?? ''}
                  />
                </label>
                <label>
                  {label(uiCopy.metricPeriod, locale)}
                  <input
                    maxLength={40}
                    onChange={(event) => {
                      const next = [...metrics];
                      next[index] = { ...metric, period: event.target.value || undefined };
                      onChange(next);
                    }}
                    type="text"
                    value={metric.period ?? ''}
                  />
                </label>
                <label>
                  {label(uiCopy.metricQuality, locale)}
                  <select
                    onChange={(event) => {
                      const next = [...metrics];
                      next[index] = { ...metric, quality: event.target.value || undefined };
                      onChange(next);
                    }}
                    value={metric.quality ?? ''}
                  >
                    {['measured', 'estimated'].map((id) => (
                      <option key={id} value={id}>
                        {label(optionLabels.metric_quality?.[id], locale) || id}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            ))}
            onRemove={(index) => {
              const next = metrics.filter((_, i) => i !== index);
              onChange(next.length > 0 ? next : undefined);
            }}
          />
        );
      }
      case 'steps': {
        const steps = Array.isArray(value) ? (value as StepRow[]) : [];
        const resequence = (rows: StepRow[]) =>
          rows.map((row, index) => ({ ...row, sequence: index + 1 }));
        return (
          <RowListEditor
            addLabel={label(uiCopy.addRow, locale)}
            canAdd={steps.length < 12}
            onAdd={() =>
              onChange(
                resequence([
                  ...steps,
                  // §6.8: step ids are system-generated and stable within the
                  // questionnaire version.
                  {
                    step_id: `step_${crypto.randomUUID().slice(0, 8)}`,
                    sequence: steps.length + 1,
                  },
                ]),
              )
            }
            removeLabel={label(uiCopy.removeRow, locale)}
            rows={steps.map((step, index) => (
              <div key={step.step_id} className="structured-row">
                <label>
                  {label(uiCopy.stepLabel, locale)}
                  <input
                    maxLength={80}
                    onChange={(event) => {
                      const next = [...steps];
                      next[index] = { ...step, step_label: event.target.value || undefined };
                      onChange(resequence(next));
                    }}
                    type="text"
                    value={step.step_label ?? ''}
                  />
                </label>
                <label>
                  {label(uiCopy.stepOwner, locale)}
                  <input
                    maxLength={80}
                    onChange={(event) => {
                      const next = [...steps];
                      next[index] = { ...step, owner_role: event.target.value || undefined };
                      onChange(resequence(next));
                    }}
                    type="text"
                    value={step.owner_role ?? ''}
                  />
                </label>
                <label>
                  {label(uiCopy.stepWorkMode, locale)}
                  <select
                    onChange={(event) => {
                      const next = [...steps];
                      next[index] = { ...step, work_mode: event.target.value || undefined };
                      onChange(resequence(next));
                    }}
                    value={step.work_mode ?? ''}
                  >
                    <option value="">{label(uiCopy.selectPlaceholder, locale)}</option>
                    {['manual', 'mixed', 'automated'].map((id) => (
                      <option key={id} value={id}>
                        {label(optionLabels.work_mode?.[id], locale) || id}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  {label(uiCopy.stepSystem, locale)}
                  <select
                    onChange={(event) => {
                      const next = [...steps];
                      next[index] = { ...step, system_category: event.target.value || undefined };
                      onChange(resequence(next));
                    }}
                    value={step.system_category ?? ''}
                  >
                    <option value="">{label(uiCopy.selectPlaceholder, locale)}</option>
                    {Object.keys(optionLabels.system_category ?? {}).map((id) => (
                      <option key={id} value={id}>
                        {label(optionLabels.system_category?.[id], locale) || id}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            ))}
            onRemove={(index) => {
              const next = resequence(steps.filter((_, i) => i !== index));
              onChange(next.length > 0 ? next : undefined);
            }}
          />
        );
      }
      case 'inventory': {
        const items = Array.isArray(value) ? (value as InventoryRow[]) : [];
        const selectedCategories = (
          (answers.system_categories as string[] | undefined) ?? []
        ).filter((id) => id !== 'none');
        return (
          <RowListEditor
            addLabel={label(uiCopy.addRow, locale)}
            canAdd={items.length < 10 && selectedCategories.length > 0}
            onAdd={() => onChange([...items, {}])}
            removeLabel={label(uiCopy.removeRow, locale)}
            rows={items.map((item, index) => (
              <div key={index} className="structured-row">
                <label>
                  {label(uiCopy.inventoryCategory, locale)}
                  <select
                    onChange={(event) => {
                      const next = [...items];
                      next[index] = { ...item, category_id: event.target.value || undefined };
                      onChange(next);
                    }}
                    value={item.category_id ?? ''}
                  >
                    <option value="">{label(uiCopy.selectPlaceholder, locale)}</option>
                    {selectedCategories.map((id) => (
                      <option key={id} value={id}>
                        {label(optionLabels.system_category?.[id], locale) || id}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  {label(uiCopy.inventoryProduct, locale)}
                  <input
                    maxLength={80}
                    onChange={(event) => {
                      const next = [...items];
                      next[index] = { ...item, product_label: event.target.value || undefined };
                      onChange(next);
                    }}
                    type="text"
                    value={item.product_label ?? ''}
                  />
                </label>
                <label>
                  {label(uiCopy.inventoryPurpose, locale)}
                  <input
                    maxLength={120}
                    onChange={(event) => {
                      const next = [...items];
                      next[index] = { ...item, purpose: event.target.value || undefined };
                      onChange(next);
                    }}
                    type="text"
                    value={item.purpose ?? ''}
                  />
                </label>
              </div>
            ))}
            onRemove={(index) => {
              const next = items.filter((_, i) => i !== index);
              onChange(next.length > 0 ? next : undefined);
            }}
          />
        );
      }
      case 'acknowledgement':
        return (
          <label className="checkbox-option">
            <input
              checked={value === true}
              onChange={(event) => onChange(event.target.checked ? true : undefined)}
              type="checkbox"
            />
            {label(fieldLabels.prohibited_data_acknowledgement, locale)}
          </label>
        );
    }
  })();

  const isTextControl =
    control.kind === 'text' || control.kind === 'textarea' || control.kind === 'roles';

  return (
    <div className={`questionnaire-field${rejected ? ' questionnaire-field-rejected' : ''}`}>
      {control.kind === 'acknowledgement' ? (
        body
      ) : (
        <label className="questionnaire-label">
          <span>
            {name}
            {optionalTag}
          </span>
          {body}
        </label>
      )}
      {isTextControl ? <p className="field-hint">{label(prohibitedDataWarning, locale)}</p> : null}
    </div>
  );
}

interface RowListEditorProps {
  readonly rows: readonly React.ReactNode[];
  readonly addLabel: string;
  readonly removeLabel: string;
  readonly canAdd: boolean;
  readonly onAdd: () => void;
  readonly onRemove: (index: number) => void;
}

function RowListEditor({
  rows,
  addLabel,
  removeLabel,
  canAdd,
  onAdd,
  onRemove,
}: RowListEditorProps) {
  return (
    <div className="row-list">
      {rows.map((row, index) => (
        <div key={index} className="row-list-item">
          {row}
          <button className="button button-secondary" onClick={() => onRemove(index)} type="button">
            {removeLabel}
          </button>
        </div>
      ))}
      <button className="button button-secondary" disabled={!canAdd} onClick={onAdd} type="button">
        {addLabel}
      </button>
    </div>
  );
}
