import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Icon } from './Icon';

export interface SelectOption {
  value: string;
  label: string;
  /** Small secondary line under the label (for example the instructor). */
  hint?: string;
  /** Colour dot shown before the label (for example a course colour). */
  color?: string;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  ariaLabel: string;
  /** Text shown when no option matches the value. */
  placeholder?: string;
  className?: string;
  /** Width of the trigger; the menu is always at least as wide as its widest option. */
  width?: number | string;
  disabled?: boolean;
}

/**
 * Accessible replacement for the native <select>: consistent styling, readable long
 * labels, check mark on the selected item and keyboard support
 * (Arrow keys, Home/End, Enter/Space, Escape, type-ahead).
 */
export function Select({ value, onChange, options, ariaLabel, placeholder = 'Select…', className = '', width, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [dropUp, setDropUp] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const typed = useRef({ text: '', at: 0 });
  const listId = useId();

  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value));
  const selected = options.find((o) => o.value === value);

  const close = useCallback(() => setOpen(false), []);

  // close when clicking outside or when focus leaves
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) close();
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open, close]);

  // open upward when there is not enough room below
  useLayoutEffect(() => {
    if (!open || !root.current) return;
    const r = root.current.getBoundingClientRect();
    const need = Math.min(340, options.length * 46 + 16);
    setDropUp(window.innerHeight - r.bottom < need && r.top > need);
  }, [open, options.length]);

  // keep the active option visible
  useEffect(() => {
    if (!open) return;
    list.current?.children[active]?.scrollIntoView({ block: 'nearest' });
  }, [active, open]);

  const openMenu = () => {
    if (disabled) return;
    setActive(selectedIndex);
    setOpen(true);
  };

  const choose = (i: number) => {
    onChange(options[i].value);
    close();
    root.current?.querySelector<HTMLButtonElement>('button')?.focus();
  };

  const onKey = (e: KeyboardEvent) => {
    if (disabled) return;
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        openMenu();
      }
      return;
    }
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        close();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setActive((a) => Math.min(options.length - 1, a + 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActive((a) => Math.max(0, a - 1));
        break;
      case 'Home':
        e.preventDefault();
        setActive(0);
        break;
      case 'End':
        e.preventDefault();
        setActive(options.length - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        choose(active);
        break;
      case 'Tab':
        close();
        break;
      default:
        // type-ahead: jump to the next option that starts with what was typed
        if (e.key.length === 1) {
          const now = Date.now();
          const t = typed.current;
          t.text = now - t.at > 700 ? e.key.toLowerCase() : t.text + e.key.toLowerCase();
          t.at = now;
          const i = options.findIndex((o) => o.label.toLowerCase().startsWith(t.text));
          if (i >= 0) setActive(i);
        }
    }
  };

  return (
    <div className={'select ' + className} ref={root} style={width !== undefined ? { width } : undefined} onKeyDown={onKey}>
      <button
        type="button"
        className={'select-trigger' + (open ? ' open' : '')}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => (open ? close() : openMenu())}
      >
        {selected?.color && <i className="select-dot" style={{ background: selected.color }} />}
        <span className={'select-value' + (selected ? '' : ' placeholder')}>{selected ? selected.label : placeholder}</span>
        <Icon name="down" size={16} className="select-chevron" />
      </button>
      {open && (
        <ul id={listId} className={'select-menu' + (dropUp ? ' up' : '')} role="listbox" aria-label={ariaLabel} ref={list} tabIndex={-1}>
          {options.map((o, i) => (
            <li
              key={o.value}
              role="option"
              aria-selected={o.value === value}
              className={(i === active ? 'active ' : '') + (o.value === value ? 'selected' : '')}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => choose(i)}
            >
              {o.color ? <i className="select-dot" style={{ background: o.color }} /> : <i className="select-dot none" />}
              <span className="select-text">
                {o.label}
                {o.hint && <em>{o.hint}</em>}
              </span>
              {o.value === value && <Icon name="check" size={16} className="select-check" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
