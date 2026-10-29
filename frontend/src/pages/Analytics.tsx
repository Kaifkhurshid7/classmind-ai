import { Link } from 'react-router-dom';
import { useAnalytics } from '../api/queries';
import { Async, Breadcrumb, EmptyState, StatTile } from '../components/Common';
import { useRole } from '../context/RoleContext';

const tone = (v: number) => (v >= 75 ? 'good' : v >= 50 ? '' : v >= 30 ? 'warn' : 'bad');

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

export function Analytics() {
  const { isTeacher } = useRole();
  const analytics = useAnalytics();
  if (!isTeacher) return <TeacherOnly />;

  return (
    <Async query={analytics}>
      {(a) => {
        const t = a.totals;
        const maxAct = Math.max(1, ...a.activity.map((x) => x.count));
        const attempted = a.per_lecture.filter((x) => x.avg !== null);
        return (
          <div className="container page">
            <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Analytics' }]} />
            <h1>Learning analytics</h1>
            <p className="muted mt-8">See how students are doing, which concepts are hardest, and what they ask the AI tutor.</p>
            <div className="grid grid-4 mt-24">
              <StatTile value={t.lectures} label="Lectures recorded" />
              <StatTile value={t.minutes + ' min'} label="Total lecture time" />
              <StatTile value={t.questions} label="Questions asked to the tutor" />
              <StatTile value={t.avg === null ? '–' : t.avg + '%'} label={`Average quiz score (${t.attempts} ${t.attempts === 1 ? 'attempt' : 'attempts'})`} />
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
                <p className="small muted">Concepts students answer incorrectly most often.</p>
                {a.weak_topics.length ? (
                  a.weak_topics.map((w) => (
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
                          <td>{q.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <EmptyState icon="message" title="No questions yet" text="Questions asked in the AI tutor show up here." />
                )}
              </div>
              <div className="card card-pad">
                <h3>Activity, last 14 days</h3>
                <p className="small muted">Lectures recorded, quizzes taken and questions asked.</p>
                <div className="spark">
                  {a.activity.map((d) => (
                    <div key={d.day} className={d.count === maxAct && d.count ? 'hi' : ''} style={{ height: Math.max(3, (d.count / maxAct) * 100) + '%' }} title={`${d.day}: ${d.count}`} />
                  ))}
                </div>
                <div className="spark-lbl">
                  {a.activity.map((d, i) => (
                    <span key={d.day}>{i % 2 === 0 ? d.day.split(' ')[0] : ''}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </Async>
  );
}
