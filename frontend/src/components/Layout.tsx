import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useStatus } from '../api/queries';
import { site } from '../config/site';
import { useRole } from '../context/RoleContext';
import { ConsentNotice } from './ConsentNotice';
import { Icon, LogoMark, type IconName } from './Icon';
import { Menu } from './Menu';
import { Modal } from './Modal';

const navClass = ({ isActive }: { isActive: boolean }) => (isActive ? 'active' : '');

function NavItem({ to, icon, label, active }: { to: string; icon: IconName; label: string; active?: boolean }) {
  return (
    <NavLink to={to} end={to === '/'} className={({ isActive }) => navClass({ isActive: active ?? isActive })}>
      <Icon name={icon} size={17} />
      <span style={{ marginLeft: 6 }}>{label}</span>
    </NavLink>
  );
}

function NameDialog({ onClose }: { onClose: () => void }) {
  const { name, setName } = useRole();
  const [value, setValue] = useState(name);
  return (
    <Modal title="Display name" onClose={onClose} actions={[{ label: 'Cancel' }, { label: 'Save', className: 'btn-primary', onClick: () => setName(value.trim()) }]}>
      <div className="field">
        <label>Name shown in the app</label>
        <input className="input" value={value} placeholder="Your name" onChange={(e) => setValue(e.target.value)} />
      </div>
    </Modal>
  );
}

function Topbar() {
  const { isTeacher, displayName, setRole } = useRole();
  const { data: status } = useStatus();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [q, setQ] = useState('');
  const [nameOpen, setNameOpen] = useState(false);
  const ai = !!status?.ai;

  const doSearch = () => {
    const term = q.trim();
    if (term) navigate('/library?q=' + encodeURIComponent(term));
  };
  const switchRole = (r: 'teacher' | 'student') => {
    setRole(r);
    if (r === 'student' && (pathname.startsWith('/record') || pathname.startsWith('/analytics'))) navigate('/');
  };

  return (
    <header className="topbar">
      <div className="container topbar-inner">
        <Link className="brand" to="/" aria-label="ClassMind AI home">
          <LogoMark />
          <span>
            ClassMind <b>AI</b>
          </span>
        </Link>
        <nav className="nav" aria-label="Main">
          <NavItem to="/" icon="home" label="My learning" active={pathname === '/' || pathname.startsWith('/course')} />
          <NavItem to="/library" icon="book" label="Library" active={pathname.startsWith('/library') || pathname.startsWith('/lecture')} />
          {isTeacher && <NavItem to="/record" icon="mic" label="Record" />}
          {isTeacher && <NavItem to="/analytics" icon="chart" label="Analytics" />}
        </nav>
        <div className="searchbox">
          <input
            type="search"
            placeholder="Search lectures, notes and transcripts"
            aria-label="Search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && doSearch()}
          />
          <button aria-label="Search" onClick={doSearch}>
            <Icon name="search" size={16} />
          </button>
        </div>
        <div className="topbar-right">
          <span
            className={'engine-pill' + (ai ? ' ai' : '')}
            title={ai ? 'Claude is generating notes, quizzes and answers' : 'Running with the built-in offline engine. Set ANTHROPIC_API_KEY for full AI.'}
          >
            <i />
            {ai ? 'Claude AI' : 'Offline engine'}
          </span>
          <div className="role-switch" role="group" aria-label="View as">
            <button className={isTeacher ? 'on' : ''} onClick={() => switchRole('teacher')}>
              Teacher
            </button>
            <button className={!isTeacher ? 'on' : ''} onClick={() => switchRole('student')}>
              Student
            </button>
          </div>
          <Menu
            trigger={(toggle) => (
              <button className="avatar" aria-label="Profile menu" onClick={toggle}>
                {(displayName[0] || 'U').toUpperCase()}
              </button>
            )}
            items={[
              { hd: `${displayName} · ${isTeacher ? 'Teacher' : 'Student'}` },
              { label: 'Change display name', icon: 'user', onClick: () => setNameOpen(true) },
              '-',
              { label: `Switch to ${isTeacher ? 'Student' : 'Teacher'} view`, icon: 'refresh', onClick: () => switchRole(isTeacher ? 'student' : 'teacher') },
            ]}
          />
        </div>
      </div>
      {nameOpen && <NameDialog onClose={() => setNameOpen(false)} />}
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="brand">
              <LogoMark />
              <span>
                ClassMind <b>AI</b>
              </span>
            </div>
            <p className="small" style={{ maxWidth: 320 }}>
              The AI learning layer for every classroom. Turn every lecture into personalised learning.
            </p>
            <p className="legal-note">AI-generated notes, quizzes and answers can contain mistakes. Please verify important information.</p>
          </div>
          <div>
            <h4>Learn</h4>
            <Link to="/">My learning</Link>
            <Link to="/library">Lecture library</Link>
          </div>
          <div>
            <h4>Teach</h4>
            <Link to="/record" className="teacher-only">Recording studio</Link>
            <Link to="/analytics" className="teacher-only">Analytics</Link>
          </div>
          <div>
            <h4>Legal</h4>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/cookies">Cookie Policy</Link>
          </div>
          <div>
            <h4>Support</h4>
            <Link to="/contact">Contact &amp; help</Link>
            <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
          </div>
        </div>
        <div className="copy">
          <span>
            © {new Date().getFullYear()} {site.operator} · Prototype
          </span>
          <nav aria-label="Legal">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/cookies">Cookies</Link>
            <Link to="/contact">Contact</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export function Layout() {
  const { pathname } = useLocation();
  // Scroll to top on navigation (the old hash router did the same)
  useScrollTop(pathname);
  return (
    <>
      <a className="skip-link" href="#app">
        Skip to main content
      </a>
      <Topbar />
      <main id="app" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <ConsentNotice />
    </>
  );
}

function useScrollTop(key: string) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [key]);
}
