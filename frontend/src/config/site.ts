/**
 * Organisation details shown in the footer and legal pages.
 * Override per deployment with VITE_* variables (see frontend/.env.example).
 */
const env = import.meta.env;

export const site = {
  name: 'ClassMind AI',
  /** Legal entity that operates the service. Replace before going live. */
  operator: (env.VITE_OPERATOR_NAME as string | undefined) || 'ClassMind AI',
  contactEmail: (env.VITE_CONTACT_EMAIL as string | undefined) || 'support@classmind.example',
  privacyEmail: (env.VITE_PRIVACY_EMAIL as string | undefined) || (env.VITE_CONTACT_EMAIL as string | undefined) || 'privacy@classmind.example',
  address: (env.VITE_OPERATOR_ADDRESS as string | undefined) || '',
  governingLaw: (env.VITE_GOVERNING_LAW as string | undefined) || 'India',
  /** Social profiles; only the ones you set are shown in the footer. */
  social: {
    linkedin: (env.VITE_LINKEDIN_URL as string | undefined) || '',
    youtube: (env.VITE_YOUTUBE_URL as string | undefined) || '',
    twitter: (env.VITE_TWITTER_URL as string | undefined) || '',
    github: (env.VITE_GITHUB_URL as string | undefined) || '',
  },
  /** Dates are shown on the policy pages; bump when the text changes. */
  policyUpdated: '29 October 2026',
} as const;
