import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { api } from '../../api/client';
import { keys, useLecture } from '../../api/queries';
import type { LectureDetail } from '../../api/types';
import { Avatar } from '../../components/Art';
import { Async, Breadcrumb } from '../../components/Common';
import { Icon, type IconName } from '../../components/Icon';
import { Menu } from '../../components/Menu';
import { Modal, useConfirm } from '../../components/Modal';
import { useToast } from '../../context/ToastContext';
import { fmtClock, fmtDate, fmtDur, pct, plural } from '../../lib/format';
import { AskTab } from './AskTab';
import { FlashcardsTab } from './FlashcardsTab';
import { NotesTab } from './NotesTab';
import { OverviewTab } from './OverviewTab';
import { QuizTab } from './QuizTab';
import { TranscriptTab } from './TranscriptTab';
import type { TabKey } from './types';

const TABS: [TabKey, string, IconName][] = [
  ['overview', 'Overview', 'grid'],
  ['notes', 'Notes', 'file'],
  ['transcript', 'Transcript', 'list'],
  ['ask', 'Ask AI tutor', 'message'],
  ['quiz', 'Quiz & practice', 'help'],
  ['flashcards', 'Flashcards', 'layers'],
];

function Sidebar({ id, detail, goTranscript }: { id: string; detail: LectureDetail; goTranscript: (t: number | null) => void }) {
  const { siblings, attempts, chat, bookmarks } = detail;
  const best = attempts.length ? Math.max(...attempts.map((a) => pct(a.score, a.total))) : null;
  return (
    <aside>
      {siblings.length > 1 && (
        <div className="card side-card">
          <h3>Course content</h3>
          {siblings.map((s) => (
            <Link key={s.id} className={'side-item' + (String(s.id) === id ? ' current' : '')} to={`/lecture/${s.id}`}>
              <div className={'dot' + (s.attempts ? ' done' : '')}>{s.attempts ? <Icon name="check" size={13} /> : null}</div>
              <div>
                {s.title}
                <span className="t">{fmtDur(s.duration) + (s.best !== null ? ` · Quiz ${s.best}%` : '')}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
      <div className="card side-card">
        <h3>Your progress</h3>
        <div className="side-item">
          <Icon name="award" size={18} />
          <div>
            {best === null ? 'No quiz taken yet' : `Best quiz score: ${best}%`}
            <span className="t">{plural(attempts.length, 'attempt')}</span>
          </div>
        </div>
        <div className="side-item">
          <Icon name="message" size={18} />
          <div>
            {chat.filter((m) => m.role === 'user').length} questions asked
            <span className="t">to the AI tutor</span>
          </div>
        </div>
        <div className="side-item">
          <Icon name="bookmark" size={18} />
          <div>{plural(bookmarks.length, 'bookmarked moment')}</div>
        </div>
      </div>
      {bookmarks.length > 0 && (
        <div className="card side-card">
          <h3>Bookmarks</h3>
          {bookmarks.map((b) => (
            <button
              key={b.id}
              className="side-item"
              style={{ width: '100%', background: 'none', border: 0, textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit' }}
              onClick={() => goTranscript(b.t)}
            >
              <Icon name="bookmark" size={16} />
              <div>
                {b.text.length > 90 ? b.text.slice(0, 90) + '…' : b.text}
                {b.t !== null && b.t !== undefined && <span className="t">{fmtClock(b.t)}</span>}
              </div>
            </button>
          ))}
        </div>
      )}
    </aside>
  );
}

function RenameDialog({ id, title, onClose, refresh }: { id: string; title: string; onClose: () => void; refresh: () => Promise<unknown> }) {
  const toast = useToast();
  const [value, setValue] = useState(title);
  return (
    <Modal
      title="Rename lecture"
      onClose={onClose}
      actions={[
        { label: 'Cancel' },
        {
          label: 'Save',
          className: 'btn-primary',
          onClick: async () => {
            if (!value.trim()) return false;
            await api.put(`/api/lectures/${id}`, { title: value.trim() });
            toast('Renamed', 'success');
            await refresh();
          },
        },
      ]}
    >
      <div className="field">
        <label>Title</label>
        <input className="input" value={value} onChange={(e) => setValue(e.target.value)} />
      </div>
    </Modal>
  );
}

export function LecturePage() {
  const { id = '' } = useParams();
  const lecture = useLecture(id);
  return <Async query={lecture}>{(detail) => <LectureView key={id} id={id} detail={detail} />}</Async>;
}

function LectureView({ id, detail }: { id: string; detail: LectureDetail }) {
  const L = detail.lecture;
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const requested = params.get('tab') as TabKey | null;
  const tab: TabKey = TABS.some((t) => t[0] === requested) ? requested! : 'overview';
  const [renaming, setRenaming] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);

  const refresh = useCallback(() => qc.invalidateQueries({ queryKey: keys.lecture(id) }), [qc, id]);
  const setTab = useCallback((t: TabKey) => setParams({ tab: t }, { replace: true }), [setParams]);
  const isPlaying = useCallback(() => !!audioRef.current && !audioRef.current.paused, []);

  const seek = useCallback(
    (t: number | null) => {
      const a = audioRef.current;
      if (a && t !== null && t !== undefined) {
        a.currentTime = t;
        a.play().catch(() => undefined);
      } else toast(a ? 'This line has no timestamp' : 'No audio was recorded for this lecture');
    },
    [toast],
  );

  const exp = (fmt: string, mode: string) => `/api/lectures/${id}/export?format=${fmt}&mode=${mode}`;
  const common = { id, detail, refresh, setTab };

  return (
    <div>
      <section className="lecture-head">
        <div className="container" style={{ paddingBottom: 22 }}>
          <Breadcrumb
            items={[{ label: 'Home', to: '/' }, ...(L.course_id ? [{ label: L.course_name || 'Course', to: `/course/${L.course_id}` }] : []), { label: 'Lecture' }]}
          />
          <div className="row spread wrap" style={{ alignItems: 'flex-start' }}>
            <div className="grow">
              <h1>{L.title}</h1>
              {L.instructor && (
                <div className="lecture-instructor">
                  <Avatar name={L.instructor} size={30} />
                  <span>
                    <b>{L.instructor}</b>
                    {L.instructor_title && <em>{L.instructor_title}</em>}
                  </span>
                </div>
              )}
              <div className="meta-row mt-8">
                {L.course_name && (
                  <span>
                    <Icon name="folder" size={15} />
                    {L.course_name}
                  </span>
                )}
                <span>
                  <Icon name="clock" size={15} />
                  {fmtDur(L.duration)}
                </span>
                <span>
                  <Icon name="file" size={15} />
                  {L.words} words
                </span>
                <span>{fmtDate(L.created)}</span>
                {L.has_audio && <span className="badge green">Audio available</span>}
              </div>
            </div>
            <div className="row wrap">
              <button className="btn btn-ghost teacher-only" title="Rename" onClick={() => setRenaming(true)}>
                <Icon name="edit" size={16} />
                Rename
              </button>
              <button
                className="btn btn-danger teacher-only"
                aria-label="Delete lecture"
                onClick={async () => {
                  if (await confirm({ title: 'Delete this lecture?', message: 'The transcript, notes, audio, chat and quiz results will be permanently removed.' })) {
                    await api.del(`/api/lectures/${id}`);
                    await qc.invalidateQueries();
                    toast('Lecture deleted');
                    navigate(L.course_id ? `/course/${L.course_id}` : '/');
                  }
                }}
              >
                <Icon name="trash" size={16} />
              </button>
              <Menu
                trigger={(toggle) => (
                  <button className="btn btn-primary" onClick={toggle}>
                    <Icon name="download" size={16} />
                    Download
                    <Icon name="down" size={14} />
                  </button>
                )}
                items={[
                  { hd: 'PDF' },
                  { label: 'Notes + transcript', icon: 'file', href: exp('pdf', 'full') },
                  { label: 'Notes only', icon: 'file', href: exp('pdf', 'notes') },
                  { label: 'Transcript only', icon: 'file', href: exp('pdf', 'transcript') },
                  '-',
                  { hd: 'Other formats' },
                  { label: 'Markdown (.md)', icon: 'download', href: exp('md', 'full') },
                  { label: 'Plain text (.txt)', icon: 'download', href: exp('txt', 'full') },
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container page">
        <div className="lecture-layout">
          <div style={{ minWidth: 0 }}>
            {L.has_audio ? (
              <div className="player">
                <div className="row" style={{ marginTop: 0, color: '#fff', fontWeight: 700 }}>
                  <Icon name="mic" size={18} />
                  Lecture recording
                </div>
                <div className="mt-8">
                  <audio
                    ref={audioRef}
                    controls
                    preload="metadata"
                    src={`/api/lectures/${id}/audio`}
                    onTimeUpdate={(e) => setCurrentTime((e.target as HTMLAudioElement).currentTime)}
                  />
                </div>
                <div className="row">
                  Speed
                  <select aria-label="Playback speed" defaultValue="1" onChange={(e) => audioRef.current && (audioRef.current.playbackRate = parseFloat(e.target.value))}>
                    {['0.75', '1', '1.25', '1.5', '2'].map((v) => (
                      <option key={v} value={v}>
                        {v}×
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="noaudio">
                <Icon name="mic" size={20} />
                This lecture has no audio recording (transcript only). Timestamps and playback are available for lectures recorded in the studio.
              </div>
            )}

            <div className="tabs" role="tablist">
              {TABS.map(([k, label, ic]) => (
                <button key={k} className={'tab' + (tab === k ? ' active' : '')} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}>
                  <Icon name={ic} size={17} />
                  {label}
                </button>
              ))}
            </div>

            {/* All tabs stay mounted so quiz progress, chat and edits survive tab switches */}
            <div>
              <div hidden={tab !== 'overview'}>
                <OverviewTab {...common} />
              </div>
              <div hidden={tab !== 'notes'}>
                <NotesTab {...common} />
              </div>
              <div hidden={tab !== 'transcript'}>
                <TranscriptTab {...common} hasAudio={L.has_audio} currentTime={currentTime} isPlaying={isPlaying} seek={seek} active={tab === 'transcript'} />
              </div>
              <div hidden={tab !== 'ask'}>
                <AskTab {...common} />
              </div>
              <div hidden={tab !== 'quiz'}>
                <QuizTab {...common} />
              </div>
              <div hidden={tab !== 'flashcards'}>
                <FlashcardsTab {...common} active={tab === 'flashcards'} />
              </div>
            </div>
          </div>
          <div className="sticky">
            <Sidebar
              id={id}
              detail={detail}
              goTranscript={(t) => {
                setTab('transcript');
                seek(t);
              }}
            />
          </div>
        </div>
      </div>
      {renaming && <RenameDialog id={id} title={L.title} refresh={refresh} onClose={() => setRenaming(false)} />}
    </div>
  );
}
