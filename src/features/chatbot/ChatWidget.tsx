'use client';

import { useEffect, useRef, useState } from 'react';

import { METRIA_OPENING_MESSAGE } from './prompt';

type Locale = 'en' | 'es';

interface ChatWidgetProps {
  readonly locale: Locale;
}

interface ChatMessage {
  readonly role: 'user' | 'assistant';
  readonly content: string;
}

const copy = {
  en: {
    open: 'Chat with Metria',
    close: 'Close chat',
    title: 'Metria',
    subtitle: 'BizMetria assistant',
    placeholder: 'Ask about AI for your business…',
    send: 'Send',
    thinking: 'Metria is typing…',
    error: 'Something went wrong — please try again in a moment.',
    rateLimited: 'You have reached the chat limit for now. Please come back a bit later.',
  },
  es: {
    open: 'Chatear con Metria',
    close: 'Cerrar el chat',
    title: 'Metria',
    subtitle: 'Asistente de BizMetria',
    placeholder: 'Pregunta sobre IA para tu negocio…',
    send: 'Enviar',
    thinking: 'Metria está escribiendo…',
    error: 'Algo salió mal; inténtalo de nuevo en un momento.',
    rateLimited: 'Has alcanzado el límite del chat por ahora. Vuelve un poco más tarde.',
  },
} as const;

const INTERNAL_LINK = /\[([^\]]+)\]\((\/(?:en|es)(?:\/assessment)?)\)/g;

/** Renders assistant text, turning the two allowed internal links into anchors. */
function MessageText({ content }: { readonly content: string }) {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  for (const match of content.matchAll(INTERNAL_LINK)) {
    const [full, label, href] = match;
    const index = match.index ?? 0;
    if (index > lastIndex) parts.push(content.slice(lastIndex, index));
    parts.push(
      <a key={`${href}-${index}`} href={href}>
        {label}
      </a>,
    );
    lastIndex = index + full.length;
  }
  if (lastIndex < content.length) parts.push(content.slice(lastIndex));
  return <>{parts}</>;
}

export default function ChatWidget({ locale }: ChatWidgetProps) {
  const text = copy[locale];
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'error' | 'rate_limited'>('idle');
  const logRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [messages, status, isOpen]);

  const send = async () => {
    const content = draft.trim().slice(0, 1000);
    if (content.length === 0 || status === 'sending') return;

    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content }];
    setMessages(nextMessages);
    setDraft('');
    setStatus('sending');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Only the recent turns travel: the server caps history at 12.
        body: JSON.stringify({ messages: nextMessages.slice(-12) }),
      });
      if (response.status === 429) {
        setStatus('rate_limited');
        return;
      }
      const body = (await response.json()) as { reply?: string };
      if (!response.ok || !body.reply) {
        setStatus('error');
        return;
      }
      setMessages([...nextMessages, { role: 'assistant', content: body.reply }]);
      setStatus('idle');
    } catch {
      setStatus('error');
    }
  };

  if (!isOpen) {
    return (
      <button
        aria-label={text.open}
        className="chat-launcher"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        💬
      </button>
    );
  }

  return (
    <div aria-label={text.title} className="chat-panel" role="dialog">
      <header className="chat-header">
        <div>
          <strong>{text.title}</strong>
          <span>{text.subtitle}</span>
        </div>
        <button aria-label={text.close} onClick={() => setIsOpen(false)} type="button">
          ×
        </button>
      </header>

      <div className="chat-log" ref={logRef}>
        <div className="chat-message chat-message-assistant">{METRIA_OPENING_MESSAGE[locale]}</div>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`chat-message chat-message-${message.role === 'user' ? 'user' : 'assistant'}`}
          >
            {message.role === 'assistant' ? (
              <MessageText content={message.content} />
            ) : (
              message.content
            )}
          </div>
        ))}
        {status === 'sending' ? <div className="chat-status">{text.thinking}</div> : null}
        {status === 'error' ? (
          <div className="chat-status chat-status-error">{text.error}</div>
        ) : null}
        {status === 'rate_limited' ? (
          <div className="chat-status chat-status-error">{text.rateLimited}</div>
        ) : null}
      </div>

      <form
        className="chat-input"
        onSubmit={(event) => {
          event.preventDefault();
          void send();
        }}
      >
        <input
          maxLength={1000}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={text.placeholder}
          type="text"
          value={draft}
        />
        <button className="button button-primary" disabled={status === 'sending'} type="submit">
          {text.send}
        </button>
      </form>
    </div>
  );
}
