import { useEffect, type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { Breadcrumb } from '../../components/Common';
import { site } from '../../config/site';

const LINKS = [
  ['/privacy', 'Privacy Policy'],
  ['/terms', 'Terms of Service'],
  ['/cookies', 'Cookie & Storage Policy'],
  ['/contact', 'Contact & Support'],
] as const;

interface Props {
  title: string;
  /** Show "Last updated" under the title (policies only). */
  dated?: boolean;
  children: ReactNode;
}

/** Shared frame for policy and info pages: breadcrumb, side navigation and a readable column. */
export function LegalPage({ title, dated = true, children }: Props) {
  useEffect(() => {
    document.title = `${title} | ${site.name}`;
    return () => {
      document.title = `${site.name} | The AI learning layer for every classroom`;
    };
  }, [title]);

  return (
    <div className="container page">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: title }]} />
      <div className="legal mt-24">
        <nav className="legal-nav" aria-label="Legal and support">
          <h4>Legal &amp; support</h4>
          {LINKS.map(([to, label]) => (
            <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'active' : '')}>
              {label}
            </NavLink>
          ))}
        </nav>
        <article className="legal-body">
          <h1>{title}</h1>
          {dated && <div className="updated">Last updated: {site.policyUpdated}</div>}
          {children}
        </article>
      </div>
    </div>
  );
}
