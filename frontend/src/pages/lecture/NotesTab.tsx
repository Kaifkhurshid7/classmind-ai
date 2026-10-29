import { useState } from 'react';
import { api } from '../../api/client';
import type { Concept, Notes } from '../../api/types';
import { EmptyState } from '../../components/Common';
import { Icon } from '../../components/Icon';
import { useToast } from '../../context/ToastContext';
import type { TabProps } from './types';

const lines = (s: string) =>
  s
    .split('\n')
    .map((x) => x.trim())
    .filter(Boolean);

/** Regenerate notes + quiz with the AI engine. */
export function RegenerateButton({ id, refresh }: Pick<TabProps, 'id' | 'refresh'>) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  return (
    <button
      className="btn btn-outline btn-sm"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          await api.post(`/api/lectures/${id}/analyze`);
          toast('Notes and quiz regenerated', 'success');
          await refresh();
        } catch (e) {
          toast((e as Error).message, 'error');
        }
        setBusy(false);
      }}
    >
      {busy ? (
        <>
          <span className="spinner dark" />
          Analysing…
        </>
      ) : (
        <>
          <Icon name="refresh" size={14} />
          Regenerate with AI
        </>
      )}
    </button>
  );
}

interface SectionDraft {
  heading: string;
  points: string; // one per line while editing
}

function NotesEditor({ id, notes, fallbackTitle, onDone, refresh }: { id: string; notes: Notes; fallbackTitle: string; onDone: () => void; refresh: TabProps['refresh'] }) {
  const toast = useToast();
  const [title, setTitle] = useState(notes.title || fallbackTitle);
  const [summary, setSummary] = useState(notes.summary || '');
  const [points, setPoints] = useState((notes.key_points || []).join('\n'));
  const [concepts, setConcepts] = useState<Concept[]>(notes.concepts || []);
  const [sections, setSections] = useState<SectionDraft[]>((notes.sections || []).map((s) => ({ heading: s.heading, points: s.points.join('\n') })));

  const save = async () => {
    const next: Notes = {
      ...notes,
      title: title.trim() || fallbackTitle,
      summary: summary.trim(),
      key_points: lines(points),
      concepts: concepts.map((c) => ({ term: c.term.trim(), definition: c.definition.trim() })).filter((c) => c.term && c.definition),
      sections: sections.map((s) => ({ heading: s.heading.trim(), points: lines(s.points) })).filter((s) => s.heading || s.points.length),
    };
    try {
      await api.put(`/api/lectures/${id}`, { notes: next });
      toast('Notes saved', 'success');
      await refresh();
      onDone();
    } catch (e) {
      toast((e as Error).message, 'error');
    }
  };

  return (
    <div className="card card-pad">
      <div className="row spread mb-16">
        <h3>Edit notes</h3>
        <span className="small muted">Changes are saved for everyone</span>
      </div>
      <div className="field">
        <label>Title</label>
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="field">
        <label>Summary</label>
        <textarea className="input" rows={4} value={summary} onChange={(e) => setSummary(e.target.value)} />
      </div>
      <div className="field">
        <label>Key points (one per line)</label>
        <textarea className="input" rows={6} value={points} onChange={(e) => setPoints(e.target.value)} />
      </div>
      <div className="field">
        <label>Key concepts</label>
        {concepts.map((c, i) => (
          <div className="row mb-8" key={i}>
            <input
              className="input"
              placeholder="Term"
              style={{ maxWidth: 220 }}
              value={c.term}
              onChange={(e) => setConcepts(concepts.map((x, j) => (j === i ? { ...x, term: e.target.value } : x)))}
            />
            <input
              className="input"
              placeholder="Definition"
              value={c.definition}
              onChange={(e) => setConcepts(concepts.map((x, j) => (j === i ? { ...x, definition: e.target.value } : x)))}
            />
            <button className="icon-btn" title="Remove" onClick={() => setConcepts(concepts.filter((_, j) => j !== i))}>
              <Icon name="x" size={16} />
            </button>
          </div>
        ))}
        <button className="btn btn-ghost btn-sm" onClick={() => setConcepts([...concepts, { term: '', definition: '' }])}>
          <Icon name="plus" size={14} />
          Add concept
        </button>
      </div>
      <div className="field">
        <label>Detailed notes</label>
        {sections.map((s, i) => (
          <div className="card card-pad mb-16" key={i}>
            <div className="row mb-8">
              <input
                className="input"
                placeholder="Section heading"
                value={s.heading}
                onChange={(e) => setSections(sections.map((x, j) => (j === i ? { ...x, heading: e.target.value } : x)))}
              />
              <button className="icon-btn" title="Remove section" onClick={() => setSections(sections.filter((_, j) => j !== i))}>
                <Icon name="trash" size={16} />
              </button>
            </div>
            <textarea
              className="input"
              rows={4}
              placeholder="One note per line"
              value={s.points}
              onChange={(e) => setSections(sections.map((x, j) => (j === i ? { ...x, points: e.target.value } : x)))}
            />
          </div>
        ))}
        <button className="btn btn-ghost btn-sm" onClick={() => setSections([...sections, { heading: '', points: '' }])}>
          <Icon name="plus" size={14} />
          Add section
        </button>
      </div>
      <div className="row mt-24">
        <button className="btn btn-primary" onClick={save}>
          Save notes
        </button>
        <button className="btn btn-ghost" onClick={onDone}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export function NotesTab({ id, detail, refresh }: TabProps) {
  const L = detail.lecture;
  const n = L.notes || {};
  const [editing, setEditing] = useState(false);

  if (editing) return <NotesEditor id={id} notes={n} fallbackTitle={L.title} refresh={refresh} onDone={() => setEditing(false)} />;

  const hasNotes = n.summary || (n.sections || []).length;
  const bar = (
    <div className="row wrap spread mb-24">
      <div className="row">
        <span className={'badge ' + (n.engine === 'claude' ? 'green' : 'grey')}>
          {n.engine === 'claude' ? 'Generated by Claude AI' : n.engine === 'demo' ? 'Sample notes (demo)' : 'Generated by offline engine'}
        </span>
        {n.engine_note && <span className="xs muted">{n.engine_note}</span>}
      </div>
      <div className="row teacher-only">
        <button className="btn btn-ghost btn-sm" onClick={() => setEditing(true)}>
          <Icon name="edit" size={14} />
          Edit notes
        </button>
        <RegenerateButton id={id} refresh={refresh} />
      </div>
    </div>
  );

  if (!hasNotes)
    return (
      <div className="card">
        {bar}
        <EmptyState icon="file" title="No notes yet" text="Generate notes from the transcript." />
      </div>
    );

  return (
    <div className="card card-pad prose">
      {bar}
      <h2>{n.title || L.title}</h2>
      {n.summary && (
        <>
          <h3>Summary</h3>
          <div className="callout">{n.summary}</div>
        </>
      )}
      {(n.key_points || []).length > 0 && (
        <>
          <h3>Key points</h3>
          <ul>
            {n.key_points!.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </>
      )}
      {(n.concepts || []).length > 0 && (
        <>
          <h3>Key concepts</h3>
          <div className="concept-grid">
            {n.concepts!.map((c) => (
              <div className="concept" key={c.term}>
                <b>{c.term}</b>
                <span>{c.definition}</span>
              </div>
            ))}
          </div>
        </>
      )}
      {(n.sections || []).length > 0 && (
        <>
          <h3>Detailed notes</h3>
          {n.sections!.map((s, i) => (
            <div key={i}>
              <h4>{s.heading}</h4>
              <ul>
                {s.points.map((p, j) => (
                  <li key={j}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
