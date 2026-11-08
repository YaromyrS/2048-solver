/**
 * Site identity shared by metadata, the manifest, robots.txt, the sitemap and
 * the social card, so the name and canonical URL are defined in one place.
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

export const TAGLINE = 'Tell it your board and the AI works out the best swipe — move after move.';

export const DESCRIPTION =
  'Free 2048 AI that tells you the best swipe for the game you’re playing. Enter your board once, then just tap in each new tile. Runs in your browser.';
