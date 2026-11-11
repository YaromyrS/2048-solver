import type { Messages } from './en';

/** Brazilian Portuguese. */
const pt: Messages = {
  meta: {
    title: '2048 AI Solver – A melhor jogada no 2048, um toque por jogada',
    description:
      'IA grátis para 2048 que mostra o melhor deslize na partida que você está jogando. Insira seu tabuleiro uma vez e depois é só tocar em cada peça nova. Funciona no seu navegador.',
  },
  tagline:
    'Insira seu tabuleiro: a IA analisa várias jogadas à frente e encontra o melhor deslize para você.',
  directions: {
    up: 'para cima',
    down: 'para baixo',
    left: 'para a esquerda',
    right: 'para a direita',
  },
  directionLabels: { up: 'Cima', down: 'Baixo', left: 'Esquerda', right: 'Direita' },
  topbar: {
    homeTitle: 'Voltar à tela inicial',
    undo: 'Desfazer a última jogada',
    menu: 'Voltar ao menu',
    restart: 'Reiniciar o jogo',
  },
  landing: {
    start: 'Começar',
    startTitle: 'Jogo novo: toque nas suas duas primeiras peças e veja a melhor jogada',
    continue: 'Continuar jogo',
    continueTitle: 'Já está jogando? Copie seu tabuleiro ou importe uma captura de tela dele',
    hintLimit:
      'Por padrão, a IA joga até **1024** e evita formar um 2048, que encerra o jogo em muitas versões. Mude isso em **Configurações avançadas**.',
    hintContinue:
      'Já está no meio do jogo? Use **Continuar jogo** para recriar seu tabuleiro atual ou importe uma captura de tela dele.',
  },
  demo: {
    label: 'Demo',
    play: 'Reproduzir demo',
    pause: 'Pausar demo',
    swipe: 'deslize {direction}',
  },
  info: {
    howHeading: 'Como funciona',
    steps: [
      '**Insira seu tabuleiro.** Jogo novo? Toque nas suas duas primeiras peças. Já está jogando? Use **Continuar jogo** para copiar seu tabuleiro.',
      '**Deslize para onde a IA indicar** no seu jogo de verdade.',
      '**Toque onde a peça nova apareceu.** Um toque por jogada: a IA acompanha o resto.',
    ],
    faqHeading: 'Perguntas',
    faq: [
      {
        q: 'Que tipo de IA é essa?',
        a: 'Uma busca de jogo, não um chatbot. Para cada deslize possível, ela olha várias jogadas à frente, faz a média de onde o próximo 2 ou 4 pode aparecer (busca expectimax) e pontua cada posição com a heurística da famosa IA de 2048 do nneonneo.',
      },
      {
        q: 'Que estratégia ela segue?',
        a: 'A clássica: manter a maior peça em um canto, com as outras alinhadas atrás dela em ordem decrescente, deixando casas livres e junções prontas. Observar as jogadas que ela escolhe é um jeito rápido de você mesmo melhorar no 2048.',
      },
      {
        q: 'Funciona com o meu jogo de 2048?',
        a: 'Sim, se for o jogo padrão 4×4 em que cada deslize adiciona um 2 ou um 4: a versão web original e a maioria dos apps de celular.',
      },
      {
        q: 'Ela consegue ler meu tabuleiro de uma captura de tela?',
        a: 'Sim. Escolha **Continuar jogo** e importe uma captura de tela do seu jogo (ou cole uma). Ela lê o 2048 original e o play2048.co, no modo claro ou escuro. Confira o tabuleiro antes de resolver: as peças sobre as quais ela não tinha certeza ficam contornadas.',
      },
      {
        q: 'É grátis? Meu tabuleiro é enviado para algum lugar?',
        a: 'É grátis, sem cadastro e sem anúncios. A IA roda inteiramente no seu navegador, então seu tabuleiro nunca sai do seu aparelho. As capturas de tela também são lidas no aparelho e nunca enviadas.',
      },
    ],
  },
  board: {
    yourBoard: 'Seu tabuleiro',
    row: 'linha {row}: {cells}',
    empty: 'vazia',
    emptyCell: 'Casa vazia',
    tile: 'Peça {value}',
    cell: '{what} na linha {row}, coluna {col}',
    flagged: '{label} (confira)',
  },
  status: {
    calculating: 'Calculando a melhor jogada…',
    bestMove: 'Melhor jogada: deslize {direction}.',
    outOfMoves: 'Suas jogadas acabaram.',
  },
  setup: {
    lead: 'Coloque suas duas primeiras peças (as duas são **2**): toque em duas casas vazias.',
    progress: '{count}/{total} colocadas.',
    cellHint: 'Colocar um 2 aqui',
  },
  continueGame: {
    instruction:
      'Recrie seu jogo atual: importe uma captura de tela dele ou escolha um valor e toque nas casas para preencher seu tabuleiro. Toque em uma casa preenchida para mudá-la ou escolha **Apagar** para limpá-la.',
    clearCell: 'Limpar esta casa',
    placeValue: 'Colocar {value} aqui',
    solve: 'Resolver a partir daqui',
    solveTitle: 'Ver a melhor jogada para este tabuleiro',
  },
  importShot: {
    button: 'Importar captura de tela',
    reading: 'Lendo a captura…',
    title:
      'Preencha o tabuleiro a partir de uma captura de tela do seu jogo. Ela é lida neste aparelho e nunca enviada.',
    pasteHint: 'ou cole uma com Ctrl+V',
    readUnsure:
      'Peças lidas: {tiles}. Confira as contornadas ({unsure}), corrija as erradas e depois resolva.',
    readOk: 'Peças lidas: {tiles}. Confira se batem com o seu jogo e depois resolva.',
    capLifted: 'Seu jogo já tem um {top}, então o limite de peças foi desligado.',
    noBoard:
      'Não foi possível encontrar um tabuleiro de 2048 nessa imagem. Use uma captura que mostre o tabuleiro inteiro.',
    failed: 'Algo deu errado ao ler essa imagem. Tente outra captura de tela.',
    notImage: 'Esse arquivo não é uma imagem.',
    tooLarge: 'Essa imagem é grande demais (mais de 25 MB).',
    cannotOpen: 'Não foi possível abrir essa imagem.',
    noCanvas: 'Este navegador não consegue ler os pixels da imagem.',
  },
  palette: {
    label: 'Valor da peça a colocar',
    erase: 'Apagar',
    eraseTitle: 'Toque nas peças do tabuleiro para apagá-las',
    placeTitle: 'Toque nas casas do tabuleiro para colocar {value}',
  },
  proposal: {
    best: 'Melhor jogada: deslize **{direction}**.',
    next: 'Faça essa jogada e depois toque, no tabuleiro **destacado**, onde a peça nova apareceu.',
    capWarn: 'Nenhuma jogada evita mais o {next}: esta o forma e encerra o jogo.',
    now: 'Agora',
    tapSpot: 'Toque onde a peça nova surgiu ↓',
    boardBefore: 'Tabuleiro antes da jogada',
    boardAfter: 'Tabuleiro depois da jogada: toque onde a peça nova apareceu',
    cellHint: 'Toque: um novo {value} aqui. Toque longo ou clique direito: um {alt}',
    newTileValue: 'Valor da peça nova',
    tapHint: 'O toque coloca **{value}**; o toque longo (ou clique direito) coloca **{alt}**.',
    selectorLabel: 'Valor da peça nova',
    selectorTitle: 'A peça nova é um {value}',
  },
  gameOver: {
    title: 'Suas jogadas acabaram',
    finalBoard: 'Tabuleiro final',
    restart: 'Reiniciar',
    restartTitle: 'Começar um jogo novo',
  },
  leave: {
    title: 'Sair deste jogo?',
    message: 'Seu tabuleiro atual e seu progresso serão perdidos.',
    restart: 'Reiniciar',
    leave: 'Sair',
    cancel: 'Cancelar',
    cancelTitle: 'Continuar neste jogo',
  },
  advanced: {
    summary: 'Configurações avançadas',
    summaryTitle: 'Defina a maior peça que a IA pode formar',
    label: 'Número máximo antes do fim do jogo',
    noLimit: 'Sem limite',
    hintNoLimit: 'Sem limite: a IA joga com tudo pela maior peça.',
    hintCap:
      'A IA joga até {cap} e só forma o {next}, que encerra o jogo, quando não existe outra jogada.',
  },
  footer: {
    credit: 'Feito por **FlexDev**',
    links: 'Links do projeto',
    donate: 'Apoie este projeto',
    donateTitle: 'Doe qualquer valor via monobank',
    bug: 'Relatar um bug',
    source: 'Código no GitHub',
    language: 'Idioma',
  },
};

export default pt;
