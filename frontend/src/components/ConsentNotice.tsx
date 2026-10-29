import { useState } from 'react';
import { Link } from 'react-router-dom';
import { storage } from '../lib/storage';

/**
 * Informational notice: the app only uses essential local storage (no cookies,
 * no analytics), so this is an acknowledgement rather than a consent gate.
 */
export function ConsentNotice() {
  const [hidden, setHidden] = useState(() => storage.get('notice_ack', '') === '1');
  if (hidden) return null;
  return (
    <div className="consent" role="region" aria-label="Storage notice">
      <p>
        We use your browser&rsquo;s local storage only to remember your role, display name and flashcard progress. No cookies, no tracking.{' '}
        <Link to="/cookies">Learn more</Link> · <Link to="/privacy">Privacy Policy</Link>
      </p>
      <button
        className="btn btn-primary btn-sm"
        onClick={() => {
          storage.set('notice_ack', '1');
          setHidden(true);
        }}
      >
        Got it
      </button>
    </div>
  );
}
