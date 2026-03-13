export const SITE = {
  name: 'Archipelago Technics',
  title: 'Archipelago Technics | Your IT Partner in the Turku Area',
  description:
    'Reliable IT solutions for businesses and individuals. Serving Turku, Parainen and Kaarina with managed services, Microsoft 365, and cybersecurity.',
  url:
    (typeof process !== 'undefined' && process.env.SITE_URL) ||
    'https://a-t.fi',
  twitterHandle: '',
  socials: {
    twitter: '',
    github: '',
    linkedin: 'https://linkedin.com/company/archipelagotechnics',
    facebook: 'https://www.facebook.com/archipelagotechnics',
  },
  image: {
    // Default social image; override per page when needed
    src: 'https://cdn.pagesmith.app/eb31781e/images/atlogo-225-225.webp',
    alt: 'Archipelago Technics Logo',
  },
} as const;

export type SiteConfig = typeof SITE;
