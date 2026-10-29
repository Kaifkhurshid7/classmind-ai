import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';

type ToastType = '' | 'success' | 'error';
interface ToastItem {
  id: number;
  msg: string;
  type: ToastType;
}
type Notify = (msg: string, type?: ToastType, ms?: number) => void;

const Ctx = createContext<Notify | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const notify = useCallback<Notify>((msg, type = '', ms = 3200) => {
    const id = nextId.current++;
    setItems((cur) => [...cur, { id, msg, type }]);
    setTimeout(() => setItems((cur) => cur.filter((t) => t.id !== id)), ms);
  }, []);

  const value = useMemo(() => notify, [notify]);
  return (
    <Ctx.Provider value={value}>
      {children}
      <div className="toasts">
        {items.map((t) => (
          <div key={t.id} className={'toast ' + t.type} role="status">
            {t.msg}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useToast(): Notify {
  const v = useContext(Ctx);
  if (!v) throw new Error('useToast must be used inside ToastProvider');
  return v;
}
