import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useOverview } from '../api/queries';
import { Avatar, CourseArt, subjectOf } from '../components/Art';
import { Async, CourseCard, EmptyState, LectureRow, StatTile, Thumb } from '../components/Common';
import { CourseDialog } from '../components/CourseDialog';
import { HeroSection, InsightPanels, QuickActions, Showcase } from '../components/HomeSections';
import { Icon, type IconName } from '../components/Icon';
import { useRole } from '../context/RoleContext';
import { fmtDur } from '../lib/format';

const STEPS: [string, string, string, IconName][] = [
  ['LEARN', 'Capture', 'Speak naturally. The lecture is recorded and transcribed live, with timestamps.', 'mic'],
  ['UNDERSTAND', 'Structure', 'AI turns the transcript into a summary, key concepts and organised notes.', 'file'],
  ['PRACTICE', 'Test yourself', 'Ask the tutor, take quizzes and review flashcards generated from the lecture.', 'help'],
  ['GROW', 'Improve', 'Learning-gap analytics show what to revisit, with a personal revision plan.', 'chart'],
];

/** Shorten text at a word boundary and add an ellipsis. */
function clip(text: string | undefined, n: number): string {
  const t = (text || '').trim();
  if (t.length <= n) return t;
  return t.slice(0, n).replace(/\s+\S*$/, '') + '…';
}

export function Dashboard() {
  const overview = useOverview();
  const { isTeacher, displayName } = useRole();
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);

  return (
    <Async query={overview}>
      {(d) => {
        const s = d.stats;
        const c = d.continue;
        const faculty = [...new Set(d.courses.filter((x) => x.instructor).map((x) => x.instructor!))].map((name) => {
          const owned = d.courses.filter((x) => x.instructor === name);
          const scores = owned.map((x) => x.avg).filter((v): v is number => v !== null);
          const [role, ...dept] = (owned[0].instructor_title || '').split(',');
          return {
            name,
            role: role.trim(),
            dept: dept.join(',').trim(),
            courses: owned,
            lectures: owned.reduce((n, x) => n + x.lectures, 0),
            avg: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null,
          };
        });
        return (
          <div>
            <HeroSection name={displayName} isTeacher={isTeacher} courses={d.courses} />

            <div className="container">
              <div className="stats-strip">
                <StatTile value={s.lectures} label="Lectures" />
                <StatTile value={s.courses} label="Courses" />
                <StatTile value={fmtDur(s.minutes * 60)} label="Recorded time" />
                <StatTile value={s.quizzes} label="Quizzes taken" />
                <StatTile value={s.avg === null ? '–' : s.avg + '%'} label="Average quiz score" />
              </div>
            </div>

            <div className="container page">
              <QuickActions isTeacher={isTeacher} continueId={c?.id} onNewCourse={() => setCreating(true)} />

              {c && (
                <>
                  <div className="section-head">
                    <h2>Continue learning</h2>
                  </div>
                  <Link className="card continue" to={`/lecture/${c.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    <Thumb color={c.course_color || '#4a5568'} title={c.course_name || 'Lecture'} icon="play" />
                    <div>
                      <div className="xs muted mb-8">{(c.course_name || 'Lecture').toUpperCase()}</div>
                      <h3>{c.title}</h3>
                      <p className="muted small mt-8">{clip(c.summary, 190)}</p>
                      <div className="meta-row">
                        <span>
                          <Icon name="clock" size={14} />
                          {fmtDur(c.duration)}
                        </span>
                        {c.best !== null ? (
                          <span>
                            <Icon name="award" size={14} />
                            Best quiz score {c.best}%
                          </span>
                        ) : (
                          <span>Quiz not attempted yet</span>
                        )}
                      </div>
                    </div>
                    <span className="btn btn-primary">
                      Resume
                      <Icon name="right" size={16} />
                    </span>
                  </Link>
                </>
              )}

              <div className="section-head">
                <h2>My courses</h2>
                <div className="row">
                  <button className="btn btn-outline btn-sm teacher-only" onClick={() => setCreating(true)}>
                    <Icon name="plus" size={14} />
                    New course
                  </button>
                  <Link to="/library">View all lectures</Link>
                </div>
              </div>
              {d.courses.length || isTeacher ? (
                <div className="grid grid-4">
                  {d.courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                  {d.courses.length % 4 !== 0 && (
                    <button className="new-card teacher-only" onClick={() => setCreating(true)}>
                      <Icon name="plus" size={28} />
                      Create a course
                    </button>
                  )}
                </div>
              ) : (
                <EmptyState icon="folder" title="No courses yet" text="Your teacher has not published any courses." />
              )}

              <InsightPanels isTeacher={isTeacher} />

              {faculty.length > 0 && (
                <>
                  <div className="section-head">
                    <h2>Meet your faculty</h2>
                    <span className="muted small">{faculty.length} instructors across {d.courses.length} courses</span>
                  </div>
                  <div className="faculty-grid2">
                    {faculty.map((f) => {
                      const first = f.courses[0];
                      return (
                        <article className="fcard" key={f.name}>
                          <div className="fcard-banner" style={{ background: `linear-gradient(135deg, ${first.color}, color-mix(in srgb, ${first.color} 58%, #000))` }}>
                            <CourseArt subject={subjectOf(first.name)} />
                          </div>
                          <div className="fcard-avatar">
                            <Avatar name={f.name} size={92} />
                          </div>
                          <div className="fcard-body">
                            <h3>{f.name}</h3>
                            <p className="fcard-role">{f.role}</p>
                            {f.dept && <p className="fcard-dept">{f.dept}</p>}
                            <div className="fcard-stats">
                              <div>
                                <b>{f.courses.length}</b>
                                <span>{f.courses.length === 1 ? 'Course' : 'Courses'}</span>
                              </div>
                              <div>
                                <b>{f.lectures}</b>
                                <span>{f.lectures === 1 ? 'Lecture' : 'Lectures'}</span>
                              </div>
                              <div>
                                <b>{f.avg === null ? '–' : f.avg + '%'}</b>
                                <span>Avg score</span>
                              </div>
                            </div>
                            <div className="faculty-courses">
                              {f.courses.map((c) => (
                                <Link key={c.id} to={`/course/${c.id}`} className="badge">
                                  {c.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                          <Link className="fcard-link" to={`/course/${first.id}`}>
                            View {f.courses.length === 1 ? 'course' : 'courses'}
                            <Icon name="right" size={15} />
                          </Link>
                        </article>
                      );
                    })}
                  </div>
                </>
              )}

              <div className="section-head">
                <h2>Recent lectures</h2>
                <Link to="/library">See all</Link>
              </div>
              <div className="card">
                {d.lectures.length ? (
                  d.lectures.slice(0, 5).map((l) => <LectureRow key={l.id} lecture={l} />)
                ) : (
                  <EmptyState
                    icon="mic"
                    title="No lectures yet"
                    text="Record your first lecture to see it here."
                    action={
                      isTeacher ? (
                        <Link className="btn btn-primary" to="/record">
                          Record a lecture
                        </Link>
                      ) : undefined
                    }
                  />
                )}
              </div>

              <div className="section-head">
                <h2>See ClassMind in action</h2>
              </div>
              <Showcase />

              <div className="section-head">
                <h2>How ClassMind works</h2>
              </div>
              <div className="card steps">
                {STEPS.map(([n, t, p, ic]) => (
                  <div className="step" key={n}>
                    <div className="step-icon">
                      <Icon name={ic} size={20} />
                    </div>
                    <div className="n">{n}</div>
                    <h3>{t}</h3>
                    <p>{p}</p>
                  </div>
                ))}
              </div>
            </div>
            {creating && <CourseDialog onClose={() => setCreating(false)} onSaved={(course) => navigate(`/course/${course.id}`)} />}
          </div>
        );
      }}
    </Async>
  );
}
