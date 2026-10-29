import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { storage } from '../lib/storage';

export type Role = 'teacher' | 'student';

interface RoleState {
  role: Role;
  name: string;
  isTeacher: boolean;
  displayName: string;
  setRole: (r: Role) => void;
  setName: (n: string) => void;
}

const Ctx = createContext<RoleState | null>(null);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>(() => (storage.get('role', 'teacher') === 'student' ? 'student' : 'teacher'));
  const [name, setNameState] = useState(() => storage.get('name', ''));

  // Existing stylesheet hides .teacher-only elements when body has .role-student
  useEffect(() => {
    document.body.classList.toggle('role-student', role === 'student');
  }, [role]);

  const setRole = useCallback((r: Role) => {
    setRoleState(r);
    storage.set('role', r);
  }, []);
  const setName = useCallback((n: string) => {
    setNameState(n);
    storage.set('name', n);
  }, []);

  const value = useMemo<RoleState>(() => {
    const isTeacher = role === 'teacher';
    return { role, name, isTeacher, displayName: name || (isTeacher ? 'Teacher' : 'Learner'), setRole, setName };
  }, [role, name, setRole, setName]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useRole(): RoleState {
  const v = useContext(Ctx);
  if (!v) throw new Error('useRole must be used inside RoleProvider');
  return v;
}
