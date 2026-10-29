import { useEffect, useRef, useState } from 'react';
import { api } from '../../api/client';
import { useConfirm } from '../../components/Modal';
import { Select } from '../../components/Select';
import { useRole } from '../../context/RoleContext';
import { useToast } from '../../context/ToastContext';
import type { TabProps } from './types';

interface Msg {
  role: 'user' | 'ai';
  text: string;
}

const GREETING: Msg = {
  role: 'ai',
  text: 'Hi, I am your lecture tutor. I answer from what was taught in this lecture. Ask me a question, or pick a suggestion below.',
};

export function AskTab({ id, detail, refresh }: TabProps) {
  const toast = useToast();
  const confirm = useConfirm();
  const { displayName } = useRole();
  // Seeded once from the saved chat; later updates are appended locally
  const [messages, setMessages] = useState<Msg[]>(() => [GREETING, ...detail.chat.map((m): Msg => ({ role: m.role === 'user' ? 'user' : 'ai', text: m.content }))]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('');
  const [busy, setBusy] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const savedCount = detail.chat.length;

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  async function send(question: string, m: string) {
    const text = question.trim();
    if (!text || busy) return;
    setBusy(true);
    setInput('');
    setMessages((cur) => [...cur, { role: 'user', text }, { role: 'ai', text: 'Thinking…' }]);
    let answer: string;
    try {
      answer = (await api.post<{ answer: string }>(`/api/lectures/${id}/ask`, { question: text, mode: m })).answer;
      refresh();
    } catch (e) {
      answer = 'Sorry, that did not work: ' + (e as Error).message;
    }
    setMessages((cur) => [...cur.slice(0, -1), { role: 'ai', text: answer }]);
    setBusy(false);
  }

  const concepts = (detail.lecture.notes.concepts || []).slice(0, 3);
  const initial = (displayName[0] || 'U').toUpperCase();

  return (
    <div className="card chat">
      <div className="row spread" style={{ padding: '14px 18px', borderBottom: '1px solid var(--line)' }}>
        <h3 style={{ fontSize: 16 }}>AI tutor · answers from this lecture</h3>
        {savedCount > 0 && (
          <button
            className="link-btn small"
            onClick={async () => {
              if (await confirm({ title: 'Clear conversation?', message: 'This removes the saved chat for this lecture.', okLabel: 'Clear' })) {
                await api.del(`/api/lectures/${id}/chat`);
                setMessages([GREETING]);
                await refresh();
              }
            }}
          >
            Clear chat
          </button>
        )}
      </div>
      <div className="chat-log" aria-live="polite" ref={logRef}>
        {messages.map((m, i) => (
          <div className={'msg ' + m.role} key={i}>
            <div className="av">{m.role === 'ai' ? 'AI' : initial}</div>
            <div>
              <div className="bubble">{m.text}</div>
              {m.role === 'ai' && i > 0 && (
                <button
                  className="link-btn xs tools"
                  title="Copy answer"
                  onClick={() => {
                    navigator.clipboard?.writeText(m.text).then(() => toast('Copied'), () => undefined);
                  }}
                >
                  Copy
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="chat-foot">
        <div className="chips">
          {concepts.map((c) => (
            <button key={c.term} className="chip" onClick={() => send(`What is ${c.term.toLowerCase()}?`, mode)}>
              What is {c.term.toLowerCase()}?
            </button>
          ))}
          <button className="chip" onClick={() => send('Summarise this lecture', 'summary')}>
            Summarise this lecture
          </button>
        </div>
        <div className="askbar">
          <input
            className="input"
            placeholder="Ask a question about this lecture…"
            aria-label="Your question"
            autoComplete="off"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send(input, mode)}
          />
          <Select
            ariaLabel="Answer style"
            width={190}
            value={mode}
            onChange={setMode}
            options={[
              { value: '', label: 'Normal answer' },
              { value: 'simple', label: 'Explain simply' },
              { value: 'example', label: 'Give an example' },
            ]}
          />
          <button className="btn btn-primary" disabled={busy} onClick={() => send(input, mode)}>
            Ask
          </button>
        </div>
      </div>
    </div>
  );
}
