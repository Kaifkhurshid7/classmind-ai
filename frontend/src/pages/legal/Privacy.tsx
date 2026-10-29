import { site } from '../../config/site';
import { LegalPage } from './LegalPage';

/*
 * NOTE: this is a good-faith template that describes how the software behaves.
 * Have it reviewed by a qualified lawyer for your jurisdiction before launch.
 */
export function Privacy() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        This policy explains what information {site.name} handles when teachers record lectures and students learn from them, how it is used, who it is shared with, and the choices you have.
        {site.operator} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) operates the service.
      </p>

      <h2>1. Information we handle</h2>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Examples</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Lecture content</td>
            <td>Audio recordings, transcripts, timestamps, AI-generated notes, summaries, quizzes and flashcards, lecture titles and languages.</td>
          </tr>
          <tr>
            <td>Learning activity</td>
            <td>Quiz attempts and scores, questions asked to the AI tutor and its answers, bookmarks, revision plans.</td>
          </tr>
          <tr>
            <td>Course information</td>
            <td>Course names, descriptions and colours.</td>
          </tr>
          <tr>
            <td>Browser-stored preferences</td>
            <td>Your chosen role (Teacher or Student), optional display name, and flashcard progress. These stay in your browser; see the Cookie &amp; Storage Policy.</td>
          </tr>
          <tr>
            <td>Technical data</td>
            <td>IP address, browser type and request logs created by the server or hosting provider for security and reliability.</td>
          </tr>
        </tbody>
      </table>
      <p>
        The current version does not require an account and does not ask for your email address, phone number or password. Please do not enter sensitive personal information (for example health or financial details) into lectures, notes or the tutor chat.
      </p>

      <h2>2. How we use information</h2>
      <ul>
        <li>To transcribe lectures and turn them into notes, quizzes, flashcards and revision plans.</li>
        <li>To let students review lectures, ask the AI tutor questions and track their own progress.</li>
        <li>To show teachers aggregated learning analytics, such as quiz performance and frequently asked questions.</li>
        <li>To keep the service secure, diagnose faults and improve reliability.</li>
      </ul>
      <p>We do not sell personal information and we do not use lecture content or student activity for advertising.</p>

      <h2>3. Third parties that process data</h2>
      <ul>
        <li>
          <strong>Speech recognition (your browser).</strong> Live transcription uses the speech service built into your browser. In Chrome and Edge, audio is sent to the browser vendor (Google or Microsoft) to be converted to text, under their privacy terms.
        </li>
        <li>
          <strong>AI processing (Anthropic).</strong> When the operator has enabled Claude, lecture transcripts, notes and student questions are sent to Anthropic&rsquo;s API to generate notes, quizzes, answers and revision plans. When no key is configured, a built-in offline engine runs on our own server and nothing is sent to an AI provider. The top bar shows which engine is active.
        </li>
        <li>
          <strong>Fonts (Google Fonts).</strong> Pages load the Source Sans typeface from Google Fonts, which means your browser contacts Google servers and your IP address is visible to them.
        </li>
        <li>
          <strong>Hosting.</strong> Data is stored on the infrastructure chosen by the operator of this deployment.
        </li>
      </ul>

      <h2>4. Recording and consent</h2>
      <p>
        Teachers who record are responsible for telling everyone who can be heard, and for obtaining any consent or school authorisation that applies, before recording starts. Do not record people who have not been informed. Recordings and transcripts are visible to everyone who can open the lecture within this deployment.
      </p>

      <h2>5. Storage and retention</h2>
      <p>
        Lecture content and learning activity are stored in a database and audio folder on the server and are kept until a teacher deletes them. Deleting a lecture permanently removes its transcript, notes, audio, chat history, bookmarks and quiz results from the live system. Copies may remain in routine backups until those backups expire. Server logs are kept only as long as needed for security and troubleshooting.
      </p>

      <h2>6. Security</h2>
      <p>
        We use reasonable technical and organisational measures, including restricted server access and encrypted connections (HTTPS) when the service is deployed with TLS. No online service can be guaranteed completely secure. This prototype does not yet have user authentication; operators should place it behind appropriate access controls (for example a school network or single sign-on) before using real student data.
      </p>

      <h2>7. Your rights</h2>
      <p>
        Depending on where you live (for example under India&rsquo;s Digital Personal Data Protection Act, 2023, the GDPR or similar laws), you may have the right to access, correct or delete your personal data, to withdraw consent, and to complain to a data protection authority. To make a request, email us at the address below. We may need to confirm who you are first, and the school or teacher who recorded a lecture may need to be involved.
      </p>

      <h2>8. Children and students</h2>
      <p>
        {site.name} is designed for use by schools and teachers. It is not directed at children under 13 acting on their own. Where students are minors, the school or institution is responsible for obtaining any parental consent or authorisation required by law before students use the service.
      </p>

      <h2>9. International transfers</h2>
      <p>
        Speech and AI providers may process data in other countries. Where required, we rely on appropriate safeguards for those transfers.
      </p>

      <h2>10. Changes to this policy</h2>
      <p>We will update this page when our practices change and revise the &ldquo;Last updated&rdquo; date. Material changes will be highlighted in the app.</p>

      <h2>11. Contact</h2>
      <div className="contact-card">
        <strong>{site.operator}</strong>
        <br />
        Privacy enquiries: <a href={`mailto:${site.privacyEmail}`}>{site.privacyEmail}</a>
        {site.address && (
          <>
            <br />
            {site.address}
          </>
        )}
      </div>
    </LegalPage>
  );
}
