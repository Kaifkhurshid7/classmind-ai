import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { Icon } from './Icon';

export interface ModalAction {
  label: string;
  className?: string;
  /** Return false to keep the modal open (e.g. validation failed). */
  onClick?: () => void | boolean | Promise<void | boolean>;
}

interface ModalProps {
  title: string;
  children: ReactNode;
  actions?: ModalAction[];
  wide?: boolean;
  onClose: () => void;
}

export function Modal({ title, children, actions = [], wide = false, onClose }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', esc);
    ref.current?.querySelector<HTMLElement>('input, textarea, select')?.focus();
    return () => document.removeEventListener('keydown', esc);
  }, [onClose]);

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && !wide && onClose()}>
      <div className={'modal' + (wide ? ' wide' : '')} role="dialog" aria-modal="true" ref={ref}>
        <div className="modal-head">
          <h3>{title}</h3>
          <button className="icon-btn" aria-label="Close" onClick={onClose}>
            <Icon name="x" />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {actions.length > 0 && (
          <div className="modal-foot">
            {actions.map((a) => (
              <button
                key={a.label}
                className={'btn ' + (a.className || 'btn-ghost')}
                onClick={async () => {
                  const keepOpen = a.onClick ? (await a.onClick()) === false : false;
                  if (!keepOpen) onClose();
                }}
              >
                {a.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---- imperative confirm() ---- */
interface ConfirmOptions {
  title: string;
  message: string;
  okLabel?: string;
  danger?: boolean;
}
type Confirm = (opts: ConfirmOptions) => Promise<boolean>;
const ConfirmCtx = createContext<Confirm | null>(null);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ opts: ConfirmOptions; resolve: (v: boolean) => void } | null>(null);

  const confirm = useCallback<Confirm>((opts) => new Promise((resolve) => setState({ opts, resolve })), []);
  const finish = (v: boolean) => {
    state?.resolve(v);
    setState(null);
  };

  return (
    <ConfirmCtx.Provider value={confirm}>
      {children}
      {state && (
        <Modal
          title={state.opts.title}
          onClose={() => finish(false)}
          actions={[
            { label: 'Cancel', className: 'btn-ghost', onClick: () => finish(false) },
            { label: state.opts.okLabel || 'Delete', className: state.opts.danger === false ? 'btn-primary' : 'btn-record', onClick: () => finish(true) },
          ]}
        >
          <p>{state.opts.message}</p>
        </Modal>
      )}
    </ConfirmCtx.Provider>
  );
}

export function useConfirm(): Confirm {
  const v = useContext(ConfirmCtx);
  if (!v) throw new Error('useConfirm must be used inside ConfirmProvider');
  return v;
}
