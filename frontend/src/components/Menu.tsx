import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Icon, type IconName } from './Icon';

export type MenuItem =
  | '-'
  | { hd: string }
  | { label: string; icon?: IconName; href?: string; onClick?: () => void };

interface Props {
  items: MenuItem[];
  /** Renders the trigger button; call toggle() on click. */
  trigger: (toggle: () => void) => ReactNode;
}

export function Menu({ items, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const outside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', outside, true);
    return () => document.removeEventListener('click', outside, true);
  }, [open]);

  return (
    <div className="menu-wrap" ref={ref}>
      {trigger(() => setOpen((o) => !o))}
      {open && (
        <div className="menu">
          {items.map((it, i) => {
            if (it === '-') return <hr key={i} />;
            if ('hd' in it) return <div key={i} className="hd">{it.hd}</div>;
            const inner = (
              <>
                {it.icon && <Icon name={it.icon} size={16} />}
                {it.label}
              </>
            );
            if (it.href)
              return (
                <a key={i} href={it.href} onClick={() => setOpen(false)}>
                  {inner}
                </a>
              );
            return (
              <button
                key={i}
                onClick={() => {
                  setOpen(false);
                  it.onClick?.();
                }}
              >
                {inner}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
