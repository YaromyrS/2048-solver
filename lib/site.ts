/**
 * Site identity shared by metadata, the manifest, robots.txt, the sitemap and
 * the social card, so the name and canonical URL are defined in one place. The
 * name is a brand and stays in English on every language's page.
 *
 * SITE_URL is the canonical production domain. It is fixed rather than read
 * from VERCEL_PROJECT_PRODUCTION_URL because the project has more than one
 * vercel.app alias (the old 2048-solver-ten one redirects here), and search
 * engines need a single stable URL for the sitemap and canonical link.
 */
export const SITE_URL = 'https://2048-solver-ai.vercel.app';

export const SITE_NAME = '2048 AI Solver';

export const REPO_URL = 'https://github.com/YaromyrS/2048-solver';

/** Opens GitHub's bug-report form (.github/ISSUE_TEMPLATE/bug_report.yml). */
export const BUG_REPORT_URL = `${REPO_URL}/issues/new?template=bug_report.yml`;

/**
 * Donations: a monobank jar. Stripe- and PayPal-based tip sites (Ko-fi, Buy Me a
 * Coffee) can't pay out to Ukraine.
 */
export const DONATE_URL = 'https://send.monobank.ua/jar/6BdkNMdYJJ';

// The tagline, description and all other UI text live in lib/i18n/messages/.
