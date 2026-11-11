import type { Messages } from './en';

const it: Messages = {
  meta: {
    title: '2048 AI Solver – La mossa migliore a 2048, un tocco per mossa',
    description:
      'IA gratuita per 2048 che ti dice lo scorrimento migliore nella partita che stai giocando. Inserisci la griglia una volta, poi tocca solo ogni nuova tessera. Funziona nel browser.',
  },
  tagline: 'Inserisci la tua griglia: l’IA guarda diverse mosse avanti e trova lo scorrimento migliore.',
  directions: { up: 'verso l’alto', down: 'verso il basso', left: 'a sinistra', right: 'a destra' },
  directionLabels: { up: 'Su', down: 'Giù', left: 'Sinistra', right: 'Destra' },
  topbar: {
    homeTitle: 'Torna alla schermata iniziale',
    undo: 'Annulla l’ultima mossa',
    menu: 'Torna al menu',
    restart: 'Ricomincia la partita',
  },
  landing: {
    start: 'Inizia',
    startTitle: 'Nuova partita: tocca le prime due tessere e ottieni la mossa migliore',
    continue: 'Continua partita',
    continueTitle: 'Stai già giocando? Copia la tua griglia o importane uno screenshot',
    hintLimit:
      'Di default l’IA gioca fino a **1024** ed evita di formare un 2048, che in molte versioni chiude la partita. Puoi cambiarlo in **Impostazioni avanzate**.',
    hintContinue:
      'Sei a metà partita? Usa **Continua partita** per ricreare la griglia attuale o importane uno screenshot.',
  },
  demo: {
    label: 'Demo',
    play: 'Avvia demo',
    pause: 'Metti in pausa la demo',
    swipe: 'scorri {direction}',
  },
  info: {
    howHeading: 'Come funziona',
    steps: [
      '**Inserisci la tua griglia.** Nuova partita? Tocca le prime due tessere. Stai già giocando? Usa **Continua partita** per copiare la griglia.',
      '**Scorri nella direzione indicata dall’IA** nella tua vera partita.',
      '**Tocca dove è apparsa la nuova tessera.** Un tocco per mossa: al resto pensa l’IA.',
    ],
    faqHeading: 'Domande',
    faq: [
      {
        q: 'Che tipo di IA è?',
        a: 'Una ricerca di gioco, non un chatbot. Per ogni scorrimento possibile guarda diverse mosse avanti, fa la media dei punti in cui può comparire il prossimo 2 o 4 (ricerca expectimax) e valuta ogni posizione con l’euristica della famosa IA per 2048 di nneonneo.',
      },
      {
        q: 'Che strategia segue?',
        a: 'Quella classica: tenere la tessera più grande in un angolo con le altre allineate dietro in ordine decrescente, lasciando caselle libere e fusioni pronte. Osservare le mosse che sceglie è un modo rapido per migliorare a 2048 anche tu.',
      },
      {
        q: 'Funziona con il mio gioco 2048?',
        a: 'Sì, se è il gioco standard 4×4 in cui ogni scorrimento aggiunge un 2 o un 4: la versione web originale e la maggior parte delle app per smartphone.',
      },
      {
        q: 'Può leggere la mia griglia da uno screenshot?',
        a: 'Sì. Scegli **Continua partita**, poi importa uno screenshot della partita (o incollalo). Legge il 2048 originale e play2048.co, in modalità chiara o scura. Controlla la griglia prima di risolvere: le tessere su cui non era sicura sono contornate.',
      },
      {
        q: 'È gratis? La mia griglia viene inviata da qualche parte?',
        a: 'È gratis, senza registrazione e senza pubblicità. L’IA gira interamente nel tuo browser, quindi la griglia non lascia mai il tuo dispositivo. Anche gli screenshot vengono letti sul dispositivo e mai caricati.',
      },
    ],
  },
  board: {
    yourBoard: 'La tua griglia',
    row: 'riga {row}: {cells}',
    empty: 'vuota',
    emptyCell: 'Casella vuota',
    tile: 'Tessera {value}',
    cell: '{what} alla riga {row}, colonna {col}',
    flagged: '{label} (da controllare)',
  },
  status: {
    calculating: 'Calcolo della mossa migliore…',
    bestMove: 'Mossa migliore: scorri {direction}.',
    outOfMoves: 'Non ci sono più mosse.',
  },
  setup: {
    lead: 'Posiziona le prime due tessere (sono entrambe **2**): tocca due caselle vuote.',
    progress: '{count}/{total} posizionate.',
    cellHint: 'Metti un 2 qui',
  },
  continueGame: {
    instruction:
      'Ricrea la partita in corso: importane uno screenshot, oppure scegli un valore e tocca le caselle per riempire la griglia. Tocca una casella piena per cambiarla o scegli **Cancella** per svuotarla.',
    clearCell: 'Svuota questa casella',
    placeValue: 'Metti {value} qui',
    solve: 'Risolvi da qui',
    solveTitle: 'Ottieni la mossa migliore per questa griglia',
  },
  importShot: {
    button: 'Importa screenshot',
    reading: 'Lettura dello screenshot…',
    title:
      'Riempi la griglia da uno screenshot della partita. Viene letto su questo dispositivo e mai caricato.',
    pasteHint: 'oppure incollane uno con Ctrl+V',
    readUnsure:
      'Tessere lette: {tiles}. Controlla quelle contornate ({unsure}), correggi quelle sbagliate e poi risolvi.',
    readOk: 'Tessere lette: {tiles}. Controlla che corrispondano alla tua partita e poi risolvi.',
    capLifted: 'La tua partita ha già un {top}, quindi il limite delle tessere ora è disattivato.',
    noBoard:
      'Nessuna griglia di 2048 trovata in questa immagine. Usa uno screenshot che mostri tutta la griglia.',
    failed:
      'Qualcosa è andato storto durante la lettura dell’immagine. Prova con un altro screenshot.',
    notImage: 'Questo file non è un’immagine.',
    tooLarge: 'L’immagine è troppo grande (oltre 25 MB).',
    cannotOpen: 'Impossibile aprire l’immagine.',
    noCanvas: 'Questo browser non riesce a leggere i pixel dell’immagine.',
  },
  palette: {
    label: 'Valore della tessera da inserire',
    erase: 'Cancella',
    eraseTitle: 'Tocca le tessere sulla griglia per cancellarle',
    placeTitle: 'Tocca le caselle della griglia per inserire {value}',
  },
  proposal: {
    best: 'Mossa migliore: scorri **{direction}**.',
    next: 'Fai questa mossa, poi tocca sulla griglia **evidenziata** il punto in cui è apparsa la nuova tessera.',
    capWarn: 'Nessuna mossa evita più il {next}: questa lo forma e chiude la partita.',
    now: 'Adesso',
    tapSpot: 'Tocca dove è apparsa la tessera ↓',
    boardBefore: 'Griglia prima della mossa',
    boardAfter: 'Griglia dopo la mossa: tocca dove è apparsa la nuova tessera',
    cellHint: 'Tocco: un nuovo {value} qui. Pressione lunga o clic destro: un {alt}',
    newTileValue: 'Valore della nuova tessera',
    tapHint:
      'Il tocco inserisce **{value}**; la pressione lunga (o il clic destro) inserisce **{alt}**.',
    selectorLabel: 'Valore della nuova tessera',
    selectorTitle: 'La nuova tessera è un {value}',
  },
  gameOver: {
    title: 'Non ci sono più mosse',
    finalBoard: 'Griglia finale',
    restart: 'Ricomincia',
    restartTitle: 'Inizia una nuova partita',
  },
  leave: {
    title: 'Uscire da questa partita?',
    message: 'La griglia attuale e i progressi andranno persi.',
    restart: 'Ricomincia',
    leave: 'Esci',
    cancel: 'Annulla',
    cancelTitle: 'Resta in questa partita',
  },
  advanced: {
    summary: 'Impostazioni avanzate',
    summaryTitle: 'Imposta la tessera più alta che l’IA può formare',
    label: 'Numero massimo prima della fine',
    noLimit: 'Nessun limite',
    hintNoLimit: 'Nessun limite: l’IA gioca al massimo per la tessera più alta.',
    hintCap:
      'L’IA gioca fino a {cap} e forma il {next}, che chiude la partita, solo quando non c’è altra mossa.',
  },
  footer: {
    credit: 'Realizzato da **FlexDev**',
    links: 'Link del progetto',
    donate: 'Sostieni questo progetto',
    donateTitle: 'Dona l’importo che vuoi tramite monobank',
    bug: 'Segnala un bug',
    source: 'Codice su GitHub',
    language: 'Lingua',
  },
};

export default it;
