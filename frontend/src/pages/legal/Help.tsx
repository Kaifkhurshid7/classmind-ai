import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb } from '../../components/Common';
import { Icon, type IconName } from '../../components/Icon';
import { site } from '../../config/site';

interface Faq {
  q: string;
  a: ReactNode;
  /** Plain text of the answer, used for searching. */
  plain: string;
}

interface Group {
  id: string;
  title: string;
  icon: IconName;
  blurb: string;
  items: Faq[];
}

const GROUPS: Group[] = [
  {
    id: 'teachers',
    title: 'For teachers',
    icon: 'mic',
    blurb: 'Recording, editing and sharing lectures.',
    items: [
      {
        q: 'How do I record a lecture?',
        a: (
          <>
            Open <Link to="/record">Recording studio</Link> from the top bar, give the lecture a title, choose the course and speech language, and press Start recording. Allow microphone access when your browser asks. Press Stop and save when you finish; the notes and quiz are generated automatically.
          </>
        ),
        plain: 'Open Recording studio from the top bar, give the lecture a title, choose the course and speech language, and press Start recording. Allow microphone access. Press Stop and save when you finish; notes and quiz are generated automatically.',
      },
      { q: 'Which browsers support live transcription?', a: 'Chrome and Edge. Other browsers can still record audio, and you can paste or upload a transcript instead. Live transcription also needs an internet connection.', plain: '' },
      { q: 'Can I fix mistakes in the transcript or notes?', a: 'Yes. On the lecture page use Edit transcript (this regenerates the notes and quiz) or Edit notes to change the summary, key points, concepts and sections directly.', plain: '' },
      { q: 'How do I share notes with students?', a: 'Students open the lecture from the library. You can also download the notes as a PDF, Markdown or plain text from the Download menu on the lecture page.', plain: '' },
      { q: 'What do the analytics show?', a: 'Quiz performance for each lecture and course, score trends, the topics students get wrong most often, the questions they ask the AI tutor, and recent activity. Frequent questions often point to parts of a lecture that were unclear.', plain: '' },
    ],
  },
  {
    id: 'students',
    title: 'For students',
    icon: 'book',
    blurb: 'Studying with notes, the tutor and quizzes.',
    items: [
      { q: 'How does the AI tutor work?', a: 'It answers from the lecture transcript, so its answers stay tied to what was taught. Choose Explain simply or Give an example to change the style. Your conversation is saved with the lecture.', plain: '' },
      { q: 'How are quizzes scored?', a: 'Answers are revealed only after you submit. You see your score, the correct answers with explanations and the topics to revisit. Every attempt is saved, and weak topics feed your revision plan.', plain: '' },
      { q: 'What are flashcards for?', a: 'They are made from the key concepts and practice questions of a lecture. Use the arrow keys to move, Space to flip, and mark cards as mastered to track progress.', plain: '' },
      { q: 'Can I jump to a moment in the recording?', a: 'For lectures recorded in the studio, click any timestamp in the Transcript tab to play from that line. Use the star icon to bookmark moments you want to revisit.', plain: '' },
    ],
  },
  {
    id: 'general',
    title: 'AI, privacy and troubleshooting',
    icon: 'shield',
    blurb: 'Accuracy, your data and common problems.',
    items: [
      { q: 'Are the AI answers always correct?', a: 'No. Notes, quizzes and answers are generated automatically and can contain mistakes. Check important points against your teacher’s materials.', plain: '' },
      { q: 'What is the difference between Claude AI and the offline engine?', a: 'With an Anthropic API key the app uses Claude for much higher quality notes, quizzes and answers. Without a key it falls back to a built-in keyword-based engine that works fully offline. The top bar shows which one is active.', plain: '' },
      {
        q: 'Where is my data stored and can I delete it?',
        a: (
          <>
            Lectures are stored on your organisation&rsquo;s server. Teachers can delete a lecture at any time, which removes its transcript, notes, audio, chat and quiz results. See the <Link to="/privacy">Privacy Policy</Link>.
          </>
        ),
        plain: 'Lectures are stored on your organisation’s server. Teachers can delete a lecture at any time, removing its transcript, notes, audio, chat and quiz results. Privacy Policy.',
      },
      { q: 'The microphone is not working. What should I check?', a: 'Use Chrome or Edge, open the app on localhost or an HTTPS address, and allow microphone access from the address bar. Check that no other app is using the microphone.', plain: '' },
    ],
  },
];

const textOf = (f: Faq) => (f.q + ' ' + (f.plain || (typeof f.a === 'string' ? f.a : ''))).toLowerCase();

export function Help() {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    document.title = `Help center | ${site.name}`;
    return () => {
      document.title = `${site.name} | The AI learning layer for every classroom`;
    };
  }, []);

  const term = q.trim().toLowerCase();
  const groups = useMemo(
    () => GROUPS.map((g) => ({ ...g, items: term ? g.items.filter((f) => textOf(f).includes(term)) : g.items })).filter((g) => g.items.length),
    [term],
  );
  const total = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="about">
      <section className="about-hero help-hero">
        <div className="container">
          <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Help center' }]} />
          <h1>How can we help?</h1>
          <p className="lead">Quick answers for teachers and students. Search, or pick a topic below.</p>
          <div className="help-search">
            <Icon name="search" size={20} />
            <input type="search" placeholder="Search for answers, for example “quiz” or “microphone”" aria-label="Search the help center" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="help-topics">
            {GROUPS.map((g) => (
              <a key={g.id} href={`#${g.id}`} className="help-topic">
                <span className="feature-icon">
                  <Icon name={g.icon} size={20} />
                </span>
                <span>
                  <b>{g.title}</b>
                  <em>{g.blurb}</em>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="container help-body">
        {term && (
          <p className="muted small">
            {total} {total === 1 ? 'result' : 'results'} for “{q.trim()}”
          </p>
        )}
        {groups.map((g) => (
          <section key={g.id} id={g.id} className="help-group">
            <h2>
              <Icon name={g.icon} size={20} />
              {g.title}
            </h2>
            <div className="faq">
              {g.items.map((f) => {
                const key = g.id + f.q;
                return (
                  <details key={key} open={!!term || open === key} onToggle={(e) => !term && setOpen((e.target as HTMLDetailsElement).open ? key : open === key ? null : open)}>
                    <summary>{f.q}</summary>
                    <div>
                      <p>{f.a}</p>
                    </div>
                  </details>
                );
              })}
            </div>
          </section>
        ))}
        {total === 0 && (
          <div className="card help-empty">
            <Icon name="search" size={36} />
            <h3>No answers found</h3>
            <p>Try a different word, or ask us directly.</p>
          </div>
        )}

        <section className="about-cta">
          <div>
            <h3>Still need help?</h3>
            <p>Send us a message and we will get back to you as soon as we can.</p>
          </div>
          <div className="row wrap">
            <Link className="btn btn-primary btn-lg" to="/contact">
              <Icon name="mail" size={18} />
              Contact support
            </Link>
            <Link className="btn btn-outline btn-lg" to="/about">
              About ClassMind
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
