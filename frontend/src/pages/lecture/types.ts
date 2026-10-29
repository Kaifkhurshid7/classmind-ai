import type { LectureDetail } from '../../api/types';

export type TabKey = 'overview' | 'notes' | 'transcript' | 'ask' | 'quiz' | 'flashcards';

/** Props shared by every lecture tab. */
export interface TabProps {
  id: string;
  detail: LectureDetail;
  /** Refetch the lecture (after any mutation). */
  refresh: () => Promise<unknown>;
  setTab: (tab: TabKey) => void;
}
