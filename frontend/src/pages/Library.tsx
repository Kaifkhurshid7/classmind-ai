import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCourses, useLectures } from '../api/queries';
import { Breadcrumb, EmptyState, LectureRow } from '../components/Common';
import { Select } from '../components/Select';
import { plural } from '../lib/format';

type Sort = 'new' | 'old' | 'title' | 'score';

export function Library() {
  const [params] = useSearchParams();
  const urlQuery = params.get('q') || '';
  const [input, setInput] = useState(urlQuery);
  const [q, setQ] = useState(urlQuery);
  const [course, setCourse] = useState(params.get('course') || '');
  const [sort, setSort] = useState<Sort>('new');
  const courses = useCourses();
  const lectures = useLectures(q, course);

  // The top-bar search navigates here with ?q=; follow it
  useEffect(() => {
    setInput(urlQuery);
    setQ(urlQuery);
  }, [urlQuery]);

  // Debounce typing
  useEffect(() => {
    const t = setTimeout(() => setQ(input.trim()), 250);
    return () => clearTimeout(t);
  }, [input]);

  const items = useMemo(() => {
    const list = [...(lectures.data ?? [])];
    if (sort === 'old') list.sort((a, b) => a.created - b.created);
    if (sort === 'title') list.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === 'score') list.sort((a, b) => (a.best ?? 101) - (b.best ?? 101));
    return list;
  }, [lectures.data, sort]);

  return (
    <div className="container page">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'All lectures' }]} />
      <h1>Lecture library</h1>
      <div className="row wrap mt-24 mb-16">
        <div className="grow" style={{ minWidth: 240 }}>
          <input
            className="input"
            type="search"
            placeholder="Search titles, notes and transcripts"
            aria-label="Search lectures"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <Select
          ariaLabel="Filter by course"
          width={250}
          value={course}
          onChange={setCourse}
          options={[
            { value: '', label: 'All courses' },
            ...(courses.data ?? []).map((c) => ({ value: String(c.id), label: c.name, hint: c.instructor || undefined, color: c.color })),
            { value: 'none', label: 'No course' },
          ]}
        />
        <Select
          ariaLabel="Sort lectures"
          width={200}
          value={sort}
          onChange={(v) => setSort(v as Sort)}
          options={[
            { value: 'new', label: 'Newest first' },
            { value: 'old', label: 'Oldest first' },
            { value: 'title', label: 'Title A–Z' },
            { value: 'score', label: 'Lowest quiz score' },
          ]}
        />
      </div>
      <div className="mb-8">
        <div className="muted small">{lectures.data ? plural(items.length, 'lecture') + (q ? ` matching "${q}"` : '') : 'Loading…'}</div>
      </div>
      <div className="card">
        {items.length ? (
          items.map((l) => <LectureRow key={l.id} lecture={l} query={q} />)
        ) : (
          lectures.data && <EmptyState icon="search" title="No lectures found" text={q ? 'Try a different keyword.' : 'Nothing here yet.'} />
        )}
      </div>
    </div>
  );
}
