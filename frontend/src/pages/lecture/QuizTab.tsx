import { useState } from 'react';
import { api } from '../../api/client';
import type { AttemptResult, QuizQuestion } from '../../api/types';
import { Icon } from '../../components/Icon';
import { useToast } from '../../context/ToastContext';
import { pct, timeAgo } from '../../lib/format';
import type { TabProps } from './types';

const LETTERS = 'ABCD';

function ScoreRing({ value }: { value: number }) {
  const c = 2 * Math.PI * 54;
  const color = value >= 70 ? '#1fa971' : value >= 40 ? '#d98e04' : '#c4262e';
  return (
    <div className="score-ring">
      <svg viewBox="0 0 132 132" width="132" height="132">
        <circle cx="66" cy="66" r="54" fill="none" stroke="#eaeef5" strokeWidth="12" />
        <circle
          cx="66"
          cy="66"
          r="54"
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${((c * value) / 100).toFixed(1)} ${c.toFixed(1)}`}
          transform="rotate(-90 66 66)"
        />
      </svg>
      <div className="num">{Math.round(value)}%</div>
    </div>
  );
}

function PracticeList({ items }: { items: { question: string; answer: string }[] }) {
  if (!items.length) return null;
  return (
    <div>
      <h3 className="mb-16">Short-answer practice</h3>
      {items.map((q, i) => (
        <details className="qa" key={i}>
          <summary>
            Q{i + 1}. {q.question}
            <Icon name="down" size={16} />
          </summary>
          <div className="ans">
            <b>Answer: </b>
            {q.answer}
          </div>
        </details>
      ))}
    </div>
  );
}

type Phase = 'intro' | 'taking' | 'result';

export function QuizTab({ id, detail, refresh, setTab }: TabProps) {
  const toast = useToast();
  const { attempts, quiz_size } = detail;
  const [phase, setPhase] = useState<Phase>('intro');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [i, setI] = useState(0);
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [busy, setBusy] = useState(false);

  const best = attempts.length ? Math.max(...attempts.map((a) => pct(a.score, a.total))) : null;

  const start = async () => {
    setBusy(true);
    try {
      const r = await api.post<{ questions: QuizQuestion[] }>(`/api/lectures/${id}/quiz`, {});
      setQuestions(r.questions);
      setAnswers(new Array(r.questions.length).fill(null));
      setI(0);
      setPhase('taking');
    } catch (e) {
      toast((e as Error).message, 'error');
    }
    setBusy(false);
  };

  const regenerate = async () => {
    setBusy(true);
    try {
      await api.post(`/api/lectures/${id}/quiz`, { regenerate: true });
      toast('New quiz questions generated', 'success');
      await refresh();
    } catch (e) {
      toast((e as Error).message, 'error');
    }
    setBusy(false);
  };

  const submit = async () => {
    setBusy(true);
    try {
      setResult(await api.post<AttemptResult>(`/api/lectures/${id}/attempts`, { answers }));
      setPhase('result');
      await refresh();
    } catch (e) {
      toast((e as Error).message, 'error');
    }
    setBusy(false);
  };

  const practice = detail.lecture.notes.practice_questions || [];

  if (phase === 'intro')
    return (
      <div>
        <div className="card card-pad mb-24">
          <div className="row spread wrap">
            <div>
              <h2>Lecture quiz</h2>
              <p className="muted" style={{ margin: '6px 0 0' }}>
                {quiz_size || 'Several'} multiple-choice questions based on this lecture. Your result is saved and shapes your revision plan.
              </p>
            </div>
            <div className="row">
              <button className="btn btn-ghost teacher-only" disabled={busy} onClick={regenerate}>
                <Icon name="refresh" size={16} />
                New questions
              </button>
              <button className="btn btn-primary btn-lg" disabled={busy} onClick={start}>
                {busy ? (
                  <>
                    <span className="spinner" />
                    Preparing…
                  </>
                ) : (
                  'Start quiz'
                )}
              </button>
            </div>
          </div>
          {attempts.length > 0 && (
            <div className="mt-24">
              <h4 className="mb-8">Your attempts{best !== null ? ` · best ${best}%` : ''}</h4>
              {attempts.map((a) => (
                <div className="attempt" key={a.id}>
                  <span className={'badge ' + (a.score / a.total >= 0.7 ? 'green' : 'amber')}>{pct(a.score, a.total)}%</span>
                  {a.score} of {a.total} correct
                  <span className="muted small" style={{ marginLeft: 'auto' }}>
                    {timeAgo(a.created)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        <PracticeList items={practice} />
      </div>
    );

  if (phase === 'taking') {
    const q = questions[i];
    const last = i === questions.length - 1;
    return (
      <div className="card card-pad">
        <div className="row spread mb-8">
          <span className="small muted">
            Question {i + 1} of {questions.length}
          </span>
          <span className="badge">{q.topic || 'Lecture'}</span>
        </div>
        <div className="progress mb-16">
          <div style={{ width: ((i + 1) / questions.length) * 100 + '%' }} />
        </div>
        <div className="quiz-q">{q.question}</div>
        {q.options.map((o, oi) => (
          <button key={oi} className={'opt' + (answers[i] === oi ? ' sel' : '')} onClick={() => setAnswers(answers.map((a, j) => (j === i ? oi : a)))}>
            <span className="k">{LETTERS[oi] || oi + 1}</span>
            <span>{o}</span>
          </button>
        ))}
        <div className="row spread mt-24">
          <button className="btn btn-ghost" disabled={i === 0} onClick={() => setI(i - 1)}>
            <Icon name="left" size={16} />
            Back
          </button>
          <button className="btn btn-primary" disabled={answers[i] === null || busy} onClick={() => (last ? submit() : setI(i + 1))}>
            {busy ? (
              <>
                <span className="spinner" />
                Scoring…
              </>
            ) : last ? (
              'Submit quiz'
            ) : (
              'Next'
            )}
          </button>
        </div>
      </div>
    );
  }

  const r = result!;
  const score = r.total ? (r.score * 100) / r.total : 0;
  const wrongTopics = [...new Set(r.details.filter((d) => !d.correct).map((d) => d.topic))];
  return (
    <div>
      <div className="card card-pad mb-24">
        <div className="row wrap" style={{ gap: 28 }}>
          <ScoreRing value={score} />
          <div className="grow">
            <h2>{score >= 80 ? 'Excellent work' : score >= 50 ? 'Good effort' : 'Keep practising'}</h2>
            <p className="muted">
              You answered {r.score} of {r.total} questions correctly.
            </p>
            {wrongTopics.length ? (
              <p className="small">
                <b>Revisit: </b>
                {wrongTopics.join(', ')}
              </p>
            ) : (
              <p className="small">No weak topics this time.</p>
            )}
            <div className="row wrap">
              <button className="btn btn-primary" onClick={() => setPhase('intro')}>
                Retake quiz
              </button>
              <button className="btn btn-outline" onClick={() => setTab('overview')}>
                Build revision plan
              </button>
              <button className="btn btn-ghost" onClick={() => setTab('flashcards')}>
                Study flashcards
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="card card-pad">
        <h3>Review your answers</h3>
        {r.details.map((d, qi) => (
          <div className="result-item" key={qi}>
            <div className="row spread mb-8">
              <b>
                {qi + 1}. {d.question}
              </b>
              <span className={'badge ' + (d.correct ? 'green' : 'amber')}>{d.correct ? 'Correct' : 'Incorrect'}</span>
            </div>
            {d.options.map((o, oi) => {
              const marked = oi === d.answer_index || oi === d.chosen;
              return (
                <div
                  key={oi}
                  className={'opt ' + (oi === d.answer_index ? 'right' : oi === d.chosen ? 'wrong' : '')}
                  style={{ cursor: 'default', background: marked ? undefined : '#fff' }}
                >
                  <span className="k">{LETTERS[oi] || oi + 1}</span>
                  <span>{o}</span>
                </div>
              );
            })}
            {d.explanation && (
              <div className="explain">
                <b>Why: </b>
                {d.explanation}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
