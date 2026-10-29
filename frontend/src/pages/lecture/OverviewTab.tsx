import { useState } from 'react';
import { api } from '../../api/client';
import type { RevisionPlan } from '../../api/types';
import { Icon, type IconName } from '../../components/Icon';
import { useToast } from '../../context/ToastContext';
import type { TabKey, TabProps } from './types';

const SHORTCUTS: [IconName, string, string, TabKey][] = [
  ['message', 'Ask the AI tutor', 'Get answers grounded in this lecture.', 'ask'],
  ['help', 'Take the quiz', 'Check what you remember.', 'quiz'],
  ['layers', 'Study flashcards', 'Flip through key concepts.', 'flashcards'],
];

export function OverviewTab({ id, detail, setTab }: TabProps) {
  const toast = useToast();
  const n = detail.lecture.notes || {};
  const [plan, setPlan] = useState<RevisionPlan | null>(null);
  const [busy, setBusy] = useState(false);

  const buildPlan = async () => {
    setBusy(true);
    try {
      setPlan(await api.post<RevisionPlan>(`/api/lectures/${id}/revision`));
    } catch (e) {
      toast((e as Error).message, 'error');
    }
    setBusy(false);
  };

  return (
    <div>
      <div className="card card-pad mb-24">
        <h3 className="mb-8">About this lecture</h3>
        {n.summary ? <div className="callout">{n.summary}</div> : <p className="muted">No summary yet. Generate AI notes to create one.</p>}
        {(n.key_points || []).length > 0 && (
          <>
            <h3 className="mt-24 mb-16">What you will learn</h3>
            <ul className="learn-list">
              {n.key_points!.map((p, i) => (
                <li key={i}>
                  <Icon name="checkc" size={18} />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {(n.concepts || []).length > 0 && (
        <div className="card card-pad mb-24">
          <h3 className="mb-16">Key concepts</h3>
          <div className="concept-grid">
            {n.concepts!.map((c) => (
              <div className="concept" key={c.term}>
                <b>{c.term}</b>
                <span>{c.definition}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card card-pad mb-24">
        <div className="row spread wrap">
          <div>
            <h3>Personalised revision plan</h3>
            <p className="muted small" style={{ margin: 0 }}>
              Built from your quiz results and the questions you asked the tutor.
            </p>
          </div>
          {!plan && (
            <button className="btn btn-primary" disabled={busy} onClick={buildPlan}>
              {busy ? (
                <>
                  <span className="spinner" />
                  Building…
                </>
              ) : (
                <>
                  <Icon name="target" size={16} />
                  Build my revision plan
                </>
              )}
            </button>
          )}
        </div>
        {plan && (
          <div className="mt-16">
            <div className="callout mb-16">{plan.summary}</div>
            {plan.weak_topics && plan.weak_topics.length > 0 && (
              <div className="mb-16">
                <span className="small muted">Topics to strengthen: </span>
                {plan.weak_topics.map((w) => (
                  <span key={w.topic} className="badge amber" style={{ marginRight: 6 }}>
                    {w.topic} {Math.round(w.accuracy * 100)}%
                  </span>
                ))}
              </div>
            )}
            {plan.steps.map((s, i) => (
              <div className="plan-step" key={i}>
                <div className="n">{i + 1}</div>
                <div>
                  <b>{s.title}</b>
                  <span className="small muted">{s.detail}</span>
                </div>
                <span className="badge grey">{s.minutes} min</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-3">
        {SHORTCUTS.map(([ic, t, d, to]) => (
          <button key={to} className="card card-pad" style={{ textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit' }} onClick={() => setTab(to)}>
            <div style={{ color: 'var(--brand)', marginBottom: 8 }}>
              <Icon name={ic} size={24} />
            </div>
            <h4>{t}</h4>
            <div className="small muted">{d}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
