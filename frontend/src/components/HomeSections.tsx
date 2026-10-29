import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAnalytics } from '../api/queries';
import type { CourseCardData } from '../api/types';
import { timeAgo } from '../lib/format';
import { HeroArt } from './Art';
import { Icon, type IconName } from './Icon';

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */
function greeting(): string {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

export function HeroSection({ name, isTeacher, courses }: { name: string; isTeacher: boolean; courses: CourseCardData[] }) {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const today = new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });
  const search = () => {
    const term = q.trim();
    navigate(term ? `/library?q=${encodeURIComponent(term)}` : '/library');
  };

  return (
    <section className="hero">
      <div className="container hero-inner">
        <div className="hero-copy">
          <div className="hero-eyebrow">
            <span className="badge">{isTeacher ? 'TEACHER VIEW' : 'STUDENT VIEW'}</span>
            <span className="hero-date">{today}</span>
          </div>
          <h1>
            {greeting()}, <span className="hero-name">{name}</span>
          </h1>
          <p>
            {isTeacher
              ? 'Record a lecture and ClassMind turns it into a transcript, structured notes, a quiz and an AI tutor your students can learn from.'
              : 'Pick up where you left off. Review notes, ask the AI tutor about anything from class, and practise with quizzes and flashcards.'}
          </p>

          <form
            className="hero-search"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              search();
            }}
          >
            <Icon name="search" size={20} />
            <input type="search" placeholder="Search any lecture, concept or transcript…" aria-label="Search lectures" value={q} onChange={(e) => setQ(e.target.value)} />
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </form>

          <div className="hero-chips" aria-label="Browse by course">
            <span>Browse:</span>
            {courses.slice(0, 5).map((c) => (
              <Link key={c.id} to={`/library?course=${c.id}`} className="chip-link">
                {c.name.split(':')[0].replace('Introduction to ', '').replace('Principles of ', '')}
              </Link>
            ))}
          </div>

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

          <ul className="hero-points">
            <li>
              <Icon name="globe" size={16} />
              English · हिन्दी · ଓଡ଼ିଆ
            </li>
            <li>
              <Icon name="download" size={16} />
              Export to PDF
            </li>
            <li>
              <Icon name="lock" size={16} />
              Private by design
            </li>
          </ul>
        </div>
        <div className="hero-art">
          <HeroArt />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Quick actions (role aware)                                          */
/* ------------------------------------------------------------------ */
interface Action {
  icon: IconName;
  title: string;
  text: string;
  to?: string;
  onClick?: () => void;
}

export function QuickActions({ isTeacher, continueId, onNewCourse }: { isTeacher: boolean; continueId?: number; onNewCourse: () => void }) {
  const lec = (tab?: string) => (continueId ? `/lecture/${continueId}${tab ? `?tab=${tab}` : ''}` : '/library');
  const actions: Action[] = isTeacher
    ? [
        { icon: 'mic', title: 'Record a lecture', text: 'Live transcript, notes and quiz in one go.', to: '/record' },
        { icon: 'plus', title: 'Create a course', text: 'Organise lectures with a faculty profile.', onClick: onNewCourse },
        { icon: 'chart', title: 'View analytics', text: 'See learning gaps and what students ask.', to: '/analytics' },
        { icon: 'help', title: 'Teacher guide', text: 'Short answers to common questions.', to: '/help#teachers' },
      ]
    : [
        { icon: 'play', title: 'Continue learning', text: 'Pick up the last lecture you opened.', to: lec() },
        { icon: 'help', title: 'Take a quiz', text: 'Check what you remember, get explanations.', to: lec('quiz') },
        { icon: 'message', title: 'Ask the AI tutor', text: 'Answers grounded in your lecture.', to: lec('ask') },
        { icon: 'target', title: 'Revision plan', text: 'Built from your weak quiz topics.', to: lec('overview') },
      ];
  return (
    <div className="quick-actions">
      {actions.map((a) => {
        const inner = (
          <>
            <span className="qa-icon">
              <Icon name={a.icon} size={22} />
            </span>
            <span className="qa-body">
              <b>{a.title}</b>
              <span>{a.text}</span>
            </span>
            <Icon name="right" size={18} className="qa-arrow" />
          </>
        );
        return a.to ? (
          <Link key={a.title} to={a.to} className="qa-card">
            {inner}
          </Link>
        ) : (
          <button key={a.title} className="qa-card" onClick={a.onClick}>
            {inner}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Insight panels: what to revisit and what happened recently          */
/* ------------------------------------------------------------------ */
const EVENT_ICON: Record<string, IconName> = { lecture: 'mic', quiz: 'award', question: 'message' };
const tone = (v: number) => (v >= 75 ? 'good' : v >= 50 ? '' : v >= 30 ? 'warn' : 'bad');

export function InsightPanels({ isTeacher }: { isTeacher: boolean }) {
  const { data: a } = useAnalytics();
  // ignore topics with only a couple of answers: a single wrong answer would show as 0%
  const topics = (a?.weak_topics ?? []).filter((w) => w.total >= 3);
  if (!a || (!topics.length && !a.recent.length)) return null;
  return (
    <div className="grid grid-2 mt-24">
      <div className="card card-pad">
        <div className="row spread">
          <h3>{isTeacher ? 'Topics that need attention' : 'Topics to revise'}</h3>
          {isTeacher && (
            <Link className="small" to="/analytics">
              Full analytics
            </Link>
          )}
        </div>
        <p className="small muted">Lowest quiz accuracy first. Revisit these in class or in your next study session.</p>
        {topics.slice(0, 5).map((w) => (
          <div className="bar-row" key={w.topic}>
            <span className="lbl" title={w.topic}>
              {w.topic}
            </span>
            <div className="track">
              <div className={'fill ' + tone(w.accuracy * 100)} style={{ width: Math.round(w.accuracy * 100) + '%' }} />
            </div>
            <b>{Math.round(w.accuracy * 100)}%</b>
          </div>
        ))}
      </div>
      <div className="card card-pad">
        <h3>Recent activity</h3>
        <p className="small muted">The latest recordings, quiz attempts and tutor questions.</p>
        <ul className="feed">
          {a.recent.slice(0, 5).map((e, i) => (
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
  );
}

/* ------------------------------------------------------------------ */
/* Product showcase: real UI snippets, not stock images                */
/* ------------------------------------------------------------------ */
type Tab = 'transcript' | 'notes' | 'tutor' | 'quiz';

const TABS: { key: Tab; label: string; icon: IconName; title: string; text: string; points: string[] }[] = [
  {
    key: 'transcript',
    label: 'Live transcript',
    icon: 'mic',
    title: 'Every word captured, with timestamps',
    text: 'Speak naturally. The lecture is transcribed as you teach, in English, Hindi or Odia, and the recording is saved alongside it.',
    points: ['Click any line to jump to that moment in the audio', 'Star the moments you want to revisit', 'Search the whole transcript instantly'],
  },
  {
    key: 'notes',
    label: 'Smart notes',
    icon: 'file',
    title: 'Notes you can study from on day one',
    text: 'The transcript becomes a summary, key points, defined concepts and organised sections, ready to edit and export.',
    points: ['Edit anything before sharing with students', 'Download as PDF, Markdown or plain text', 'Regenerate with AI whenever the lecture changes'],
  },
  {
    key: 'tutor',
    label: 'AI tutor',
    icon: 'message',
    title: 'Questions answered from the lecture itself',
    text: 'Students ask in their own words and get answers grounded in what was actually taught, simplified or with an example on request.',
    points: ['Answers stay tied to the lecture transcript', 'Explain simply, give an example or summarise', 'Teachers see which questions come up most'],
  },
  {
    key: 'quiz',
    label: 'Quizzes',
    icon: 'help',
    title: 'Practice that shows what to revise',
    text: 'Multiple-choice quizzes, flashcards and short-answer practice are created automatically, with explanations for every answer.',
    points: ['Instant scoring with a review of each answer', 'Weak topics feed a personal revision plan', 'Analytics highlight learning gaps for the class'],
  },
];

function Mock({ tab }: { tab: Tab }) {
  if (tab === 'transcript')
    return (
      <div className="mock">
        <div className="mock-bar">
          <i />
          <i />
          <i />
          <b>Photosynthesis: How Plants Make Food</b>
        </div>
        {[
          ['00:00', 'Good morning everyone. Today we are going to talk about photosynthesis.'],
          ['00:09', 'Photosynthesis is the process by which green plants convert light energy into chemical energy.'],
          ['00:21', 'The overall equation is simple: carbon dioxide and water give glucose and oxygen.'],
          ['00:38', 'It takes place in the chloroplasts, which are small green organelles in leaf cells.'],
        ].map(([t, text], i) => (
          <div key={t} className={'mock-line' + (i === 1 ? ' active' : '')}>
            <span>{t}</span>
            <p>{text}</p>
            <Icon name="star" size={15} />
          </div>
        ))}
      </div>
    );
  if (tab === 'notes')
    return (
      <div className="mock">
        <div className="mock-bar">
          <i />
          <i />
          <i />
          <b>Notes</b>
          <em>Sample notes</em>
        </div>
        <div className="callout">Photosynthesis converts light energy into chemical energy stored in glucose, in two stages inside chloroplasts.</div>
        <div className="mock-concepts">
          {[
            ['Chloroplast', 'Where photosynthesis takes place.'],
            ['Light reactions', 'Split water; make ATP and NADPH.'],
            ['Calvin cycle', 'Builds glucose from carbon dioxide.'],
            ['Limiting factor', 'The condition in shortest supply.'],
          ].map(([term, def]) => (
            <div key={term} className="concept">
              <b>{term}</b>
              <span>{def}</span>
            </div>
          ))}
        </div>
      </div>
    );
  if (tab === 'tutor')
    return (
      <div className="mock">
        <div className="mock-bar">
          <i />
          <i />
          <i />
          <b>AI tutor · answers from this lecture</b>
        </div>
        <div className="mock-chat">
          <div className="msg user">
            <div className="av">A</div>
            <div className="bubble">Where does the oxygen come from?</div>
          </div>
          <div className="msg ai">
            <div className="av">AI</div>
            <div className="bubble">From the splitting of water in the light reactions, not from carbon dioxide. The lecture calls this a very common exam mistake.</div>
          </div>
          <div className="mock-chips">
            <span>Explain simply</span>
            <span>Give an example</span>
            <span>Summarise</span>
          </div>
        </div>
      </div>
    );
  return (
    <div className="mock">
      <div className="mock-bar">
        <i />
        <i />
        <i />
        <b>Lecture quiz · question 2 of 6</b>
      </div>
      <div className="progress mb-16">
        <div style={{ width: '33%' }} />
      </div>
      <div className="quiz-q">Where does the Calvin cycle take place?</div>
      {['Thylakoid membrane', 'Stroma', 'Nucleus', 'Mitochondrion'].map((o, i) => (
        <div key={o} className={'opt' + (i === 1 ? ' right' : '')}>
          <span className="k">{'ABCD'[i]}</span>
          <span>{o}</span>
        </div>
      ))}
    </div>
  );
}

export function Showcase() {
  const [tab, setTab] = useState<Tab>('transcript');
  const t = TABS.find((x) => x.key === tab)!;
  return (
    <section className="showcase">
      <div className="showcase-tabs" role="tablist">
        {TABS.map((x) => (
          <button key={x.key} role="tab" aria-selected={tab === x.key} className={tab === x.key ? 'on' : ''} onClick={() => setTab(x.key)}>
            <Icon name={x.icon} size={17} />
            {x.label}
          </button>
        ))}
      </div>
      <div className="showcase-body">
        <div className="showcase-copy">
          <h3>{t.title}</h3>
          <p>{t.text}</p>
          <ul>
            {t.points.map((p) => (
              <li key={p}>
                <Icon name="checkc" size={18} />
                {p}
              </li>
            ))}
          </ul>
          <Link className="btn btn-primary" to="/library">
            Try it on a sample lecture
            <Icon name="right" size={16} />
          </Link>
        </div>
        <div className="showcase-visual">
          <Mock tab={tab} />
        </div>
      </div>
    </section>
  );
}
