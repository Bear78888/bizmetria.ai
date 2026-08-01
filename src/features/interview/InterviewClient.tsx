'use client';

import { useEffect, useRef, useState } from 'react';
import { RetellWebClient } from 'retell-client-js-sdk';

type Locale = 'en' | 'es';

interface InterviewClientProps {
  readonly locale: Locale;
  readonly assessmentId: string;
}

const copy = {
  en: {
    title: 'Your assessment interview',
    disclosureHeading: 'Before we begin',
    disclosure:
      'This interview is a voice conversation with an AI interviewer in English. The call is recorded and transcribed, and the transcript is used to prepare your assessment report. It takes up to 45 minutes; you can stop at any time and start again later. "I don\'t know" is always an acceptable answer.',
    warning:
      'Do not share passwords, API keys, card or bank data, government IDs, customer lists, employee records, health data, or other sensitive records during the call.',
    consentLabel: 'I agree to this interview being recorded and transcribed.',
    start: 'Start the interview',
    connecting: 'Connecting…',
    inCall: 'Interview in progress. Speak naturally — and take your time.',
    stop: 'End the interview',
    ended:
      'The interview has ended. Your transcript is being processed; you can see your assessment status in your account.',
    account: 'Go to your account',
    failed: 'The interview could not be started. Please try again in a moment.',
    micHint: 'Your browser will ask for microphone access.',
  },
  es: {
    title: 'Su entrevista de evaluación',
    disclosureHeading: 'Antes de comenzar',
    disclosure:
      'Esta entrevista es una conversación de voz con un entrevistador de IA en español. La llamada se graba y se transcribe, y la transcripción se usa para preparar su informe de evaluación. Dura hasta 45 minutos; puede detenerla en cualquier momento y retomarla después. «No lo sé» siempre es una respuesta aceptable.',
    warning:
      'No comparta contraseñas, claves API, datos de tarjetas o bancarios, identificaciones oficiales, listas de clientes, registros de empleados, datos de salud u otra información sensible durante la llamada.',
    consentLabel: 'Acepto que esta entrevista se grabe y se transcriba.',
    start: 'Comenzar la entrevista',
    connecting: 'Conectando…',
    inCall: 'Entrevista en curso. Hable con naturalidad y tómese su tiempo.',
    stop: 'Terminar la entrevista',
    ended:
      'La entrevista ha terminado. Su transcripción se está procesando; puede ver el estado de su evaluación en su cuenta.',
    account: 'Ir a su cuenta',
    failed: 'No se pudo iniciar la entrevista. Inténtelo de nuevo en un momento.',
    micHint: 'Su navegador pedirá acceso al micrófono.',
  },
} as const;

type CallState = 'consent' | 'connecting' | 'in_call' | 'ended' | 'error';

export default function InterviewClient({ locale, assessmentId }: InterviewClientProps) {
  const text = copy[locale];
  const [consented, setConsented] = useState(false);
  const [callState, setCallState] = useState<CallState>('consent');
  const clientRef = useRef<RetellWebClient | null>(null);

  useEffect(() => {
    return () => {
      clientRef.current?.stopCall();
    };
  }, []);

  const start = async () => {
    if (!consented || callState === 'connecting' || callState === 'in_call') return;
    setCallState('connecting');
    try {
      // Consent travels explicitly; the server refuses to create a call
      // without it (PS-004 §9.1 — capture stays off until consent is true).
      const response = await fetch('/api/interview/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentId, consentGranted: true }),
      });
      const body = (await response.json()) as { accessToken?: string; error?: string };
      if (!response.ok || !body.accessToken) {
        setCallState('error');
        return;
      }

      const client = new RetellWebClient();
      clientRef.current = client;
      client.on('call_started', () => setCallState('in_call'));
      client.on('call_ended', () => setCallState('ended'));
      client.on('error', () => {
        client.stopCall();
        setCallState('error');
      });
      await client.startCall({ accessToken: body.accessToken });
    } catch {
      setCallState('error');
    }
  };

  const stop = () => {
    clientRef.current?.stopCall();
    setCallState('ended');
  };

  if (callState === 'ended') {
    return (
      <section className="result-section" aria-labelledby="interview-heading">
        <h1 id="interview-heading">{text.title}</h1>
        <p role="status">{text.ended}</p>
        <a className="button button-primary" href={`/${locale}/account`}>
          {text.account}
        </a>
      </section>
    );
  }

  if (callState === 'in_call' || callState === 'connecting') {
    return (
      <section className="result-section" aria-labelledby="interview-heading">
        <h1 id="interview-heading">{text.title}</h1>
        <p role="status">{callState === 'in_call' ? text.inCall : text.connecting}</p>
        <button className="button button-secondary" onClick={stop} type="button">
          {text.stop}
        </button>
      </section>
    );
  }

  return (
    <section className="result-section" aria-labelledby="interview-heading">
      <h1 id="interview-heading">{text.title}</h1>
      <h2>{text.disclosureHeading}</h2>
      <p>{text.disclosure}</p>
      <p className="form-message" role="note">
        {text.warning}
      </p>
      {callState === 'error' ? (
        <p className="form-message form-message-error" role="alert">
          {text.failed}
        </p>
      ) : null}
      <label className="checkbox-option">
        <input
          checked={consented}
          onChange={(event) => setConsented(event.target.checked)}
          type="checkbox"
        />
        {text.consentLabel}
      </label>
      <p className="field-hint">{text.micHint}</p>
      <button
        className="button button-primary"
        disabled={!consented}
        onClick={() => void start()}
        type="button"
      >
        {text.start}
      </button>
    </section>
  );
}
