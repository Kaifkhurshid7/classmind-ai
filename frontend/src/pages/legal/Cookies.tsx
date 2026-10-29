import { Link } from 'react-router-dom';
import { site } from '../../config/site';
import { LegalPage } from './LegalPage';

export function Cookies() {
  return (
    <LegalPage title="Cookie & Storage Policy">
      <p>
        {site.name} does <strong>not</strong> set cookies, and does not use advertising, analytics or tracking technologies. It does use your browser&rsquo;s local storage to remember a few settings so the app works the way you left it.
      </p>

      <h2>What is stored in your browser</h2>
      <table>
        <thead>
          <tr>
            <th>Key</th>
            <th>Purpose</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>cm_role</code>
            </td>
            <td>Remembers whether you are in the Teacher or Student view.</td>
            <td>Essential, local storage</td>
          </tr>
          <tr>
            <td>
              <code>cm_name</code>
            </td>
            <td>Your optional display name, shown in the app.</td>
            <td>Essential, local storage</td>
          </tr>
          <tr>
            <td>
              <code>cm_fc_&lt;lecture&gt;</code>
            </td>
            <td>Which flashcards you have marked as mastered for a lecture.</td>
            <td>Essential, local storage</td>
          </tr>
          <tr>
            <td>
              <code>cm_notice_ack</code>
            </td>
            <td>Remembers that you dismissed the storage notice.</td>
            <td>Essential, local storage</td>
          </tr>
        </tbody>
      </table>
      <p>This information stays on your device and is not sent to our servers. Because it is strictly needed to provide features you asked for, it does not require a consent choice.</p>

      <h2>Third-party requests</h2>
      <p>
        Pages load the Source Sans font from Google Fonts. Your browser contacts Google to fetch it, which can expose your IP address and browser details to Google. Live transcription may also send audio to your browser vendor&rsquo;s speech service, as described in the <Link to="/privacy">Privacy Policy</Link>.
      </p>

      <h2>Managing stored data</h2>
      <p>
        You can remove everything the app has stored by clearing site data for this website in your browser settings. Doing so resets your role, display name and flashcard progress. It does not delete lectures stored on the server; teachers can delete those from the lecture page.
      </p>

      <h2>Contact</h2>
      <div className="contact-card">
        Questions: <a href={`mailto:${site.privacyEmail}`}>{site.privacyEmail}</a>
      </div>
    </LegalPage>
  );
}
