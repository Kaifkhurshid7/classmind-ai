/** localStorage wrapper that never throws (private mode, blocked storage). */
export const storage = {
  get(key: string, fallback: string): string {
    try {
      const v = localStorage.getItem('cm_' + key);
      return v === null ? fallback : v;
    } catch {
      return fallback;
    }
  },
  set(key: string, value: string): void {
    try {
      localStorage.setItem('cm_' + key, value);
    } catch {
      /* ignore */
    }
  },
};
