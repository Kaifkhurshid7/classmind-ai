import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import { useCourses } from '../api/queries';
import type { Notes, Segment } from '../api/types';
import { Breadcrumb, EmptyState } from '../components/Common';
import { StudioArt } from '../components/Art';
import { Icon, type IconName } from '../components/Icon';
import { Modal } from '../components/Modal';
import { Select } from '../components/Select';
import { useRole } from '../context/RoleContext';
import { useToast } from '../context/ToastContext';
import { LEVEL_BARS, speechSupported, useRecorder } from '../hooks/useRecorder';
import { fmtClock } from '../lib/format';

const LANGUAGES: [string, string][] = [
  ['en-IN', 'English (India)'],
  ['en-US', 'English (US)'],
  ['en-GB', 'English (UK)'],
  ['hi-IN', 'Hindi'],
  ['or-IN', 'Odia'],
];

/** 60 bars around the record button; delay, speed and height vary so the ring looks organic. */
const RING = Array.from({ length: 60 }, (_, i) => ({
  i,
  angle: (i * 360) / 60,
  delay: ((i * 37) % 11) * 0.06,
  dur: 0.55 + ((i * 17) % 7) * 0.09,
  scale: 0.55 + ((i * 13) % 9) * 0.07,
}));

function LiveNotes({ notes }: { notes: Notes | null }) {
  if (!notes)
    return (
      <div className="card live-notes">
        <h3>Live notes</h3>
        <p className="muted small mt-8">Notes, key terms and the main points build up here while you speak.</p>
        <div className="empty" style={{ padding: '30px 0' }}>
          <Icon name="file" size={32} />
        </div>
      </div>
    );
  return (
    <div className="card live-notes">
      <div className="row spread">
        <h3>Live notes</h3>
        <span className="badge green">Updating</span>
      </div>
      <h4>Topic</h4>
      <div style={{ fontWeight: 700 }}>{notes.title}</div>
      {notes.summary && (
        <>
          <h4>Summary so far</h4>
          <p className="small" style={{ margin: 0 }}>
            {notes.summary}
          </p>
        </>
      )}
      {(notes.concepts || []).length > 0 && (
        <>
          <h4>Key terms</h4>
          <div className="terms">
            {notes.concepts!.slice(0, 8).map((c) => (
              <span className="badge" key={c.term}>
                {c.term}
              </span>
            ))}
          </div>
        </>
      )}
      {(notes.key_points || []).length > 0 && (
        <>
          <h4>Main points</h4>
          <ul>
            {notes.key_points!.slice(0, 4).map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

const STEPS = ['Set up', 'Record', 'Review and publish'];

type Level = 'ok' | 'warn' | 'bad';

/** Live readiness checks: microphone permission and network status. */
function usePreflight() {
  const [mic, setMic] = useState<PermissionState | 'unknown'>('unknown');
  const [online, setOnline] = useState(typeof navigator === 'undefined' ? true : navigator.onLine);

  useEffect(() => {
    let status: PermissionStatus | undefined;
    navigator.permissions
      ?.query({ name: 'microphone' as PermissionName })
      .then((s) => {
        status = s;
        setMic(s.state);
        s.onchange = () => setMic(s.state);
      })
      .catch(() => undefined);
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
      if (status) status.onchange = null;
    };
  }, []);

  return { mic, online };
}

function PreflightCard({ mic, online, language }: { mic: PermissionState | 'unknown'; online: boolean; language: string }) {
  const items: { level: Level; title: string; text: string }[] = [
    speechSupported
      ? { level: 'ok', title: 'Live transcription', text: 'Supported in this browser.' }
      : { level: 'warn', title: 'Live transcription', text: 'Not supported here. Use Chrome or Edge; audio is still recorded.' },
    mic === 'granted'
      ? { level: 'ok', title: 'Microphone', text: 'Access allowed.' }
      : mic === 'denied'
        ? { level: 'bad', title: 'Microphone', text: 'Blocked. Allow it from the address bar, then reload.' }
        : { level: 'warn', title: 'Microphone', text: 'Your browser will ask for permission when you start.' },
    online ? { level: 'ok', title: 'Internet', text: 'Connected (needed for live transcription).' } : { level: 'bad', title: 'Internet', text: 'Offline. Live transcription needs a connection.' },
    { level: 'ok', title: 'Language', text: `${language}. Change it above if you speak another language.` },
  ];
  const icon: Record<Level, IconName> = { ok: 'checkc', warn: 'alert', bad: 'x' };
  return (
    <div className="card side-box">
      <h3>Pre-flight check</h3>
      <ul className="preflight">
        {items.map((it) => (
          <li key={it.title} className={it.level}>
            <span>
              <Icon name={icon[it.level]} size={16} />
            </span>
            <div>
              <b>{it.title}</b>
              <em>{it.text}</em>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TipsCard() {
  const tips = [
    'Keep the microphone about a hand-span from your mouth.',
    'Choose a quiet room and close doors and windows.',
    'Speak at a steady pace and pause between ideas.',
    'Say key terms clearly; they become concepts and flashcards.',
    'Say names and formulas out loud once so they are captured.',
  ];
  return (
    <div className="card side-box">
      <h3>Tips for a great recording</h3>
      <ol className="tips">
        {tips.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ol>
    </div>
  );
}

export function Studio() {
  const { isTeacher, setRole } = useRole();
  if (!isTeacher)
    return (
      <div className="container page">
        <div className="card">
          <EmptyState
            icon="mic"
            title="Recording is a teacher feature"
            text="Switch to Teacher mode (top right) to record lectures."
            action={
              <button className="btn btn-primary" onClick={() => setRole('teacher')}>
                Switch to Teacher
              </button>
            }
          />
        </div>
      </div>
    );
  return <StudioView />;
}

function StudioView() {
  const toast = useToast();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [params] = useSearchParams();
  const courses = useCourses();

  const today = new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  const [title, setTitle] = useState('Lecture · ' + today);
  const [courseId, setCourseId] = useState(params.get('course') || '');
  const [lang, setLang] = useState('en-IN');
  const [pasted, setPasted] = useState('');
  const [processing, setProcessing] = useState<string | null>(null);
  const [liveNotes, setLiveNotes] = useState<Notes | null>(null);

  const rec = useRecorder(lang, toast);
  const pre = usePreflight();
  const getTextRef = useRef(rec.getText);
  getTextRef.current = rec.getText;
  const liveBoxRef = useRef<HTMLDivElement>(null);
  const lastLenRef = useRef(0);
  const busyRef = useRef(false);

  // Follow the transcript as it grows
  useEffect(() => {
    const el = liveBoxRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [rec.segments.length]);

  // Refresh the live notes every 8 seconds while there is enough new text
  useEffect(() => {
    if (rec.phase !== 'recording') return;
    const timer = setInterval(async () => {
      const text = getTextRef.current();
      if (busyRef.current || text.length < lastLenRef.current + 60) return;
      busyRef.current = true;
      lastLenRef.current = text.length;
      try {
        setLiveNotes(await api.post<Notes>('/api/analyze', { transcript: text, live: true }));
      } catch {
        /* ignore transient errors */
      }
      busyRef.current = false;
    }, 8000);
    return () => clearInterval(timer);
  }, [rec.phase]);

  const saveLecture = async (transcript: string, segments: Segment[], duration: number, blob: Blob | null) => {
    const text = transcript.trim();
    if (!text) {
      toast('No speech was captured. Paste a transcript below, or record again.', 'error', 5000);
      return;
    }
    setProcessing('Saving your lecture…');
    try {
      const res = await api.post<{ id: number }>('/api/lectures', {
        title: title.trim(),
        course_id: courseId ? parseInt(courseId, 10) : null,
        transcript: text,
        segments,
        duration,
        lang,
      });
      if (blob) {
        setProcessing('Uploading audio…');
        const fd = new FormData();
        fd.append('audio', blob, 'lecture.' + (blob.type.includes('ogg') ? 'ogg' : blob.type.includes('mp4') ? 'm4a' : 'webm'));
        await api.upload(`/api/lectures/${res.id}/audio`, fd).catch(() => toast('Audio upload failed; transcript was saved.', 'error'));
      }
      setProcessing('Generating notes, quiz and key concepts…');
      await api.post(`/api/lectures/${res.id}/analyze`).catch(() => toast('Saved. AI notes can be regenerated from the lecture page.'));
      await qc.invalidateQueries();
      setProcessing(null);
      toast('Lecture saved', 'success');
      navigate(`/lecture/${res.id}`);
    } catch (e) {
      setProcessing(null);
      toast((e as Error).message, 'error');
    }
  };

  const onStart = async () => {
    lastLenRef.current = 0;
    setLiveNotes(null);
    if (await rec.start()) liveBoxRef.current?.scrollTo(0, 0);
  };
  const onStop = async () => {
    const r = await rec.stop();
    await saveLecture(
      r.segments.map((s) => s.text).join(' '),
      r.segments,
      r.duration,
      r.blob,
    );
  };

  const onFile = async (f: File | undefined) => {
    if (!f) return;
    if (f.size > 2e6) return toast('File is too large (max 2 MB)', 'error');
    setPasted(await f.text());
    toast('Text file loaded');
  };

  const idle = rec.phase === 'idle';
  const stateClass = rec.phase === 'recording' ? ' live' : rec.phase === 'paused' ? ' paused' : '';
  const step = processing ? 3 : idle ? 1 : 2;
  const langLabel = LANGUAGES.find(([v]) => v === lang)?.[1] ?? lang;
  const wordCount = rec.segments.reduce((n, s) => n + s.text.split(/\s+/).filter(Boolean).length, 0);
  // speaking pace: only meaningful after a little speech has been captured
  const pace = wordCount >= 8 && rec.elapsed >= 10 ? Math.round(wordCount / (rec.elapsed / 60)) : null;

  return (
    <div>
      <section className="studio-hero">
        <div className="container studio-hero-inner">
          <div>
            <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Recording studio' }]} />
            <h1>Recording studio</h1>
            <p>Record a lecture and ClassMind transcribes it live, then builds notes, a quiz and an AI tutor for your students.</p>
            <ol className="studio-steps" aria-label="Progress">
              {STEPS.map((label, i) => (
                <li key={label} className={step === i + 1 ? 'active' : step > i + 1 ? 'done' : ''}>
                  <span>{step > i + 1 ? <Icon name="check" size={14} /> : i + 1}</span>
                  {label}
                </li>
              ))}
            </ol>
          </div>
          <div className="studio-hero-art">
            <StudioArt />
          </div>
        </div>
      </section>

      <div className="container page studio-page">
        <div className="studio">
          <div>
            <div className="card rec-panel">
              <div className="rec-section-title">
                <span>1</span>
                Lecture details
              </div>
              <div className="row wrap mb-16">
                <div className="field grow" style={{ margin: 0, minWidth: 220 }}>
                  <label>Lecture title</label>
                  <input className="input" aria-label="Lecture title" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="field" style={{ margin: 0, minWidth: 180 }}>
                  <label>Course</label>
                  <Select
                    ariaLabel="Course"
                    width="100%"
                    value={courseId}
                    onChange={setCourseId}
                    options={[{ value: '', label: 'No course' }, ...(courses.data ?? []).map((c) => ({ value: String(c.id), label: c.name, hint: c.instructor || undefined, color: c.color }))]}
                  />
                </div>
                <div className="field" style={{ margin: 0, minWidth: 150 }}>
                  <label>Language</label>
                  <Select
                    ariaLabel="Speech language"
                    width="100%"
                    value={lang}
                    onChange={(v) => {
                      setLang(v);
                      // recognition reads the language from a ref updated on the next render
                      setTimeout(rec.restartRecognition, 0);
                    }}
                    options={LANGUAGES.map(([value, label]) => ({ value, label }))}
                  />
                </div>
              </div>

              <div className="rec-section-title">
                <span>2</span>
                Record
              </div>
              <div className={'rec-stage ' + rec.phase}>
                <div className="rec-stage-head">
                  <span className={'rec-state' + stateClass}>
                    <i />
                    <span>{rec.phase === 'recording' ? 'Recording' : rec.phase === 'paused' ? 'Paused' : 'Ready to record'}</span>
                  </span>
                  <span className="rec-lang">
                    <Icon name="globe" size={14} />
                    {langLabel}
                  </span>
                </div>

                <div className="rec-ring" style={{ ['--lvl' as string]: Math.min(1, rec.level / LEVEL_BARS) } as CSSProperties} aria-hidden={idle ? undefined : true}>
                  {RING.map((b) => (
                    <i key={b.i} style={{ ['--a' as string]: `${b.angle}deg`, ['--d' as string]: `${b.delay}s`, ['--dur' as string]: `${b.dur}s`, ['--s' as string]: b.scale } as CSSProperties}>
                      <b />
                    </i>
                  ))}
                  <button
                    className="rec-core"
                    onClick={idle ? onStart : rec.pauseResume}
                    aria-label={idle ? 'Start recording' : rec.phase === 'paused' ? 'Resume recording' : 'Pause recording'}
                  >
                    <Icon name={idle ? 'mic' : rec.phase === 'paused' ? 'play' : 'pause'} size={44} />
                  </button>
                </div>

                <div className="timer" aria-live="off">
                  {fmtClock(rec.elapsed)}
                </div>
                <p className="rec-hint">
                  {idle ? 'Tap the microphone to start. You can pause at any time.' : rec.phase === 'paused' ? 'Paused. Tap the button or Resume to continue.' : 'Listening… speak naturally. Notes build up on the right.'}
                </p>

                {idle ? null : (
                  <div className="rec-actions">
                    <button className="rec-pill" onClick={rec.pauseResume}>
                      <Icon name={rec.phase === 'paused' ? 'play' : 'pause'} size={17} />
                      {rec.phase === 'paused' ? 'Resume' : 'Pause'}
                    </button>
                    <button className="rec-pill primary" onClick={onStop}>
                      <Icon name="square" size={15} />
                      Stop and save
                    </button>
                  </div>
                )}

                <div className="rec-mini">
                  <div>
                    <b>{rec.segments.length}</b>
                    <span>Lines</span>
                  </div>
                  <div>
                    <b>{wordCount}</b>
                    <span>Words</span>
                  </div>
                  <div>
                    <b>{pace === null ? '–' : pace}</b>
                    <span>Words per minute</span>
                  </div>
                </div>
              </div>

              {!speechSupported && (
                <div className="notice mt-16">
                  <Icon name="alert" size={18} />
                  Live speech-to-text is not supported in this browser. Audio will still be recorded; paste a transcript below, or use Chrome or Edge.
                </div>
              )}

              <div className="live-head">
                <b>Live transcript</b>
                <span>
                  {rec.segments.length} {rec.segments.length === 1 ? 'line' : 'lines'} · {wordCount} words
                </span>
              </div>
              <div className="live-box" aria-live="polite" ref={liveBoxRef}>
                {rec.segments.length === 0 && idle ? (
                  <div className="empty">
                    <Icon name="mic" size={34} />
                    <h3>Your transcript will appear here</h3>
                    <p className="small">Press Start recording and begin speaking.</p>
                  </div>
                ) : rec.segments.length === 0 && !rec.interim ? (
                  <div className="empty" style={{ padding: '90px 20px' }}>
                    <Icon name="mic" size={34} />
                    <p>Listening… start speaking.</p>
                  </div>
                ) : (
                  rec.segments.map((s, i) => (
                    <div className="tr-line" key={i} style={{ gridTemplateColumns: '62px 1fr' }}>
                      <span className="ts" style={{ cursor: 'default' }}>
                        {fmtClock(s.t)}
                      </span>
                      <div>{s.text}</div>
                    </div>
                  ))
                )}
                <div className="interim">{rec.interim}</div>
              </div>
            </div>

            <details className="card paste-card">
              <summary>
                <span className="feature-icon">
                  <Icon name="upload" size={18} />
                </span>
                <span>
                  <b>No microphone? Paste or upload a transcript instead</b>
                  <em>Create a lecture from text and get the same notes, quiz and tutor.</em>
                </span>
              </summary>
              <div style={{ padding: '0 20px 20px' }}>
                <textarea className="input" rows={7} placeholder="Paste or type the lecture text here…" value={pasted} onChange={(e) => setPasted(e.target.value)} />
                <div className="row wrap mt-16">
                  <label className="btn btn-ghost" htmlFor="txtfile" style={{ cursor: 'pointer' }}>
                    <Icon name="upload" size={16} />
                    Upload .txt file
                  </label>
                  <input type="file" accept=".txt,text/plain" className="sr-only" id="txtfile" onChange={(e) => onFile(e.target.files?.[0])} />
                  <button
                    className="btn btn-outline"
                    onClick={() => {
                      const t = pasted.trim();
                      saveLecture(t, [], Math.round(t.split(/\s+/).length / 2.6), null);
                    }}
                  >
                    Create lecture from this text
                  </button>
                </div>
              </div>
            </details>
          </div>

          <aside className="studio-side">
            <LiveNotes notes={liveNotes} />
            <PreflightCard mic={pre.mic} online={pre.online} language={langLabel} />
            <TipsCard />
          </aside>
        </div>
      </div>

      {processing && (
        <Modal title="Processing lecture" wide onClose={() => undefined}>
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <span className="spinner dark" style={{ width: 34, height: 34 }} />
            <h3 className="mt-16">Please wait</h3>
            <p className="muted">{processing}</p>
          </div>
        </Modal>
      )}
    </div>
  );
}
