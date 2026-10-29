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
  /** Social profiles; defaults to the platform home page until you set your own profile URL. */
  social: {
    linkedin: (env.VITE_LINKEDIN_URL as string | undefined) || 'https://www.linkedin.com',
    instagram: (env.VITE_INSTAGRAM_URL as string | undefined) || 'https://www.instagram.com',
    facebook: (env.VITE_FACEBOOK_URL as string | undefined) || 'https://www.facebook.com',
    twitter: (env.VITE_TWITTER_URL as string | undefined) || 'https://x.com',
    youtube: (env.VITE_YOUTUBE_URL as string | undefined) || 'https://www.youtube.com',
    github: (env.VITE_GITHUB_URL as string | undefined) || 'https://github.com',
  },
  /** Dates are shown on the policy pages; bump when the text changes. */
  policyUpdated: '29 October 2026',
} as const;
