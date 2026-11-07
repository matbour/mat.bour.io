// Everything personal about the site lives here, so you never have to dig
// through layouts to change your name, links or tagline.
export const SITE = {
  url: 'https://mat.bour.io',
  title: 'Mathieu Bour',
  author: 'Mathieu Bour',
  description: 'Writing about software engineering, my work, the things I build at home, and tennis.',
  locale: 'en',
  email: 'mat@bour.io',
  links: [
    { label: 'GitHub', href: 'https://github.com/matbour' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mathieu-bour/' },
    { label: 'Email', href: 'mailto:mat@bour.io' },
    { label: 'RSS', href: '/rss.xml' },
  ],
} as const;

export const NAV = [
  { label: 'Writing', href: '/' },
  { label: 'Experience', href: '/experience/' },
  { label: 'Projects', href: '/projects/' },
  { label: 'About', href: '/about/' },
] as const;

// Order here is the order of the filter row on the home page.
export const CATEGORIES = {
  tech: 'Tech',
  work: 'Work',
  'side-projects': 'Side projects',
  tennis: 'Tennis',
  life: 'Life',
} as const;

export type Category = keyof typeof CATEGORIES;
