import { useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../../api/client';
import type { Bookmark, Segment } from '../../api/types';
import { EmptyState, Highlight } from '../../components/Common';
import { Icon } from '../../components/Icon';
import { Modal } from '../../components/Modal';
import { useToast } from '../../context/ToastContext';
import { fmtClock, plural } from '../../lib/format';
import type { TabProps } from './types';

interface Props extends TabProps {
  hasAudio: boolean;
  currentTime: number;
  isPlaying: () => boolean;
  seek: (t: number | null) => void;
  active: boolean;
}

const bookmarkFor = (bookmarks: Bookmark[], seg: Segment) => bookmarks.find((b) => b.text === seg.text && (b.t ?? null) === (seg.t ?? null));

function EditTranscript({ id, initial, refresh, onClose }: { id: string; initial: string; refresh: TabProps['refresh']; onClose: () => void }) {
  const toast = useToast();
  const [text, setText] = useState(initial);
  return (
    <Modal
      title="Edit transcript"
      wide
      onClose={onClose}
      actions={[
        { label: 'Cancel', className: 'btn-ghost' },
        {
          label: 'Save and regenerate',
          className: 'btn-primary',
          onClick: async () => {
            if (!text.trim()) {
              toast('Transcript cannot be empty', 'error');
              return false;
            }
            try {
              await api.put(`/api/lectures/${id}`, { transcript: text });
              toast('Regenerating notes…');
              await api.post(`/api/lectures/${id}/analyze`);
              toast('Transcript updated', 'success');
              await refresh();
            } catch (e) {
              toast((e as Error).message, 'error');
              return false;
            }
          },
        },
      ]}
    >
      <div className="notice mb-16">
        <Icon name="alert" size={18} />
        Fix recognition mistakes here. Saving removes line timestamps and regenerates the notes and quiz.
      </div>
      <textarea className="input" rows={16} value={text} onChange={(e) => setText(e.target.value)} />
    </Modal>
  );
}

export function TranscriptTab({ id, detail, refresh, hasAudio, currentTime, isPlaying, seek, active }: Props) {
  const toast = useToast();
  const L = detail.lecture;
  const [input, setInput] = useState('');
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState(false);
  const activeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setQ(input.trim()), 200);
    return () => clearTimeout(t);
  }, [input]);

  const segs = useMemo(() => L.segments.filter((s) => !q || s.text.toLowerCase().includes(q.toLowerCase())), [L.segments, q]);

  // The line being spoken: the last visible line whose timestamp has passed
  let current = -1;
  segs.forEach((s, i) => {
    if (s.t !== null && s.t <= currentTime) current = i;
  });

  useEffect(() => {
    if (active && current >= 0 && isPlaying()) activeRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [current, active, isPlaying]);

  const toggleBookmark = async (seg: Segment) => {
    try {
      const existing = bookmarkFor(detail.bookmarks, seg);
      if (existing) await api.del(`/api/bookmarks/${existing.id}`);
      else await api.post(`/api/lectures/${id}/bookmarks`, { t: seg.t, text: seg.text });
      await refresh();
    } catch (e) {
      toast((e as Error).message, 'error');
    }
  };

  return (
    <div>
      <div className="tr-tools">
        <div className="grow">
          <input className="input" type="search" placeholder="Search in transcript" aria-label="Search transcript" value={input} onChange={(e) => setInput(e.target.value)} />
        </div>
        <span className="small muted">{q ? `${segs.length} ${segs.length === 1 ? 'match' : 'matches'}` : plural(L.segments.length, 'line')}</span>
        <button className="btn btn-ghost btn-sm teacher-only" onClick={() => setEditing(true)}>
          <Icon name="edit" size={14} />
          Edit transcript
        </button>
      </div>
      <div className="card" style={{ padding: 8 }}>
        {segs.length === 0 ? (
          <EmptyState icon="search" title="No matches" text="Try another keyword." />
        ) : (
          segs.map((seg, i) => {
            const marked = !!bookmarkFor(detail.bookmarks, seg);
            const untimed = seg.t === null || seg.t === undefined;
            return (
              <div key={i} className={'tr-line' + (i === current ? ' active' : '')} ref={i === current ? activeRef : undefined}>
                <button className="ts" disabled={untimed || !hasAudio} title={hasAudio ? 'Play from here' : 'No audio'} onClick={() => seek(seg.t)}>
                  {untimed ? '—' : fmtClock(seg.t)}
                </button>
                <div>
                  <Highlight text={seg.text} query={q} />
                </div>
                <button className={'icon-btn' + (marked ? ' on' : '')} title="Bookmark this moment" aria-label="Bookmark" onClick={() => toggleBookmark(seg)}>
                  <Icon name="star" size={16} />
                </button>
              </div>
            );
          })
        )}
      </div>
      {editing && <EditTranscript id={id} initial={L.transcript} refresh={refresh} onClose={() => setEditing(false)} />}
    </div>
  );
}
