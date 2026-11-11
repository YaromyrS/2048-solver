/**
 * English UI text, and the shape every other language must match.
 *
 * Conventions shared by all languages:
 * - `{name}` is a placeholder filled in by the code (see format.ts). Every
 *   translation keeps exactly the same placeholders as English.
 * - `**text**` renders as bold (see components/Rich.tsx).
 * - Write "AI" with no article in English copy: "AI looks ahead", never "the AI".
 * - Counts are phrased so the noun doesn't depend on the number (no plurals
 *   logic), e.g. "Tiles read: 12".
 */
const en = {
  meta: {
    title: '2048 AI Solver – Best Next Move, One Tap per Move',
    description:
      'Free 2048 AI that tells you the best swipe for the game you’re playing. Enter your board once, then just tap in each new tile. Runs in your browser.',
  },
  tagline: 'Enter your board — AI looks several moves ahead and finds you the best swipe.',
  /** In-sentence form: "swipe {direction}". */
  directions: { up: 'up', down: 'down', left: 'left', right: 'right' },
  /** Stand-alone label under the big arrow. */
  directionLabels: { up: 'Up', down: 'Down', left: 'Left', right: 'Right' },
  topbar: {
    homeTitle: 'Back to the start screen',
    undo: 'Undo last move',
    menu: 'Back to menu',
    restart: 'Restart game',
  },
  landing: {
    start: 'Start Solving',
    startTitle: 'New game: tap your first two tiles and get the best move',
    continue: 'Continue Game',
    continueTitle: 'Already playing? Copy your board or import a screenshot of it',
    hintLimit:
      'By default AI plays up to **1024** and avoids making a 2048, which ends the game in many versions. Change this in **Advanced settings**.',
    hintContinue:
      'Already mid-game? Use **Continue Game** to recreate your current board, or import a screenshot of it.',
  },
  demo: {
    label: 'Demo',
    play: 'Play demo',
    pause: 'Pause demo',
    swipe: 'swipe {direction}',
  },
  /**
   * "How it works" and the FAQ: the page's only real prose, so it is what
   * search engines read. Keep the phrases people search for in each language.
   */
  info: {
    howHeading: 'How it works',
    steps: [
      '**Enter your board.** New game? Tap your first two tiles. Already playing? Use **Continue Game** to copy your board.',
      '**Swipe the way AI says** in your real game.',
      '**Tap where the new tile appeared.** One tap per move — AI tracks the rest.',
    ],
    faqHeading: 'Questions',
    faq: [
      {
        q: 'What kind of AI is this?',
        a: 'A game-playing search, not a chatbot. For every possible swipe it looks several moves ahead, averages over where the next 2 or 4 could appear (expectimax search), and scores each position with the heuristic from nneonneo’s well-known 2048 AI.',
      },
      {
        q: 'What strategy does it follow?',
        a: 'The classic one: keep the biggest tile in a corner with the others lined up behind it in descending order, while keeping cells free and merges ready. Watching which moves it picks is a quick way to get better at 2048 yourself.',
      },
      {
        q: 'Will it work with my 2048 game?',
        a: 'Yes, if it’s the standard 4×4 game where each swipe adds a 2 or a 4 — the original web version and most phone apps.',
      },
      {
        q: 'Can it read my board from a screenshot?',
        a: 'Yes. Choose **Continue Game**, then import a screenshot of your game (or paste one). It reads the original 2048 and play2048.co, in light or dark mode. Check the board before solving: any tile it wasn’t sure about is outlined.',
      },
      {
        q: 'Is it free? Is my board sent anywhere?',
        a: 'It’s free, with no sign-up and no ads. AI runs entirely in your browser, so your board never leaves your device. Screenshots are read on your device too, never uploaded.',
      },
    ],
  },
  /** Screen-reader text for boards and cells. */
  board: {
    yourBoard: 'Your board',
    row: 'row {row}: {cells}',
    empty: 'empty',
    emptyCell: 'Empty cell',
    tile: 'Tile {value}',
    cell: '{what} at row {row}, column {col}',
    flagged: '{label} (please check)',
  },
  status: {
    calculating: 'Calculating best move…',
    bestMove: 'Best move: swipe {direction}.',
    outOfMoves: 'You’re out of moves.',
  },
  setup: {
    lead: 'Place your first two tiles (both are **2**) — tap two empty cells.',
    progress: '{count}/{total} placed.',
    cellHint: 'Place a 2 here',
  },
  continueGame: {
    instruction:
      'Recreate your current game: import a screenshot of it, or pick a value and tap cells to fill in your board. Tap a filled cell to change it, or choose **Erase** to clear one.',
    clearCell: 'Clear this cell',
    placeValue: 'Place {value} here',
    solve: 'Solve from here',
    solveTitle: 'Get the best move for this board',
  },
  importShot: {
    button: 'Import screenshot',
    reading: 'Reading screenshot…',
    title:
      'Fill the board from a screenshot of your game. It is read on this device, never uploaded.',
    pasteHint: 'or paste one with Ctrl+V',
    readUnsure:
      'Read {tiles} tiles. Check the {unsure} outlined, fix any that are wrong, then solve.',
    readOk: 'Read {tiles} tiles. Check they match your game, then solve.',
    capLifted: 'Your game already has {top}, so the tile limit is now off.',
    noBoard:
      'Couldn’t find a 2048 board in that image. Use a screenshot that shows the whole board.',
    failed: 'Something went wrong reading that image. Please try another screenshot.',
    notImage: 'That file is not an image.',
    tooLarge: 'That image is too large (over 25 MB).',
    cannotOpen: 'That image could not be opened.',
    noCanvas: 'This browser cannot read image pixels.',
  },
  palette: {
    label: 'Tile value to place',
    erase: 'Erase',
    eraseTitle: 'Tap tiles on the board to clear them',
    placeTitle: 'Tap cells on the board to place {value}',
  },
  proposal: {
    best: 'Best move: swipe **{direction}**.',
    next: 'Make that move, then tap the **highlighted** board where the new tile appeared.',
    capWarn: 'No move avoids {next} anymore — this one forms it and ends the game.',
    now: 'Now',
    tapSpot: 'Tap the new tile’s spot ↓',
    boardBefore: 'Board before the move',
    boardAfter: 'Board after the move: tap where the new tile appeared',
    cellHint: 'Tap: a new {value} here. Long-press or right-click: a {alt}',
    newTileValue: 'New tile value',
    tapHint: 'Tap drops **{value}**; long-press (or right-click) drops **{alt}**.',
    selectorLabel: 'Value of the new tile',
    selectorTitle: 'The new tile is a {value}',
  },
  gameOver: {
    title: 'You’re out of moves',
    finalBoard: 'Final board',
    restart: 'Restart',
    restartTitle: 'Start a new game',
  },
  leave: {
    title: 'Leave this game?',
    message: 'Your current board and progress will be lost.',
    restart: 'Restart',
    leave: 'Leave',
    cancel: 'Cancel',
    cancelTitle: 'Keep this game',
  },
  advanced: {
    summary: 'Advanced settings',
    summaryTitle: 'Set the highest tile AI may make',
    label: 'Maximum number before game end',
    noLimit: 'No limit',
    hintNoLimit: 'No cap — the solver plays all-out for the highest tile.',
    hintCap:
      'The solver plays up to {cap} and only forms {next} — which ends the game — when no other move exists.',
  },
  footer: {
    credit: 'Implemented by **FlexDev**',
    links: 'Project links',
    donate: 'Support this project',
    donateTitle: 'Donate any amount via monobank',
    bug: 'Report a bug',
    source: 'Source on GitHub',
    language: 'Language',
  },
};

export type Messages = typeof en;

export default en;
