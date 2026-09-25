/**
 * "How it works" and FAQ copy under the start screen.
 *
 * Besides helping first-time visitors, this is the page's only real prose, so
 * it is what search engines read to learn what the site is — keep the phrases
 * people search for ("2048 AI", "best move", "strategy") in plain text here.
 */
export function LandingInfo() {
  return (
    <section className="info" aria-labelledby="info-how">
      <h2 id="info-how" className="info__heading">
        How it works
      </h2>
      <ol className="info__steps">
        <li>
          <strong>Enter your board.</strong> New game? Tap your first two tiles. Already playing?
          Use <strong>Continue Game</strong> to copy your board.
        </li>
        <li>
          <strong>Swipe the way the AI says</strong> in your real game.
        </li>
        <li>
          <strong>Tap where the new tile appeared.</strong> The AI has already made the move on its
          copy of your board, so one tap per move is all it needs.
        </li>
      </ol>

      <h2 className="info__heading">Questions</h2>
      <h3 className="info__question">What kind of AI is this?</h3>
      <p className="info__answer">
        A game-playing search, not a chatbot. For every possible swipe it looks several moves
        ahead, averages over where the next 2 or 4 could appear (expectimax search), and scores
        each position with the heuristic from nneonneo’s well-known 2048 AI.
      </p>
      <h3 className="info__question">What strategy does it follow?</h3>
      <p className="info__answer">
        The classic one: keep the biggest tile in a corner with the others lined up behind it in
        descending order, while keeping cells free and merges ready. Watching which moves it picks
        is a quick way to get better at 2048 yourself.
      </p>
      <h3 className="info__question">Will it work with my 2048 game?</h3>
      <p className="info__answer">
        Yes, if it’s the standard 4×4 game where each swipe adds a 2 or a 4 — the original web
        version and most phone apps.
      </p>
      <h3 className="info__question">Is it free? Is my board sent anywhere?</h3>
      <p className="info__answer">
        It’s free, with no sign-up and no ads. The AI runs entirely in your browser, so your board
        never leaves your device.
      </p>
    </section>
  );
}
