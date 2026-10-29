import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { LegalPage } from './LegalPage';

interface Faq {
  q: string;
  a: ReactNode;
}

const TEACHERS: Faq[] = [
  {
    q: 'How do I record a lecture?',
    a: (
      <>
        Open <Link to="/record">Recording studio</Link> from the top bar, give the lecture a title, choose the course and speech language, and press Start recording. Allow microphone access when your browser asks. Press Stop and save when you finish; the notes and quiz are generated automatically.
      </>
    ),
  },
  { q: 'Which browsers support live transcription?', a: 'Chrome and Edge. Other browsers can still record audio, and you can paste or upload a transcript instead. Live transcription also needs an internet connection.' },
  { q: 'Can I fix mistakes in the transcript or notes?', a: 'Yes. On the lecture page use Edit transcript (this regenerates the notes and quiz) or Edit notes to change the summary, key points, concepts and sections directly.' },
  { q: 'How do I share notes with students?', a: 'Students open the lecture from the library. You can also download the notes as a PDF, Markdown or plain text from the Download menu on the lecture page.' },
  { q: 'What do the analytics show?', a: 'Quiz performance for each lecture and course, score trends, the topics students get wrong most often, the questions they ask the AI tutor, and recent activity. Frequent questions often point to parts of a lecture that were unclear.' },
];

const STUDENTS: Faq[] = [
  { q: 'How does the AI tutor work?', a: 'It answers from the lecture transcript, so its answers stay tied to what was taught. Choose Explain simply or Give an example to change the style. Your conversation is saved with the lecture.' },
  { q: 'How are quizzes scored?', a: 'Answers are revealed only after you submit. You see your score, the correct answers with explanations and the topics to revisit. Every attempt is saved, and weak topics feed your revision plan.' },
  { q: 'What are flashcards for?', a: 'They are made from the key concepts and practice questions of a lecture. Use the arrow keys to move, Space to flip, and mark cards as mastered to track progress.' },
  { q: 'Can I jump to a moment in the recording?', a: 'For lectures recorded in the studio, click any timestamp in the Transcript tab to play from that line. Use the star icon to bookmark moments you want to revisit.' },
];

const GENERAL: Faq[] = [
  { q: 'Are the AI answers always correct?', a: 'No. Notes, quizzes and answers are generated automatically and can contain mistakes. Check important points against your teacher’s materials.' },
  { q: 'What is the difference between Claude AI and the offline engine?', a: 'With an Anthropic API key the app uses Claude for much higher quality notes, quizzes and answers. Without a key it falls back to a built-in keyword-based engine that works fully offline. The top bar shows which one is active.' },
  {
    q: 'Where is my data stored and can I delete it?',
    a: (
      <>
        Lectures are stored on your organisation&rsquo;s server. Teachers can delete a lecture at any time, which removes its transcript, notes, audio, chat and quiz results. See the <Link to="/privacy">Privacy Policy</Link>.
      </>
    ),
  },
  { q: 'The microphone is not working. What should I check?', a: 'Use Chrome or Edge, open the app on localhost or an HTTPS address, and allow microphone access from the address bar. Check that no other app is using the microphone.' },
];

function Section({ id, title, items }: { id: string; title: string; items: Faq[] }) {
  return (
    <>
      <h2 id={id}>{title}</h2>
      <div className="faq">
        {items.map((f) => (
          <details key={f.q}>
            <summary>{f.q}</summary>
            <div>
              <p>{f.a}</p>
            </div>
          </details>
        ))}
      </div>
    </>
  );
}

export function Help() {
  return (
    <LegalPage title="Help center" dated={false}>
      <p className="lead">
        Quick answers to common questions. Can&rsquo;t find what you need? <Link to="/contact">Contact us</Link>.
      </p>
      <Section id="teachers" title="For teachers" items={TEACHERS} />
      <Section id="students" title="For students" items={STUDENTS} />
      <Section id="general" title="AI, privacy and troubleshooting" items={GENERAL} />
    </LegalPage>
  );
}
