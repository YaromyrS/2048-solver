import type { Messages } from './en';

/**
 * French puts a space before ? ! : ; — written here as normal spaces and
 * turned into narrow no-break spaces, so the mark never wraps onto a line of
 * its own.
 */
function frenchSpacing<T>(value: T): T {
  if (typeof value === 'string') return value.replace(/ ([?!:;])/g, ' $1') as T;
  if (Array.isArray(value)) return value.map(frenchSpacing) as T;
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, v]) => [key, frenchSpacing(v)]),
    ) as T;
  }
  return value;
}

const fr: Messages = frenchSpacing({
  meta: {
    title: '2048 AI Solver – Le meilleur coup au 2048, une touche par coup',
    description:
      'IA gratuite pour 2048 qui vous indique le meilleur glissement dans la partie que vous jouez. Saisissez votre grille une fois, puis touchez simplement chaque nouvelle tuile. Fonctionne dans votre navigateur.',
  },
  tagline: 'Saisissez votre grille : l’IA anticipe plusieurs coups et trouve le meilleur glissement.',
  directions: {
    up: 'vers le haut',
    down: 'vers le bas',
    left: 'vers la gauche',
    right: 'vers la droite',
  },
  directionLabels: { up: 'Haut', down: 'Bas', left: 'Gauche', right: 'Droite' },
  topbar: {
    homeTitle: 'Revenir à l’écran d’accueil',
    undo: 'Annuler le dernier coup',
    menu: 'Revenir au menu',
    restart: 'Recommencer la partie',
  },
  landing: {
    start: 'Commencer',
    startTitle: 'Nouvelle partie : touchez vos deux premières tuiles et obtenez le meilleur coup',
    continue: 'Reprendre une partie',
    continueTitle:
      'Déjà en train de jouer ? Recopiez votre grille ou importez-en une capture d’écran',
    hintLimit:
      'Par défaut, l’IA joue jusqu’à **1024** et évite de former un 2048, qui met fin à la partie dans beaucoup de versions. Modifiez-le dans **Paramètres avancés**.',
    hintContinue:
      'Déjà en cours de partie ? Utilisez **Reprendre une partie** pour recréer votre grille actuelle, ou importez-en une capture d’écran.',
  },
  demo: {
    label: 'Démo',
    play: 'Lancer la démo',
    pause: 'Mettre la démo en pause',
    swipe: 'glisser {direction}',
  },
  info: {
    howHeading: 'Comment ça marche',
    steps: [
      '**Saisissez votre grille.** Nouvelle partie ? Touchez vos deux premières tuiles. Déjà en train de jouer ? Utilisez **Reprendre une partie** pour recopier votre grille.',
      '**Glissez dans le sens indiqué par l’IA** dans votre vraie partie.',
      '**Touchez l’endroit où la nouvelle tuile est apparue.** Une touche par coup : l’IA suit le reste.',
    ],
    faqHeading: 'Questions',
    faq: [
      {
        q: 'Quel genre d’IA est-ce ?',
        a: 'Une recherche de jeu, pas un chatbot. Pour chaque glissement possible, elle anticipe plusieurs coups, fait la moyenne des endroits où le prochain 2 ou 4 peut apparaître (recherche expectimax) et évalue chaque position avec l’heuristique de la célèbre IA 2048 de nneonneo.',
      },
      {
        q: 'Quelle stratégie suit-elle ?',
        a: 'La stratégie classique : garder la plus grosse tuile dans un coin, les autres alignées derrière par ordre décroissant, tout en gardant des cases libres et des fusions prêtes. Observer les coups qu’elle choisit est un bon moyen de progresser vous-même au 2048.',
      },
      {
        q: 'Est-ce que ça marche avec mon jeu 2048 ?',
        a: 'Oui, s’il s’agit du jeu standard en 4×4 où chaque glissement ajoute un 2 ou un 4 : la version web originale et la plupart des applis mobiles.',
      },
      {
        q: 'Peut-elle lire ma grille depuis une capture d’écran ?',
        a: 'Oui. Choisissez **Reprendre une partie**, puis importez une capture de votre partie (ou collez-la). Elle lit le 2048 original et play2048.co, en mode clair ou sombre. Vérifiez la grille avant de lancer le calcul : les tuiles dont elle n’était pas sûre sont entourées.',
      },
      {
        q: 'C’est gratuit ? Ma grille est-elle envoyée quelque part ?',
        a: 'C’est gratuit, sans inscription et sans publicité. L’IA tourne entièrement dans votre navigateur, votre grille ne quitte donc jamais votre appareil. Les captures d’écran sont aussi lues sur votre appareil, jamais envoyées.',
      },
    ],
  },
  board: {
    yourBoard: 'Votre grille',
    row: 'ligne {row} : {cells}',
    empty: 'vide',
    emptyCell: 'Case vide',
    tile: 'Tuile {value}',
    cell: '{what}, ligne {row}, colonne {col}',
    flagged: '{label} (à vérifier)',
  },
  status: {
    calculating: 'Calcul du meilleur coup…',
    bestMove: 'Meilleur coup : glisser {direction}.',
    outOfMoves: 'Plus aucun coup possible.',
  },
  setup: {
    lead: 'Placez vos deux premières tuiles (ce sont deux **2**) : touchez deux cases vides.',
    progress: '{count}/{total} placées.',
    cellHint: 'Placer un 2 ici',
  },
  continueGame: {
    instruction:
      'Recréez votre partie en cours : importez-en une capture d’écran, ou choisissez une valeur et touchez des cases pour remplir votre grille. Touchez une case remplie pour la modifier, ou choisissez **Effacer** pour la vider.',
    clearCell: 'Vider cette case',
    placeValue: 'Placer {value} ici',
    solve: 'Calculer à partir d’ici',
    solveTitle: 'Obtenir le meilleur coup pour cette grille',
  },
  importShot: {
    button: 'Importer une capture',
    reading: 'Lecture de la capture…',
    title:
      'Remplir la grille à partir d’une capture d’écran de votre partie. Elle est lue sur cet appareil, jamais envoyée.',
    pasteHint: 'ou collez-en une avec Ctrl+V',
    readUnsure:
      'Tuiles lues : {tiles}. Vérifiez celles qui sont entourées ({unsure}), corrigez les erreurs, puis lancez le calcul.',
    readOk: 'Tuiles lues : {tiles}. Vérifiez qu’elles correspondent à votre partie, puis lancez le calcul.',
    capLifted: 'Votre partie contient déjà un {top}, la limite de tuile est donc désactivée.',
    noBoard:
      'Aucune grille de 2048 trouvée dans cette image. Utilisez une capture qui montre toute la grille.',
    failed:
      'Un problème est survenu lors de la lecture de cette image. Essayez une autre capture.',
    notImage: 'Ce fichier n’est pas une image.',
    tooLarge: 'Cette image est trop lourde (plus de 25 Mo).',
    cannotOpen: 'Impossible d’ouvrir cette image.',
    noCanvas: 'Ce navigateur ne peut pas lire les pixels de l’image.',
  },
  palette: {
    label: 'Valeur de tuile à placer',
    erase: 'Effacer',
    eraseTitle: 'Touchez des tuiles de la grille pour les effacer',
    placeTitle: 'Touchez des cases de la grille pour placer {value}',
  },
  proposal: {
    best: 'Meilleur coup : glisser **{direction}**.',
    next: 'Jouez ce coup, puis touchez sur la grille **en surbrillance** l’endroit où la nouvelle tuile est apparue.',
    capWarn: 'Plus aucun coup n’évite le {next} : celui-ci le forme et termine la partie.',
    now: 'Maintenant',
    tapSpot: 'Touchez la place de la nouvelle tuile ↓',
    boardBefore: 'Grille avant le coup',
    boardAfter: 'Grille après le coup : touchez l’endroit où la nouvelle tuile est apparue',
    cellHint: 'Toucher : un nouveau {value} ici. Appui long ou clic droit : un {alt}',
    newTileValue: 'Valeur de la nouvelle tuile',
    tapHint: 'Une touche place un **{value}** ; un appui long (ou un clic droit) place un **{alt}**.',
    selectorLabel: 'Valeur de la nouvelle tuile',
    selectorTitle: 'La nouvelle tuile est un {value}',
  },
  gameOver: {
    title: 'Plus aucun coup possible',
    finalBoard: 'Grille finale',
    restart: 'Recommencer',
    restartTitle: 'Commencer une nouvelle partie',
  },
  leave: {
    title: 'Quitter cette partie ?',
    message: 'Votre grille actuelle et votre progression seront perdues.',
    restart: 'Recommencer',
    leave: 'Quitter',
    cancel: 'Annuler',
    cancelTitle: 'Garder cette partie',
  },
  advanced: {
    summary: 'Paramètres avancés',
    summaryTitle: 'Choisir la plus grosse tuile que l’IA peut former',
    label: 'Nombre maximal avant la fin de la partie',
    noLimit: 'Sans limite',
    hintNoLimit: 'Sans limite : l’IA joue à fond pour la plus grosse tuile.',
    hintCap:
      'L’IA joue jusqu’à {cap} et ne forme le {next}, qui termine la partie, que lorsqu’il n’y a pas d’autre coup.',
  },
  footer: {
    credit: 'Réalisé par **FlexDev**',
    links: 'Liens du projet',
    donate: 'Soutenir ce projet',
    donateTitle: 'Faire un don du montant de votre choix via monobank',
    bug: 'Signaler un bug',
    source: 'Code source sur GitHub',
    language: 'Langue',
  },
});

export default fr;
