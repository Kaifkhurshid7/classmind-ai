import { Link } from 'react-router-dom';
import type { CourseCardData, LectureSummary } from '../api/types';
import { fmtDate, fmtDur, plural } from '../lib/format';
import { Icon, type IconName } from './Icon';

export function Thumb({ color, title, icon = 'book' }: { color?: string | null; title?: string | null; icon?: IconName }) {
  return (
    <div className="thumb" style={{ background: color || '#0056d2' }}>
      <Icon name={icon} size={22} className="corner" />
      <span>{title || ''}</span>
    </div>
  );
}

export function StatTile({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="stat">
      <div className="v">{value}</div>
      <div className="l">{label}</div>
    </div>
  );
}

export function EmptyState({ icon, title, text, action }: { icon: IconName; title: string; text?: string; action?: React.ReactNode }) {
  return (
    <div className="empty">
      <Icon name={icon} size={40} />
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {action}
    </div>
  );
}

/** Wrap case-insensitive matches in <mark>. */
export function Highlight({ text, query }: { text: string; query?: string }) {
  if (!query) return <>{text}</>;
  const parts: React.ReactNode[] = [];
  const low = text.toLowerCase();
  const ql = query.toLowerCase();
  let i = 0;
  let j: number;
  while ((j = low.indexOf(ql, i)) !== -1) {
    if (j > i) parts.push(text.slice(i, j));
    parts.push(<mark key={j}>{text.slice(j, j + query.length)}</mark>);
    i = j + query.length;
  }
  parts.push(text.slice(i));
  return <>{parts}</>;
}

export function LectureRow({ lecture: l, query }: { lecture: LectureSummary; query?: string }) {
  const summary = l.summary || '';
  return (
    <Link className="lecture-row" to={`/lecture/${l.id}`}>
      <Thumb color={l.course_color || '#4a5568'} title={l.course_name || 'Lecture'} icon="play" />
      <div className="grow">
        <h3>{l.title}</h3>
        <div className="meta-row">
          <span>{l.course_name || 'No course'}</span>
          <span>
            <Icon name="clock" size={14} />
            {fmtDur(l.duration)}
          </span>
          <span>{fmtDate(l.created)}</span>
          {l.has_audio && (
            <span>
              <Icon name="mic" size={14} />
              Audio
            </span>
          )}
        </div>
        {l.snippet ? (
          <div className="snippet">
            <Highlight text={l.snippet} query={query} />
          </div>
        ) : (
          <div className="snippet muted">{summary.slice(0, 150) + (summary.length > 150 ? '…' : '')}</div>
        )}
      </div>
      <div className="end">
        {l.best !== null ? <span className={'badge ' + (l.best >= 70 ? 'green' : 'amber')}>Quiz {l.best}%</span> : <span className="badge grey">Not attempted</span>}
      </div>
    </Link>
  );
}

export function CourseCard({ course: c }: { course: CourseCardData }) {
  return (
    <Link className="card course-card" to={`/course/${c.id}`}>
      <Thumb color={c.color} title={c.name} icon="book" />
      <div className="body">
        <h3>{c.name}</h3>
        <div className="meta">{plural(c.lectures, 'lecture') + (c.avg !== null ? ` · Quiz average ${c.avg}%` : '')}</div>
        <div className="foot">
          <div className="progress">
            <div style={{ width: c.progress + '%' }} />
          </div>
          <div className="xs muted mt-8">{c.progress}% of lectures practised</div>
        </div>
      </div>
    </Link>
  );
}

export function PageSkeleton() {
  return (
    <div className="container page">
      <div className="skeleton" style={{ height: 28, width: 260 }} />
      <div className="skeleton" style={{ height: 220, marginTop: 20 }} />
    </div>
  );
}

export function ErrorState({ message }: { message?: string }) {
  return (
    <div className="container page">
      <div className="card empty">
        <Icon name="alert" size={36} />
        <h3>Something went wrong</h3>
        <p>{message || 'Unable to load this page.'}</p>
        <Link className="btn btn-primary" to="/">
          Back to home
        </Link>
      </div>
    </div>
  );
}

export function Breadcrumb({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <div className="breadcrumb">
      {items.map((it, i) => (
        <span key={i} style={{ display: 'contents' }}>
          {i > 0 && <Icon name="right" size={14} />}
          {it.to ? <Link to={it.to}>{it.label}</Link> : it.label}
        </span>
      ))}
    </div>
  );
}

/** Query-result gate: skeleton while loading, error card on failure. */
export function Async<T>({ query, children }: { query: { data?: T; isLoading: boolean; error: Error | null }; children: (data: T) => React.ReactNode }) {
  if (query.isLoading) return <PageSkeleton />;
  if (query.error || !query.data) return <ErrorState message={query.error?.message} />;
  return <>{children(query.data)}</>;
}
