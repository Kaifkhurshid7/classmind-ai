import { Link } from 'react-router-dom';
import { site } from '../../config/site';
import { LegalPage } from './LegalPage';

/*
 * NOTE: template terms. Have them reviewed by a qualified lawyer for your
 * jurisdiction (and update the governing law / operator details) before launch.
 */
export function Terms() {
  return (
    <LegalPage title="Terms of Service">
      <p>
        These terms govern your use of {site.name}, operated by {site.operator}. By using the service you agree to them. If you use it on behalf of a school or organisation, you confirm that you are authorised to accept these terms for it.
      </p>

      <h2>1. The service</h2>
      <p>
        {site.name} lets teachers record and transcribe lectures and lets students learn from them with AI-generated notes, a tutor, quizzes, flashcards and analytics. The service is currently a <strong>prototype</strong>: features may change, be interrupted or be removed, and it is provided without a service-level commitment.
      </p>

      <h2>2. Roles and access</h2>
      <p>
        The Teacher and Student views are a convenience for demonstrating the product and are not a security boundary. Anyone who can reach this deployment can use either view. Operators are responsible for restricting access to authorised people.
      </p>

      <h2>3. Your content</h2>
      <ul>
        <li>You keep ownership of the recordings, transcripts and other material you add (&ldquo;your content&rdquo;).</li>
        <li>You give us permission to store, process and display your content, including sending it to the speech and AI providers described in the <Link to="/privacy">Privacy Policy</Link>, solely to run the service.</li>
        <li>You confirm that you have the rights and consents needed to record and upload your content, including the consent of people who can be heard on a recording.</li>
      </ul>

      <h2>4. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>record or upload content without the required consent, or that infringes anyone&rsquo;s intellectual property, privacy or other rights;</li>
        <li>upload unlawful, harassing, hateful, sexually explicit or otherwise harmful material;</li>
        <li>enter sensitive personal data (such as health or financial information) into lectures, notes or the tutor;</li>
        <li>attempt to disrupt, probe or bypass the security of the service, or overload it with automated requests;</li>
        <li>use the service to cheat on assessments where this is prohibited by your institution.</li>
      </ul>
      <p>We may remove content or restrict access that breaks these rules or the law.</p>

      <h2>5. AI-generated content</h2>
      <p>
        Notes, quizzes, answers and revision plans are generated automatically and can be incomplete, outdated or wrong. The tutor is designed to answer from the lecture, but it may still make mistakes. Check important information against your teacher&rsquo;s materials and trusted sources. AI output is a study aid, not professional, academic or legal advice, and not a substitute for the teacher.
      </p>

      <h2>6. Intellectual property</h2>
      <p>
        The software, design, trademarks and documentation of {site.name} belong to {site.operator} or its licensors. These terms do not give you any rights in them other than the right to use the service as intended.
      </p>

      <h2>7. Privacy</h2>
      <p>
        Our handling of personal information is described in the <Link to="/privacy">Privacy Policy</Link> and the <Link to="/cookies">Cookie &amp; Storage Policy</Link>.
      </p>

      <h2>8. Disclaimers</h2>
      <p>
        To the extent permitted by law, the service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind, including fitness for a particular purpose, accuracy, or uninterrupted or error-free operation. Speech recognition accuracy depends on your browser, microphone, accent and environment.
      </p>

      <h2>9. Limitation of liability</h2>
      <p>
        To the extent permitted by law, {site.operator} is not liable for indirect, incidental or consequential losses, or for loss of data, profits or goodwill, arising from use of the service. Nothing in these terms limits liability that cannot be limited by law.
      </p>

      <h2>10. Suspension and termination</h2>
      <p>
        You may stop using the service at any time and teachers can delete their lectures. We may suspend or end access if these terms are breached or if needed to protect the service or other users.
      </p>

      <h2>11. Changes</h2>
      <p>We may update these terms. The &ldquo;Last updated&rdquo; date shows the current version, and continued use after a change means you accept the updated terms.</p>

      <h2>12. Governing law</h2>
      <p>These terms are governed by the laws of {site.governingLaw}, and the courts of {site.governingLaw} have jurisdiction, subject to any mandatory consumer rights where you live.</p>

      <h2>13. Contact</h2>
      <div className="contact-card">
        Questions about these terms: <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
      </div>
    </LegalPage>
  );
}
