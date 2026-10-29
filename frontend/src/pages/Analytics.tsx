import { Link } from 'react-router-dom';
import { useAnalytics } from '../api/queries';
import type { Analytics as AnalyticsData } from '../api/types';
import { Donut, LineChart, StackedBars } from '../components/Charts';
import { Async, Breadcrumb, EmptyState } from '../components/Common';
import { Icon, type IconName } from '../components/Icon';
import { useRole } from '../context/RoleContext';
import { timeAgo } from '../lib/format';

const tone = (v: number) => (v >= 75 ? 'good' : v >= 50 ? '' : v >= 30 ? 'warn' : 'bad');

const SERIES = [
  { key: 'lectures', label: 'Lectures', color: '#0056d2' },
  { key: 'quizzes', label: 'Quizzes', color: '#1fa971' },
  { key: 'questions', label: 'Questions', color: '#d98e04' },
];
const DIST_COLORS = ['#c4262e', '#d98e04', '#5b9bff', '#1fa971'];
const EVENT_ICON: Record<string, IconName> = { lecture: 'mic', quiz: 'award', question: 'message' };

function TeacherOnly() {
  const { setRole } = useRole();
  return (
    <div className="container page">
      <div className="card">
        <EmptyState
          icon="chart"
          title="Analytics is a teacher feature"
          text="Switch to Teacher mode to see class-level learning analytics."
          action={
            <button className="btn btn-primary" onClick={() => setRole('teacher')}>
              Switch to Teacher
            </button>
          }
        />
      </div>
    </div>
  );
}

function Delta({ value, unit = '%', invert = false }: { value: number | null | undefined; unit?: string; invert?: boolean }) {
  if (value === null || value === undefined) return <span className="delta flat">No prior week</span>;
  if (value === 0) return <span className="delta flat">No change</span>;
  const up = value > 0;
  const good = invert ? !up : up;
  return (
    <span className={'delta ' + (good ? 'up' : 'down')}>
      {up ? '▲' : '▼'} {Math.abs(value)}
      {unit} <i>vs last week</i>
    </span>
  );
}

function Kpi({ icon, label, value, children }: { icon: IconName; label: string; value: string | number; children?: React.ReactNode }) {
  return (
    <div className="kpi">
      <div className="kpi-top">
        <span className="kpi-icon">
          <Icon name={icon} size={18} />
        </span>
        <span className="kpi-label">{label}</span>
      </div>
      <div className="kpi-value">{value}</div>
      {children}
    </div>
  );
}

function downloadCsv(a: AnalyticsData) {
  const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const rows = [
    ['Lecture', 'Course', 'Attempts', 'Average score %', 'Best score %'],
    ...a.per_lecture.map((l) => [l.title, l.course ?? '', l.attempts, l.avg ?? '', l.best ?? '']),
  ];
  const csv = rows.map((r) => r.map(esc).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'classmind-analytics.csv';
  link.click();
  URL.revokeObjectURL(url);
}

export function Analytics() {
  const { isTeacher } = useRole();
  const analytics = useAnalytics();
  if (!isTeacher) return <TeacherOnly />;

  return (
    <Async query={analytics}>
      {(a) => {
        const t = a.totals;
        const k = a.kpis;
        const attempted = a.per_lecture.filter((x) => x.avg !== null);
        const distTotal = a.distribution.reduce((s, d) => s + d.count, 0);
        // a topic needs a few answers before its accuracy means anything
        const topics = a.weak_topics.filter((w) => w.total >= 3);
        return (
          <div className="container page">
            <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Analytics' }]} />
            <div className="row spread wrap mb-8">
              <div>
                <h1>Learning analytics</h1>
                <p className="muted mt-8" style={{ margin: 0 }}>
                  How students are doing, which concepts are hardest, and what they ask the AI tutor. Showing the last 30 days.
                </p>
              </div>
              <button className="btn btn-outline" onClick={() => downloadCsv(a)}>
                <Icon name="download" size={16} />
                Export CSV
              </button>
            </div>

            <div className="kpi-grid mt-24">
              <Kpi icon="mic" label="Lectures recorded" value={t.lectures}>
                <span className="delta flat">{t.minutes} min of content</span>
              </Kpi>
              <Kpi icon="help" label="Quiz attempts" value={t.attempts}>
                <Delta value={k.attempts_change} />
              </Kpi>
              <Kpi icon="award" label="Average score" value={t.avg === null ? '–' : t.avg + '%'}>
                <Delta value={k.avg_change} unit=" pts" />
              </Kpi>
              <Kpi icon="message" label="Tutor questions" value={t.questions}>
                <Delta value={k.questions_change} />
              </Kpi>
              <Kpi icon="target" label="Lectures practised" value={k.practised_pct + '%'}>
                <span className="delta flat">
                  {k.practised} of {t.lectures} lectures
                </span>
              </Kpi>
            </div>

            <div className="grid grid-2 mt-24">
              <div className="card card-pad">
                <div className="chart-head">
                  <div>
                    <h3>Activity</h3>
                    <p className="small muted">Lectures recorded, quizzes taken and questions asked per day.</p>
                  </div>
                  <div className="legend">
                    {SERIES.map((s) => (
                      <span key={s.key}>
                        <i style={{ background: s.color }} />
                        {s.label}
                      </span>
                    ))}
                  </div>
                </div>
                <StackedBars data={a.activity_30} series={SERIES} />
              </div>
              <div className="card card-pad">
                <div className="chart-head">
                  <div>
                    <h3>Score trend</h3>
                    <p className="small muted">Average quiz score per day.</p>
                  </div>
                </div>
                {a.trend.some((p) => p.avg !== null) ? <LineChart data={a.trend} /> : <EmptyState icon="chart" title="No quiz data yet" text="Scores appear after students take a quiz." />}
              </div>
            </div>

            <div className="grid grid-2 mt-24">
              <div className="card card-pad">
                <h3>Course comparison</h3>
                <p className="small muted">Average quiz score, practice coverage and engagement by course.</p>
                <div className="table-scroll">
                <table className="tbl course-tbl">
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Avg score</th>
                      <th>Practised</th>
                      <th>Attempts</th>
                      <th>Questions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {a.by_course.map((c) => (
                      <tr key={c.id}>
                        <td>
                          <Link to={`/course/${c.id}`} className="course-cell">
                            <i style={{ background: c.color }} />
                            <span>
                              {c.name}
                              {c.instructor && <em>{c.instructor}</em>}
                            </span>
                          </Link>
                        </td>
                        <td>{c.avg === null ? '–' : <span className={'badge ' + (c.avg >= 70 ? 'green' : 'amber')}>{c.avg}%</span>}</td>
                        <td>
                          <div className="mini-bar">
                            <div style={{ width: c.practised + '%' }} />
                          </div>
                          <span className="xs muted">{c.practised}%</span>
                        </td>
                        <td>{c.attempts}</td>
                        <td>{c.questions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>
              <div className="card card-pad">
                <h3>Score distribution</h3>
                <p className="small muted">How all quiz attempts are spread across score bands.</p>
                <div className="dist">
                  <Donut parts={a.distribution.map((d, i) => ({ label: d.label, value: d.count, color: DIST_COLORS[i] }))} center={String(distTotal)} sub="attempts" />
                  <ul className="dist-legend">
                    {a.distribution.map((d, i) => (
                      <li key={d.label}>
                        <i style={{ background: DIST_COLORS[i] }} />
                        <span>{d.label}</span>
                        <b>{d.count}</b>
                        <em>{distTotal ? Math.round((d.count * 100) / distTotal) : 0}%</em>
                      </li>
                    ))}
                  </ul>
                </div>
                {distTotal > 0 && (
                  <div className="insight">
                    <b>{Math.round((a.distribution[3].count * 100) / distTotal)}%</b> of attempts score 80% or higher, while <b>{Math.round((a.distribution[0].count * 100) / distTotal)}%</b> score below 40%.
                    {topics[0] && (
                      <>
                        {' '}
                        The topic most worth revisiting in class is <b>{topics[0].topic}</b> ({Math.round(topics[0].accuracy * 100)}% correct).
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-2 mt-24">
              <div className="card card-pad">
                <h3>Quiz performance by lecture</h3>
                <p className="small muted">Average score across all attempts.</p>
                {attempted.length ? (
                  attempted.map((l) => (
                    <div className="bar-row" key={l.id}>
                      <Link className="lbl" to={`/lecture/${l.id}`} title={l.title}>
                        {l.title}
                      </Link>
                      <div className="track">
                        <div className={'fill ' + tone(l.avg!)} style={{ width: l.avg + '%' }} />
                      </div>
                      <b>{l.avg}%</b>
                    </div>
                  ))
                ) : (
                  <EmptyState icon="chart" title="No quiz data yet" text="Scores appear after students take a quiz." />
                )}
              </div>
              <div className="card card-pad">
                <h3>Learning gaps</h3>
                <p className="small muted">Topics students answer incorrectly most often. Lowest accuracy first.</p>
                {topics.length ? (
                  topics.map((w) => (
                    <div className="bar-row" key={w.topic}>
                      <span className="lbl" title={w.topic}>
                        {w.topic}
                      </span>
                      <div className="track">
                        <div className={'fill ' + tone(w.accuracy * 100)} style={{ width: Math.round(w.accuracy * 100) + '%' }} />
                      </div>
                      <b>{Math.round(w.accuracy * 100)}%</b>
                    </div>
                  ))
                ) : (
                  <EmptyState icon="target" title="No gaps detected" text="Gaps are detected from quiz answers." />
                )}
              </div>
            </div>

            <div className="grid grid-2 mt-24">
              <div className="card card-pad">
                <h3>What students are asking</h3>
                <p className="small muted">Frequent questions often point to parts of the lecture that were unclear.</p>
                {a.top_questions.length ? (
                  <div className="table-scroll">
                  <table className="tbl">
                    <thead>
                      <tr>
                        <th>Question</th>
                        <th>Lecture</th>
                        <th>Times</th>
                      </tr>
                    </thead>
                    <tbody>
                      {a.top_questions.map((q, i) => (
                        <tr key={i}>
                          <td>{q.question}</td>
                          <td>
                            <Link to={`/lecture/${q.lecture_id}?tab=ask`}>{q.lecture}</Link>
                          </td>
                          <td>
                            <span className="badge">{q.count}×</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                ) : (
                  <EmptyState icon="message" title="No questions yet" text="Questions asked in the AI tutor show up here." />
                )}
              </div>
              <div className="card card-pad">
                <h3>Recent activity</h3>
                <p className="small muted">The latest recordings, quiz attempts and tutor questions.</p>
                <ul className="feed">
                  {a.recent.map((e, i) => (
                    <li key={i}>
                      <span className={'feed-icon ' + e.type}>
                        <Icon name={EVENT_ICON[e.type] || 'zap'} size={15} />
                      </span>
                      <Link to={`/lecture/${e.lecture_id}`}>{e.text}</Link>
                      <span className="xs muted">{timeAgo(e.when)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      }}
    </Async>
  );
}
