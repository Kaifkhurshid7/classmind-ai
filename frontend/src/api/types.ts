export interface Concept {
  term: string;
  definition: string;
}
export interface Section {
  heading: string;
  points: string[];
}
export interface PracticeQuestion {
  question: string;
  answer: string;
}
export interface Notes {
  title?: string;
  summary?: string;
  key_points?: string[];
  concepts?: Concept[];
  sections?: Section[];
  practice_questions?: PracticeQuestion[];
  engine?: string;
  engine_note?: string;
}

export interface Course {
  id: number;
  name: string;
  description: string;
  color: string;
  created: number;
}
export interface CourseCardData {
  id: number;
  name: string;
  description: string;
  color: string;
  lectures: number;
  progress: number;
  avg: number | null;
}
export interface CourseDetail extends Course {
  lectures: LectureSummary[];
  progress: number;
  avg: number | null;
  hours: number;
  minutes: number;
}

export interface LectureSummary {
  id: number;
  course_id: number | null;
  course_name: string | null;
  course_color: string | null;
  title: string;
  duration: number;
  created: number;
  updated: number;
  lang: string;
  has_audio: boolean;
  words: number;
  summary: string;
  concepts: number;
  attempts: number;
  best: number | null;
  avg: number | null;
  snippet?: string;
}
export interface Segment {
  t: number | null;
  text: string;
}
export interface LectureFull extends LectureSummary {
  transcript: string;
  segments: Segment[];
  notes: Notes;
}
export interface Bookmark {
  id: number;
  t: number | null;
  text: string;
}
export interface ChatMessage {
  id?: number;
  role: 'user' | 'assistant';
  content: string;
}
export interface AttemptSummary {
  id: number;
  score: number;
  total: number;
  created: number;
}
export interface WeakTopic {
  topic: string;
  correct: number;
  total: number;
  accuracy: number;
}
export interface LectureDetail {
  lecture: LectureFull;
  bookmarks: Bookmark[];
  chat: ChatMessage[];
  attempts: AttemptSummary[];
  siblings: LectureSummary[];
  quiz_size: number;
  weak_topics: WeakTopic[];
}

export interface Overview {
  stats: { lectures: number; courses: number; hours: number; minutes: number; quizzes: number; avg: number | null };
  courses: CourseCardData[];
  lectures: LectureSummary[];
  continue: LectureSummary | null;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  topic: string;
}
export interface AttemptDetail {
  question: string;
  options: string[];
  topic: string;
  chosen: number | null;
  answer_index: number;
  correct: boolean;
  explanation: string;
}
export interface AttemptResult {
  score: number;
  total: number;
  details: AttemptDetail[];
}

export interface RevisionPlan {
  summary: string;
  steps: { title: string; detail: string; minutes: number }[];
  weak_topics?: WeakTopic[];
}

export interface Analytics {
  totals: { lectures: number; minutes: number; words: number; questions: number; attempts: number; avg: number | null };
  per_lecture: { id: number; title: string; course: string | null; attempts: number; avg: number | null; best: number | null }[];
  weak_topics: WeakTopic[];
  top_questions: { question: string; count: number; lecture_id: number; lecture: string; created: number }[];
  activity: { day: string; count: number }[];
}
