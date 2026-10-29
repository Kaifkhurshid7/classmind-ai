import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useOverview } from '../api/queries';
import { Avatar, HeroArt } from '../components/Art';
import { Async, CourseCard, EmptyState, LectureRow, StatTile, Thumb } from '../components/Common';
import { CourseDialog } from '../components/CourseDialog';
import { Icon, type IconName } from '../components/Icon';
import { useRole } from '../context/RoleContext';
import { fmtDur } from '../lib/format';

const STEPS: [string, string, string, IconName][] = [
  ['LEARN', 'Capture', 'Speak naturally. The lecture is recorded and transcribed live, with timestamps.', 'mic'],
  ['UNDERSTAND', 'Structure', 'AI turns the transcript into a summary, key concepts and organised notes.', 'file'],
  ['PRACTICE', 'Test yourself', 'Ask the tutor, take quizzes and review flashcards generated from the lecture.', 'help'],
  ['GROW', 'Improve', 'Learning-gap analytics show what to revisit, with a personal revision plan.', 'chart'],
];

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
          return { name, title: owned[0].instructor_title || '', courses: owned };
        });
        return (
          <div>
            <section className="hero">
              <div className="container hero-inner">
                <div className="hero-copy">
                  <div className="badge mb-16">LEARN · UNDERSTAND · PRACTICE · GROW</div>
                  <h1>Welcome back, {displayName}</h1>
                  <p>
                    {isTeacher
                      ? 'Record a lecture and ClassMind turns it into a transcript, structured notes, a quiz and an AI tutor your students can learn from.'
                      : 'Pick up where you left off. Review notes, ask the AI tutor about anything from class, and practise with quizzes and flashcards.'}
                  </p>
                  <div className="row wrap mt-24">
                    {isTeacher && (
                      <Link className="btn btn-primary btn-lg" to="/record">
                        <Icon name="mic" size={20} />
                        Record a lecture
                      </Link>
                    )}
                    <Link className={'btn btn-lg ' + (isTeacher ? 'btn-outline' : 'btn-primary')} to="/library">
                      <Icon name="book" size={20} />
                      Browse lectures
                    </Link>
                  </div>
                </div>
                <div className="hero-art">
                  <HeroArt />
                </div>
              </div>
            </section>

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
                      <p className="muted small mt-8">{(c.summary || '').slice(0, 200)}</p>
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
                <Link to="/library">View all lectures</Link>
              </div>
              {d.courses.length || isTeacher ? (
                <div className="grid grid-4">
                  {d.courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                  <button className="new-card teacher-only" onClick={() => setCreating(true)}>
                    <Icon name="plus" size={28} />
                    Create a course
                  </button>
                </div>
              ) : (
                <EmptyState icon="folder" title="No courses yet" text="Your teacher has not published any courses." />
              )}

              {faculty.length > 0 && (
                <>
                  <div className="section-head">
                    <h2>Meet your faculty</h2>
                  </div>
                  <div className="grid grid-3 faculty-grid">
                    {faculty.map((f) => (
                      <div className="card faculty-card" key={f.name}>
                        <Avatar name={f.name} size={56} />
                        <div>
                          <h3>{f.name}</h3>
                          <div className="muted small">{f.title}</div>
                          <div className="faculty-courses">
                            {f.courses.map((c) => (
                              <Link key={c.id} to={`/course/${c.id}`} className="badge">
                                {c.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
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
