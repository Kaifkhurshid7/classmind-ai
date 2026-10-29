import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import { useCourses } from '../api/queries';
import type { Notes, Segment } from '../api/types';
import { Breadcrumb, EmptyState } from '../components/Common';
import { Icon } from '../components/Icon';
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

const BAR_HEIGHTS = Array.from({ length: LEVEL_BARS }, (_, i) => 8 + ((i * 7) % 5) * 5);

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

  return (
    <div className="container page">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Recording studio' }]} />
      <h1>Recording studio</h1>
      <p className="muted mt-8">Record a lecture and ClassMind will transcribe it live, then build notes, a quiz and a tutor for your students.</p>

      <div className="studio mt-24">
        <div>
          <div className="card rec-panel">
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

            <div className="rec-top">
              <div className="timer" aria-live="off">
                {fmtClock(rec.elapsed)}
              </div>
              <span className={'rec-state' + stateClass}>
                <i />
                <span>{rec.phase === 'recording' ? 'Recording' : rec.phase === 'paused' ? 'Paused' : 'Ready'}</span>
              </span>
              <div className="meter" aria-hidden="true">
                {BAR_HEIGHTS.map((h, i) => (
                  <span key={i} className={i < rec.level ? 'on' : ''} style={{ height: h }} />
                ))}
              </div>
            </div>

            <div className="row wrap mt-16">
              {idle && (
                <button className="btn btn-record btn-lg" onClick={onStart}>
                  <Icon name="mic" size={20} />
                  Start recording
                </button>
              )}
              {!idle && (
                <>
                  <button className="btn btn-ghost btn-lg" onClick={rec.pauseResume}>
                    <Icon name={rec.phase === 'paused' ? 'play' : 'pause'} size={18} />
                    {rec.phase === 'paused' ? 'Resume' : 'Pause'}
                  </button>
                  <button className="btn btn-primary btn-lg" onClick={onStop}>
                    <Icon name="square" size={16} />
                    Stop and save
                  </button>
                </>
              )}
            </div>

            {!speechSupported && (
              <div className="notice mt-16">
                <Icon name="alert" size={18} />
                Live speech-to-text is not supported in this browser. Audio will still be recorded; paste a transcript below, or use Chrome or Edge.
              </div>
            )}

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

          <details className="card" style={{ marginTop: 20 }}>
            <summary style={{ padding: '16px 20px', cursor: 'pointer', fontWeight: 700, listStyle: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon name="upload" size={18} />
              No microphone? Paste or upload a transcript instead
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
        <LiveNotes notes={liveNotes} />
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
