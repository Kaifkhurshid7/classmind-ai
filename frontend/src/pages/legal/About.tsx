import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useOverview } from '../../api/queries';
import { Breadcrumb, StatTile } from '../../components/Common';
import { Icon, type IconName } from '../../components/Icon';
import { site } from '../../config/site';

const FEATURES: { icon: IconName; title: string; text: string }[] = [
  { icon: 'mic', title: 'Live transcription', text: 'Record in the browser and watch a timestamped transcript appear as you speak, in English, Hindi or Odia. The original audio is saved with the lecture.' },
  { icon: 'file', title: 'Smart notes', text: 'Every lecture becomes a summary, key points, defined concepts and organised sections that teachers can edit and export to PDF or Markdown.' },
  { icon: 'message', title: 'AI tutor', text: 'Students ask questions and get answers grounded in what was actually taught, with options to explain simply, give an example or summarise.' },
  { icon: 'help', title: 'Quizzes and flashcards', text: 'Multiple-choice quizzes with explanations, short-answer practice and flashcards are created from each lecture automatically.' },
  { icon: 'target', title: 'Personal revision plans', text: 'A study plan built from a student’s weak quiz topics and the questions they asked, so revision time goes where it is needed.' },
  { icon: 'chart', title: 'Learning analytics', text: 'Teachers see score trends, course comparisons, the concepts students miss most and what they ask the tutor.' },
];

const JOURNEY: { icon: IconName; title: string; text: string }[] = [
  { icon: 'mic', title: 'Speak', text: 'The teacher teaches as usual and presses record.' },
  { icon: 'list', title: 'Transcribe', text: 'A live, timestamped transcript appears in seconds.' },
  { icon: 'file', title: 'Structure', text: 'AI builds notes, concepts, a quiz and flashcards.' },
  { icon: 'award', title: 'Practise', text: 'Students learn, ask the tutor and test themselves.' },
  { icon: 'chart', title: 'Improve', text: 'Analytics show what to teach again.' },
];

const PRINCIPLES: { icon: IconName; title: string; text: string }[] = [
  { icon: 'book', title: 'Learning that lasts', text: 'A lecture should stay useful long after the bell rings.' },
  { icon: 'globe', title: 'In every language', text: 'Students learn best in the language they think in.' },
  { icon: 'users', title: 'Teachers stay in control', text: 'AI drafts, teachers edit. Nothing is published without review.' },
];

const AUDIENCE: { icon: IconName; title: string; text: string; points: string[] }[] = [
  { icon: 'user', title: 'Teachers and faculty', text: 'Capture lectures effortlessly and understand how students are doing.', points: ['Record once, get notes and a quiz', 'See learning gaps by topic', 'Export to PDF in one click'] },
  { icon: 'book', title: 'Students', text: 'Study from searchable notes with a patient tutor on hand.', points: ['Ask questions any time', 'Practise with instant feedback', 'Follow a personal revision plan'] },
  { icon: 'home', title: 'Schools and colleges', text: 'A private, self-hosted tool instead of many separate services.', points: ['Your data stays on your server', 'No ads and no tracking', 'Works with or without an API key'] },
];

const TRUST: { icon: IconName; title: string; text: string }[] = [
  { icon: 'lock', title: 'Private by design', text: 'Lectures are stored on the server your organisation runs.' },
  { icon: 'shield', title: 'No ads, no tracking', text: 'No cookies are set and no analytics are collected.' },
  { icon: 'zap', title: 'AI is optional', text: 'A built-in offline engine works without any API key.' },
  { icon: 'checkc', title: 'Verify, do not trust blindly', text: 'AI output can contain mistakes, so notes stay editable.' },
];

export function About() {
  const { data: overview } = useOverview();

  useEffect(() => {
    document.title = `About | ${site.name}`;
    return () => {
      document.title = `${site.name} | The AI learning layer for every classroom`;
    };
  }, []);

  const faculty = overview ? new Set(overview.courses.map((c) => c.instructor).filter(Boolean)).size : 0;

  return (
    <div className="about">
      <section className="about-hero">
        <div className="container">
          <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'About' }]} />
          <span className="badge mb-16">ABOUT CLASSMIND AI</span>
          <h1>
            Every lecture, a lesson that <span className="hero-name">lasts</span>
          </h1>
          <p className="lead">
            {site.name} is the AI learning layer for every classroom. A teacher speaks, ClassMind records and transcribes the lecture, and AI turns it into structured notes, quizzes and a tutor that every student can learn from.
          </p>
          <div className="row wrap mt-24">
            <Link className="btn btn-primary btn-lg" to="/library">
              <Icon name="book" size={20} />
              Explore sample lectures
            </Link>
            <Link className="btn btn-outline btn-lg" to="/contact">
              Talk to us
            </Link>
          </div>
        </div>
      </section>

      <div className="container">
        {overview && (
          <div className="stats-strip about-stats">
            <StatTile value={overview.stats.lectures} label="Sample lectures" />
            <StatTile value={overview.stats.courses} label="Courses" />
            <StatTile value={faculty} label="Faculty profiles" />
            <StatTile value="3" label="Speech languages" />
            <StatTile value="PDF" label="Notes export" />
          </div>
        )}

        <section className="about-section">
          <div className="section-head">
            <h2>From speaking to learning in five steps</h2>
          </div>
          <ol className="journey">
            {JOURNEY.map((j, i) => (
              <li key={j.title}>
                <span className="journey-icon">
                  <Icon name={j.icon} size={22} />
                  <i>{i + 1}</i>
                </span>
                <b>{j.title}</b>
                <span>{j.text}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="about-section about-mission">
          <div>
            <div className="section-head">
              <h2>Our mission</h2>
            </div>
            <p className="about-text">
              Most of what is taught in a classroom is spoken once and then lost. We want every lecture to stay useful after the bell rings, so students can review it at their own pace, in their own language, and teachers can see where understanding breaks down.
            </p>
            <p className="about-text">
              {site.name} is built for schools and colleges: simple for teachers, helpful for students, and respectful of the privacy of both.
            </p>
          </div>
          <div className="principles">
            {PRINCIPLES.map((p) => (
              <div key={p.title}>
                <span className="feature-icon">
                  <Icon name={p.icon} size={20} />
                </span>
                <div>
                  <b>{p.title}</b>
                  <span>{p.text}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="about-section" id="features">
          <div className="section-head">
            <h2>What you can do</h2>
          </div>
          <div className="feature-grid three">
            {FEATURES.map((f) => (
              <div className="feature" key={f.title}>
                <span className="feature-icon">
                  <Icon name={f.icon} size={20} />
                </span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="about-section">
          <div className="section-head">
            <h2>Who it is for</h2>
          </div>
          <div className="grid grid-3">
            {AUDIENCE.map((a) => (
              <div className="card audience" key={a.title}>
                <span className="feature-icon">
                  <Icon name={a.icon} size={20} />
                </span>
                <h3>{a.title}</h3>
                <p>{a.text}</p>
                <ul>
                  {a.points.map((p) => (
                    <li key={p}>
                      <Icon name="check" size={15} />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="about-section">
          <div className="trust-band">
            <div className="trust-head">
              <h2>Privacy and trust</h2>
              <p>
                There is no advertising and no tracking. Read the <Link to="/privacy">Privacy Policy</Link> and the <Link to="/cookies">Cookie Policy</Link> for details.
              </p>
            </div>
            <div className="trust-grid">
              {TRUST.map((t) => (
                <div key={t.title}>
                  <span className="trust-icon">
                    <Icon name={t.icon} size={19} />
                  </span>
                  <b>{t.title}</b>
                  <span>{t.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="about-cta">
          <div>
            <h3>Questions, feedback or a partnership idea?</h3>
            <p>We read every message. You can also browse the Help center for quick answers.</p>
          </div>
          <div className="row wrap">
            <Link className="btn btn-primary btn-lg" to="/contact">
              <Icon name="mail" size={18} />
              Contact us
            </Link>
            <Link className="btn btn-outline btn-lg" to="/help">
              Help center
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
