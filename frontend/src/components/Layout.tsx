import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useStatus } from '../api/queries';
import { useRole } from '../context/RoleContext';
import { ConsentNotice } from './ConsentNotice';
import { Footer } from './Footer';
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

export function Layout() {
  const { pathname, hash } = useLocation();
  useScrollTop(pathname, hash);
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

/** Scroll to the top on navigation, or to the #section when the link has one. */
function useScrollTop(pathname: string, hash: string) {
  useEffect(() => {
    if (hash) {
      // wait a moment so the target page has rendered
      const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
      return () => clearTimeout(t);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
}
