import { Link } from 'react-router-dom';
import { site } from '../../config/site';
import { LegalPage } from './LegalPage';

export function Contact() {
  return (
    <LegalPage title="Contact & Support" dated={false}>
      <p>We are happy to help with questions about using {site.name}, problems with a recording, or requests about your data.</p>

      <h2>Get in touch</h2>
      <div className="contact-card">
        <strong>General support and feedback</strong>
        <br />
        <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
        <br />
        <br />
        <strong>Privacy requests (access, correction, deletion)</strong>
        <br />
        <a href={`mailto:${site.privacyEmail}`}>{site.privacyEmail}</a>
        {site.address && (
          <>
            <br />
            <br />
            <strong>Postal address</strong>
            <br />
            {site.address}
          </>
        )}
      </div>

      <h2>Quick answers</h2>
      <h3 style={{ fontSize: 17, margin: '18px 0 6px' }}>The microphone does not work</h3>
      <p>Use Chrome or Edge, open the app on localhost or an HTTPS address, and allow microphone access in the address bar. Live transcription also needs an internet connection.</p>

      <h3 style={{ fontSize: 17, margin: '18px 0 6px' }}>My language is not transcribed correctly</h3>
      <p>Choose the speech language in the recording studio before you start. You can fix mistakes afterwards with Edit transcript on the lecture page.</p>

      <h3 style={{ fontSize: 17, margin: '18px 0 6px' }}>How do I delete a lecture or my data?</h3>
      <p>
        Teachers can delete a lecture from its page, which removes the transcript, notes, audio, chat and quiz results. For anything else, email the privacy address above. See the <Link to="/privacy">Privacy Policy</Link> for details.
      </p>

      <h3 style={{ fontSize: 17, margin: '18px 0 6px' }}>Are the AI answers always correct?</h3>
      <p>No. They are a study aid and can contain mistakes. Please check important points against your teacher&rsquo;s materials.</p>

      <h2>Reporting a problem or abuse</h2>
      <p>
        If you believe content on this service is unlawful, infringes your rights, or was recorded without consent, email us with the lecture link and a short description. See also our <Link to="/terms">Terms of Service</Link>.
      </p>
    </LegalPage>
  );
}
