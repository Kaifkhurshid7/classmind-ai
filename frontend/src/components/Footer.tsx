import { Link } from 'react-router-dom';
import { useOverview, useStatus } from '../api/queries';
import { site } from '../config/site';
import { useRole } from '../context/RoleContext';
import { Icon, LogoMark, type IconName } from './Icon';

const SOCIAL: { key: keyof typeof site.social; label: string; icon: IconName }[] = [
  { key: 'linkedin', label: 'LinkedIn', icon: 'linkedin' },
  { key: 'youtube', label: 'YouTube', icon: 'youtube' },
  { key: 'twitter', label: 'X (Twitter)', icon: 'twitter' },
  { key: 'github', label: 'GitHub', icon: 'github' },
];

const TRUST: { icon: IconName; title: string; text: string }[] = [
  { icon: 'lock', title: 'Private by design', text: 'No ads, no tracking. Lectures stay on your own server.' },
  { icon: 'globe', title: 'Multilingual', text: 'Live transcription in English, Hindi and Odia.' },
  { icon: 'zap', title: 'Works without an API key', text: 'Built-in offline engine, with Claude when you add a key.' },
  { icon: 'shield', title: 'Built for classrooms', text: 'Teacher and student views, quizzes and learning analytics.' },
];

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <nav className="footer-col" aria-label={title}>
      <h4>{title}</h4>
      {children}
    </nav>
  );
}

export function Footer() {
  const { isTeacher } = useRole();
  const { data: overview } = useOverview();
  const { data: status } = useStatus();
  const courses = (overview?.courses ?? []).slice(0, 5);
  const socials = SOCIAL.filter((s) => site.social[s.key]);

  return (
    <footer className="footer">
      <div className="container">
        <section className="footer-cta" aria-label="Get started">
          <div>
            <h3>Turn your next lecture into learning</h3>
            <p>Record it, and ClassMind builds the transcript, notes, quiz and AI tutor for you.</p>
          </div>
          <div className="row wrap">
            {isTeacher && (
              <Link className="btn btn-light btn-lg" to="/record">
                <Icon name="mic" size={18} />
                Record a lecture
              </Link>
            )}
            <Link className="btn btn-outline-light btn-lg" to="/library">
              Browse lectures
            </Link>
          </div>
        </section>

        <div className="footer-trust">
          {TRUST.map((t) => (
            <div key={t.title}>
              <span className="footer-trust-icon">
                <Icon name={t.icon} size={18} />
              </span>
              <div>
                <b>{t.title}</b>
                <span>{t.text}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="footer-grid">
          <div className="footer-brand">
            <div className="brand">
              <LogoMark />
              <span>
                ClassMind <b>AI</b>
              </span>
            </div>
            <p className="small">The AI learning layer for every classroom. Turn every lecture into personalised learning.</p>
            <a className="footer-contact" href={`mailto:${site.contactEmail}`}>
              <Icon name="mail" size={16} />
              {site.contactEmail}
            </a>
            {site.address && <p className="footer-address">{site.address}</p>}
            {socials.length > 0 && (
              <div className="footer-social">
                {socials.map((s) => (
                  <a key={s.key} href={site.social[s.key]} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                    <Icon name={s.icon} size={18} />
                  </a>
                ))}
              </div>
            )}
          </div>

          <Column title="Product">
            <Link to="/about#features">Live transcription</Link>
            <Link to="/about#features">Smart notes</Link>
            <Link to="/about#features">AI tutor</Link>
            <Link to="/about#features">Quizzes &amp; flashcards</Link>
            <Link to="/about#features">Learning analytics</Link>
          </Column>

          <Column title="Courses">
            {courses.map((c) => (
              <Link key={c.id} to={`/course/${c.id}`}>
                {c.name}
              </Link>
            ))}
            <Link to="/library">All lectures</Link>
          </Column>

          <Column title="Teach">
            <Link to="/record" className="teacher-only">
              Recording studio
            </Link>
            <Link to="/analytics" className="teacher-only">
              Analytics
            </Link>
            <Link to="/help#teachers">Guide for teachers</Link>
            <Link to="/help#students">Guide for students</Link>
          </Column>

          <Column title="Company">
            <Link to="/about">About ClassMind</Link>
            <Link to="/help">Help center</Link>
            <Link to="/contact">Contact us</Link>
          </Column>

          <Column title="Legal">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/cookies">Cookie Policy</Link>
          </Column>
        </div>

        <p className="footer-disclaimer">
          AI-generated notes, quizzes and answers can contain mistakes. Please verify important information against your teacher&rsquo;s materials.
        </p>

        <div className="copy">
          <span>
            © {new Date().getFullYear()} {site.operator}. All rights reserved. Prototype v0.2
          </span>
          <div className="footer-meta">
            <span className={'footer-status' + (status?.ai ? ' ai' : '')} title={status?.ai ? 'Claude is generating notes, quizzes and answers' : 'Using the built-in offline engine'}>
              <i />
              {status?.ai ? 'Claude AI active' : 'Offline engine'}
            </span>
            <button className="footer-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              Back to top
              <Icon name="arrowup" size={15} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
