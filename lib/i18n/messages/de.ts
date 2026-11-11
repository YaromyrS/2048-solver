import type { Messages } from './en';

const de: Messages = {
  meta: {
    title: '2048 AI Solver – der beste nächste Zug in 2048, ein Tippen pro Zug',
    description:
      'Kostenlose 2048-KI, die dir den besten Wisch für dein laufendes Spiel verrät. Gib dein Spielfeld einmal ein und tippe danach nur noch jede neue Kachel an. Läuft im Browser.',
  },
  tagline: 'Gib dein Spielfeld ein – die KI rechnet mehrere Züge voraus und findet den besten Wisch.',
  directions: { up: 'nach oben', down: 'nach unten', left: 'nach links', right: 'nach rechts' },
  directionLabels: { up: 'Oben', down: 'Unten', left: 'Links', right: 'Rechts' },
  topbar: {
    homeTitle: 'Zurück zum Startbildschirm',
    undo: 'Letzten Zug rückgängig machen',
    menu: 'Zurück zum Menü',
    restart: 'Spiel neu starten',
  },
  landing: {
    start: 'Neues Spiel',
    startTitle: 'Neues Spiel: Tippe deine ersten zwei Kacheln an und erhalte den besten Zug',
    continue: 'Spiel fortsetzen',
    continueTitle:
      'Spielst du schon? Übertrage dein Spielfeld oder importiere einen Screenshot davon',
    hintLimit:
      'Standardmäßig spielt die KI bis **1024** und vermeidet eine 2048, die in vielen Versionen das Spiel beendet. Das lässt sich unter **Erweiterte Einstellungen** ändern.',
    hintContinue:
      'Mitten im Spiel? Mit **Spiel fortsetzen** stellst du dein aktuelles Spielfeld nach oder importierst einen Screenshot davon.',
  },
  demo: {
    label: 'Demo',
    play: 'Demo abspielen',
    pause: 'Demo pausieren',
    swipe: '{direction} wischen',
  },
  info: {
    howHeading: 'So funktioniert’s',
    steps: [
      '**Gib dein Spielfeld ein.** Neues Spiel? Tippe deine ersten zwei Kacheln an. Spielst du schon? Übertrage dein Spielfeld mit **Spiel fortsetzen**.',
      '**Wische in die Richtung, die die KI angibt,** in deinem echten Spiel.',
      '**Tippe dort, wo die neue Kachel erschienen ist.** Ein Tippen pro Zug – den Rest verfolgt die KI.',
    ],
    faqHeading: 'Fragen',
    faq: [
      {
        q: 'Was für eine KI ist das?',
        a: 'Eine Spielbaumsuche, kein Chatbot. Für jeden möglichen Wisch rechnet sie mehrere Züge voraus, mittelt darüber, wo die nächste 2 oder 4 erscheinen kann (Expectimax-Suche), und bewertet jede Stellung mit der Heuristik aus der bekannten 2048-KI von nneonneo.',
      },
      {
        q: 'Welche Strategie verfolgt sie?',
        a: 'Die klassische: die größte Kachel in einer Ecke halten, die anderen absteigend dahinter aufreihen und dabei Felder frei und Verschmelzungen bereithalten. Wer zusieht, welche Züge sie wählt, wird schnell selbst besser in 2048.',
      },
      {
        q: 'Funktioniert das mit meinem 2048-Spiel?',
        a: 'Ja, wenn es das übliche 4×4-Spiel ist, bei dem jeder Wisch eine 2 oder 4 hinzufügt – die originale Webversion und die meisten Handy-Apps.',
      },
      {
        q: 'Kann sie mein Spielfeld aus einem Screenshot lesen?',
        a: 'Ja. Wähle **Spiel fortsetzen** und importiere einen Screenshot deines Spiels (oder füge ihn ein). Erkannt werden das originale 2048 und play2048.co, im hellen wie im dunklen Modus. Prüfe das Spielfeld vor dem Lösen: Kacheln, bei denen sie unsicher war, sind umrandet.',
      },
      {
        q: 'Ist das kostenlos? Wird mein Spielfeld irgendwohin gesendet?',
        a: 'Es ist kostenlos, ohne Anmeldung und ohne Werbung. Die KI läuft komplett in deinem Browser, dein Spielfeld verlässt dein Gerät also nie. Auch Screenshots werden auf dem Gerät gelesen und nie hochgeladen.',
      },
    ],
  },
  board: {
    yourBoard: 'Dein Spielfeld',
    row: 'Zeile {row}: {cells}',
    empty: 'leer',
    emptyCell: 'Leeres Feld',
    tile: 'Kachel {value}',
    cell: '{what} in Zeile {row}, Spalte {col}',
    flagged: '{label} (bitte prüfen)',
  },
  status: {
    calculating: 'Bester Zug wird berechnet …',
    bestMove: 'Bester Zug: {direction} wischen.',
    outOfMoves: 'Es sind keine Züge mehr möglich.',
  },
  setup: {
    lead: 'Setze deine ersten zwei Kacheln (beide sind **2**): Tippe zwei leere Felder an.',
    progress: '{count}/{total} gesetzt.',
    cellHint: 'Hier eine 2 setzen',
  },
  continueGame: {
    instruction:
      'Stelle dein laufendes Spiel nach: Importiere einen Screenshot davon oder wähle einen Wert und tippe Felder an, um dein Spielfeld zu füllen. Tippe ein belegtes Feld an, um es zu ändern, oder wähle **Löschen**, um es zu leeren.',
    clearCell: 'Dieses Feld leeren',
    placeValue: 'Hier {value} setzen',
    solve: 'Ab hier lösen',
    solveTitle: 'Den besten Zug für dieses Spielfeld anzeigen',
  },
  importShot: {
    button: 'Screenshot importieren',
    reading: 'Screenshot wird gelesen …',
    title:
      'Spielfeld aus einem Screenshot deines Spiels füllen. Er wird auf diesem Gerät gelesen und nie hochgeladen.',
    pasteHint: 'oder mit Strg+V einfügen',
    readUnsure:
      'Gelesene Kacheln: {tiles}. Prüfe die umrandeten ({unsure}), korrigiere falsche und lass dann lösen.',
    readOk:
      'Gelesene Kacheln: {tiles}. Prüfe, ob sie mit deinem Spiel übereinstimmen, und lass dann lösen.',
    capLifted: 'Dein Spiel hat schon eine {top}, daher ist das Kachel-Limit jetzt aus.',
    noBoard:
      'In diesem Bild wurde kein 2048-Spielfeld gefunden. Nimm einen Screenshot, der das ganze Spielfeld zeigt.',
    failed:
      'Beim Lesen des Bildes ist etwas schiefgelaufen. Versuch es mit einem anderen Screenshot.',
    notImage: 'Diese Datei ist kein Bild.',
    tooLarge: 'Das Bild ist zu groß (über 25 MB).',
    cannotOpen: 'Das Bild konnte nicht geöffnet werden.',
    noCanvas: 'Dieser Browser kann keine Bildpixel lesen.',
  },
  palette: {
    label: 'Kachelwert zum Setzen',
    erase: 'Löschen',
    eraseTitle: 'Tippe Kacheln auf dem Spielfeld an, um sie zu löschen',
    placeTitle: 'Tippe Felder auf dem Spielfeld an, um {value} zu setzen',
  },
  proposal: {
    best: 'Bester Zug: **{direction}** wischen.',
    next: 'Mach diesen Zug und tippe dann im **hervorgehobenen** Spielfeld dort, wo die neue Kachel erschienen ist.',
    capWarn: 'Kein Zug vermeidet die {next} mehr – dieser bildet sie und beendet das Spiel.',
    now: 'Jetzt',
    tapSpot: 'Tippe auf die neue Kachel ↓',
    boardBefore: 'Spielfeld vor dem Zug',
    boardAfter: 'Spielfeld nach dem Zug: Tippe dort, wo die neue Kachel erschienen ist',
    cellHint: 'Tippen: hier eine neue {value}. Lange drücken oder Rechtsklick: eine {alt}',
    newTileValue: 'Wert der neuen Kachel',
    tapHint: 'Tippen setzt **{value}**, langes Drücken (oder Rechtsklick) setzt **{alt}**.',
    selectorLabel: 'Wert der neuen Kachel',
    selectorTitle: 'Die neue Kachel ist eine {value}',
  },
  gameOver: {
    title: 'Keine Züge mehr möglich',
    finalBoard: 'Endstand',
    restart: 'Neu starten',
    restartTitle: 'Ein neues Spiel beginnen',
  },
  leave: {
    title: 'Dieses Spiel verlassen?',
    message: 'Dein aktuelles Spielfeld und dein Fortschritt gehen verloren.',
    restart: 'Neu starten',
    leave: 'Verlassen',
    cancel: 'Abbrechen',
    cancelTitle: 'In diesem Spiel bleiben',
  },
  advanced: {
    summary: 'Erweiterte Einstellungen',
    summaryTitle: 'Die höchste Kachel festlegen, die die KI bilden darf',
    label: 'Höchste Zahl vor Spielende',
    noLimit: 'Kein Limit',
    hintNoLimit: 'Kein Limit – die KI spielt voll auf die höchste Kachel.',
    hintCap:
      'Die KI spielt bis {cap} und bildet die {next}, die das Spiel beendet, nur wenn kein anderer Zug bleibt.',
  },
  footer: {
    credit: 'Umgesetzt von **FlexDev**',
    links: 'Projektlinks',
    donate: 'Dieses Projekt unterstützen',
    donateTitle: 'Beliebigen Betrag über monobank spenden',
    bug: 'Fehler melden',
    source: 'Quellcode auf GitHub',
    language: 'Sprache',
  },
};

export default de;
