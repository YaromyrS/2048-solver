import { Fragment } from 'react';
import { useMessages } from '@/components/I18nProvider';
import { Rich } from '@/components/Rich';

/**
 * "How it works" and FAQ copy under the start screen.
 *
 * Besides helping first-time visitors, this is the page's only real prose, so
 * it is what search engines read to learn what the site is. The text lives in
 * the `info` messages, which keep each language's search phrases ("2048 AI",
 * "best move", "strategy") in plain text.
 */
export function LandingInfo() {
  const t = useMessages();
  return (
    <section className="info" aria-labelledby="info-how">
      <h2 id="info-how" className="info__heading">
        {t.info.howHeading}
      </h2>
      <ol className="info__steps">
        {t.info.steps.map((step) => (
          <li key={step}>
            <Rich text={step} />
          </li>
        ))}
      </ol>

      <h2 className="info__heading">{t.info.faqHeading}</h2>
      {t.info.faq.map(({ q, a }) => (
        <Fragment key={q}>
          <h3 className="info__question">{q}</h3>
          <p className="info__answer">
            <Rich text={a} />
          </p>
        </Fragment>
      ))}
    </section>
  );
}
