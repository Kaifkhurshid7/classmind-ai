import { Link } from 'react-router-dom';
import { Icon, type IconName } from '../../components/Icon';
import { site } from '../../config/site';
import { LegalPage } from './LegalPage';

const FEATURES: { icon: IconName; title: string; text: string }[] = [
  { icon: 'mic', title: 'Live transcription', text: 'Record in the browser and watch a timestamped transcript appear as you speak, in English, Hindi or Odia. The original audio is saved with the lecture.' },
  { icon: 'file', title: 'Smart notes', text: 'Every lecture becomes a summary, key points, defined concepts and organised sections that teachers can edit and export to PDF or Markdown.' },
  { icon: 'message', title: 'AI tutor', text: 'Students ask questions and get answers grounded in what was actually taught, with options to explain simply, give an example or summarise.' },
  { icon: 'help', title: 'Quizzes and flashcards', text: 'Multiple-choice quizzes with explanations, short-answer practice and flashcards are created from each lecture automatically.' },
  { icon: 'target', title: 'Personal revision plans', text: 'A study plan built from a student’s weak quiz topics and the questions they asked, so revision time goes where it is needed.' },
  { icon: 'chart', title: 'Learning analytics', text: 'Teachers see quiz performance per lecture, the concepts students miss most, frequent questions and activity over time.' },
];

export function About() {
  return (
    <LegalPage title="About ClassMind AI" dated={false}>
      <p className="lead">
        {site.name} is the AI learning layer for every classroom. A teacher speaks, ClassMind records and transcribes the lecture, and AI turns it into structured notes, quizzes and a tutor that every student can learn from.
      </p>

      <h2>Our mission</h2>
      <p>
        Most of what is taught in a classroom is spoken once and then lost. We want every lecture to stay useful after the bell rings, so students can review it at their own pace, in their own language, and teachers can see where understanding breaks down.
      </p>

      <h2 id="features">What you can do</h2>
      <div className="feature-grid">
        {FEATURES.map((f) => (
          <div className="feature" key={f.title}>
            <span className="feature-icon">
              <Icon name={f.icon} size={20} />
            </span>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </div>
        ))}
      </div>

      <h2>Who it is for</h2>
      <ul>
        <li>
          <strong>Teachers and faculty</strong> who want to capture lectures effortlessly and understand how their students are doing.
        </li>
        <li>
          <strong>Students</strong> who want searchable notes, a patient tutor and practice material for exam preparation.
        </li>
        <li>
          <strong>Schools and colleges</strong> that want a private, self-hosted tool rather than sending classroom content to many separate services.
        </li>
      </ul>

      <h2>Privacy and trust</h2>
      <p>
        There is no advertising and no tracking. Lectures are stored on the server your organisation runs, and AI processing by Claude is optional. Read the <Link to="/privacy">Privacy Policy</Link> for details.
      </p>

      <div className="contact-card">
        Questions, feedback or a partnership idea? <Link to="/contact">Get in touch</Link> or browse the <Link to="/help">Help center</Link>.
      </div>
    </LegalPage>
  );
}
