import type { Messages } from './en';

const es: Messages = {
  meta: {
    title: '2048 AI Solver – La mejor jugada en 2048, un toque por jugada',
    description:
      'IA gratuita para 2048 que te dice el mejor deslizamiento en la partida que estás jugando. Introduce tu tablero una vez y luego solo toca cada ficha nueva. Funciona en tu navegador.',
  },
  tagline:
    'Introduce tu tablero: la IA calcula varias jugadas por adelantado y te da el mejor deslizamiento.',
  directions: { up: 'hacia arriba', down: 'hacia abajo', left: 'a la izquierda', right: 'a la derecha' },
  directionLabels: { up: 'Arriba', down: 'Abajo', left: 'Izquierda', right: 'Derecha' },
  topbar: {
    homeTitle: 'Volver a la pantalla de inicio',
    undo: 'Deshacer la última jugada',
    menu: 'Volver al menú',
    restart: 'Reiniciar la partida',
  },
  landing: {
    start: 'Empezar',
    startTitle: 'Partida nueva: toca tus dos primeras fichas y obtén la mejor jugada',
    continue: 'Continuar partida',
    continueTitle: '¿Ya estás jugando? Copia tu tablero o importa una captura de pantalla',
    hintLimit:
      'Por defecto, la IA juega hasta **1024** y evita formar un 2048, que en muchas versiones termina la partida. Puedes cambiarlo en **Ajustes avanzados**.',
    hintContinue:
      '¿Ya vas a mitad de partida? Usa **Continuar partida** para recrear tu tablero actual o importa una captura de pantalla.',
  },
  demo: {
    label: 'Demo',
    play: 'Reproducir demo',
    pause: 'Pausar demo',
    swipe: 'desliza {direction}',
  },
  info: {
    howHeading: 'Cómo funciona',
    steps: [
      '**Introduce tu tablero.** ¿Partida nueva? Toca tus dos primeras fichas. ¿Ya estás jugando? Usa **Continuar partida** para copiar tu tablero.',
      '**Desliza hacia donde indique la IA** en tu partida real.',
      '**Toca donde apareció la ficha nueva.** Un toque por jugada: la IA se encarga del resto.',
    ],
    faqHeading: 'Preguntas frecuentes',
    faq: [
      {
        q: '¿Qué tipo de IA es?',
        a: 'Una búsqueda de juego, no un chatbot. Para cada deslizamiento posible mira varias jugadas por adelantado, promedia dónde podría aparecer el siguiente 2 o 4 (búsqueda expectimax) y puntúa cada posición con la heurística de la conocida IA de 2048 de nneonneo.',
      },
      {
        q: '¿Qué estrategia sigue?',
        a: 'La clásica: mantener la ficha más grande en una esquina con las demás alineadas detrás en orden descendente, dejando casillas libres y fusiones preparadas. Fijarte en las jugadas que elige es una forma rápida de mejorar tú mismo en 2048.',
      },
      {
        q: '¿Funciona con mi juego de 2048?',
        a: 'Sí, si es el juego estándar de 4×4 en el que cada deslizamiento añade un 2 o un 4: la versión web original y la mayoría de apps para móvil.',
      },
      {
        q: '¿Puede leer mi tablero desde una captura de pantalla?',
        a: 'Sí. Elige **Continuar partida** e importa una captura de tu partida (o pégala). Lee el 2048 original y play2048.co, en modo claro u oscuro. Revisa el tablero antes de resolver: las fichas de las que no estaba seguro aparecen marcadas.',
      },
      {
        q: '¿Es gratis? ¿Se envía mi tablero a algún sitio?',
        a: 'Es gratis, sin registro y sin anuncios. La IA funciona por completo en tu navegador, así que tu tablero nunca sale de tu dispositivo. Las capturas también se leen en tu dispositivo y nunca se suben.',
      },
    ],
  },
  board: {
    yourBoard: 'Tu tablero',
    row: 'fila {row}: {cells}',
    empty: 'vacía',
    emptyCell: 'Casilla vacía',
    tile: 'Ficha {value}',
    cell: '{what} en la fila {row}, columna {col}',
    flagged: '{label} (revísala)',
  },
  status: {
    calculating: 'Calculando la mejor jugada…',
    bestMove: 'Mejor jugada: desliza {direction}.',
    outOfMoves: 'Te has quedado sin movimientos.',
  },
  setup: {
    lead: 'Coloca tus dos primeras fichas (ambas son **2**): toca dos casillas vacías.',
    progress: '{count}/{total} colocadas.',
    cellHint: 'Colocar un 2 aquí',
  },
  continueGame: {
    instruction:
      'Recrea tu partida actual: importa una captura de pantalla o elige un valor y toca casillas para rellenar tu tablero. Toca una casilla ocupada para cambiarla o elige **Borrar** para vaciarla.',
    clearCell: 'Vaciar esta casilla',
    placeValue: 'Colocar {value} aquí',
    solve: 'Resolver desde aquí',
    solveTitle: 'Obtener la mejor jugada para este tablero',
  },
  importShot: {
    button: 'Importar captura',
    reading: 'Leyendo la captura…',
    title:
      'Rellena el tablero con una captura de pantalla de tu partida. Se lee en este dispositivo y nunca se sube.',
    pasteHint: 'o pégala con Ctrl+V',
    readUnsure:
      'Fichas leídas: {tiles}. Revisa las marcadas ({unsure}), corrige las que estén mal y luego resuelve.',
    readOk: 'Fichas leídas: {tiles}. Comprueba que coinciden con tu partida y luego resuelve.',
    capLifted: 'Tu partida ya tiene un {top}, así que el límite de fichas se ha desactivado.',
    noBoard:
      'No se encontró un tablero de 2048 en esa imagen. Usa una captura que muestre el tablero completo.',
    failed: 'Algo salió mal al leer esa imagen. Prueba con otra captura.',
    notImage: 'Ese archivo no es una imagen.',
    tooLarge: 'Esa imagen es demasiado grande (más de 25 MB).',
    cannotOpen: 'No se pudo abrir esa imagen.',
    noCanvas: 'Este navegador no puede leer los píxeles de la imagen.',
  },
  palette: {
    label: 'Valor de ficha a colocar',
    erase: 'Borrar',
    eraseTitle: 'Toca fichas del tablero para borrarlas',
    placeTitle: 'Toca casillas del tablero para colocar {value}',
  },
  proposal: {
    best: 'Mejor jugada: desliza **{direction}**.',
    next: 'Haz esa jugada y luego toca en el tablero **resaltado** dónde apareció la ficha nueva.',
    capWarn: 'Ya ninguna jugada evita el {next}: esta lo forma y termina la partida.',
    now: 'Ahora',
    tapSpot: 'Toca dónde salió la ficha nueva ↓',
    boardBefore: 'Tablero antes de la jugada',
    boardAfter: 'Tablero después de la jugada: toca dónde apareció la ficha nueva',
    cellHint: 'Toque: un {value} nuevo aquí. Pulsación larga o clic derecho: un {alt}',
    newTileValue: 'Valor de la ficha nueva',
    tapHint: 'Un toque coloca **{value}**; una pulsación larga (o clic derecho) coloca **{alt}**.',
    selectorLabel: 'Valor de la ficha nueva',
    selectorTitle: 'La ficha nueva es un {value}',
  },
  gameOver: {
    title: 'Te has quedado sin movimientos',
    finalBoard: 'Tablero final',
    restart: 'Reiniciar',
    restartTitle: 'Empezar una partida nueva',
  },
  leave: {
    title: '¿Salir de esta partida?',
    message: 'Se perderán tu tablero actual y tu progreso.',
    restart: 'Reiniciar',
    leave: 'Salir',
    cancel: 'Cancelar',
    cancelTitle: 'Seguir con esta partida',
  },
  advanced: {
    summary: 'Ajustes avanzados',
    summaryTitle: 'Elige la ficha más alta que puede formar la IA',
    label: 'Número máximo antes del final de la partida',
    noLimit: 'Sin límite',
    hintNoLimit: 'Sin límite: la IA juega a por la ficha más alta posible.',
    hintCap:
      'La IA juega hasta {cap} y solo forma el {next}, que termina la partida, cuando no queda otra jugada.',
  },
  footer: {
    credit: 'Hecho por **FlexDev**',
    links: 'Enlaces del proyecto',
    donate: 'Apoya este proyecto',
    donateTitle: 'Dona la cantidad que quieras con monobank',
    bug: 'Informar de un error',
    source: 'Código en GitHub',
    language: 'Idioma',
  },
};

export default es;
