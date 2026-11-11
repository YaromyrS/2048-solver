import type { Messages } from './en';

/**
 * Korean particles (을/를, 이/가) depend on how the word before them ends, so
 * none is attached to a `{placeholder}` number; the direction words carry their
 * own 으로/로.
 */
const ko: Messages = {
  meta: {
    title: '2048 AI Solver – 2048 최선의 수를 한 번의 탭으로',
    description:
      '지금 하고 있는 2048 게임에서 가장 좋은 스와이프 방향을 알려 주는 무료 AI입니다. 보드를 한 번 입력한 뒤에는 새로 나온 타일만 탭하면 됩니다. 브라우저에서 바로 실행됩니다.',
  },
  tagline: '보드를 입력하면 AI가 몇 수 앞을 내다보고 최선의 스와이프를 찾아 줍니다.',
  directions: { up: '위로', down: '아래로', left: '왼쪽으로', right: '오른쪽으로' },
  directionLabels: { up: '위', down: '아래', left: '왼쪽', right: '오른쪽' },
  topbar: {
    homeTitle: '시작 화면으로 돌아가기',
    undo: '마지막 수 되돌리기',
    menu: '메뉴로 돌아가기',
    restart: '게임 다시 시작',
  },
  landing: {
    start: '시작하기',
    startTitle: '새 게임: 처음 두 타일을 탭하고 최선의 수를 확인하세요',
    continue: '이어서 하기',
    continueTitle: '이미 플레이 중인가요? 보드를 옮겨 입력하거나 스크린샷을 가져오세요',
    hintLimit:
      '기본적으로 AI는 **1024**까지 플레이하고, 많은 버전에서 게임을 끝내는 2048은 만들지 않습니다. **고급 설정**에서 바꿀 수 있습니다.',
    hintContinue:
      '게임 중간인가요? **이어서 하기**로 지금 보드를 다시 만들거나 스크린샷을 가져오세요.',
  },
  demo: {
    label: '데모',
    play: '데모 재생',
    pause: '데모 일시정지',
    swipe: '{direction} 스와이프',
  },
  info: {
    howHeading: '사용 방법',
    steps: [
      '**보드를 입력하세요.** 새 게임이라면 처음 두 타일을 탭하고, 이미 플레이 중이라면 **이어서 하기**로 보드를 옮겨 입력하세요.',
      '실제 게임에서 **AI가 알려 준 방향으로 스와이프**하세요.',
      '**새 타일이 나타난 곳을 탭하세요.** 한 수에 한 번만 탭하면 나머지는 AI가 따라갑니다.',
    ],
    faqHeading: '자주 묻는 질문',
    faq: [
      {
        q: '어떤 AI인가요?',
        a: '챗봇이 아니라 게임 탐색 알고리즘입니다. 가능한 스와이프마다 몇 수 앞을 내다보고, 다음 2나 4가 나올 수 있는 위치를 평균 내어(expectimax 탐색) nneonneo의 유명한 2048 AI 평가 함수로 각 국면을 점수화합니다.',
      },
      {
        q: '어떤 전략을 쓰나요?',
        a: '정석 공략법입니다. 가장 큰 타일을 한쪽 구석에 두고 나머지를 그 뒤에 큰 순서대로 늘어세우면서, 빈칸과 합칠 수 있는 타일을 남겨 둡니다. AI가 고르는 수를 지켜보는 것만으로도 2048 실력이 빠르게 늘어요.',
      },
      {
        q: '제 2048 게임에서도 쓸 수 있나요?',
        a: '네. 스와이프할 때마다 2나 4가 추가되는 표준 4×4 게임이라면 됩니다. 원조 웹 버전과 대부분의 모바일 앱이 해당됩니다.',
      },
      {
        q: '스크린샷으로 보드를 읽을 수 있나요?',
        a: '네. **이어서 하기**를 고른 뒤 게임 스크린샷을 가져오거나 붙여 넣으세요. 원조 2048과 play2048.co를 라이트 모드와 다크 모드 모두에서 읽습니다. 풀기 전에 보드를 확인하세요. 확신이 없는 타일은 테두리로 표시됩니다.',
      },
      {
        q: '무료인가요? 제 보드가 어딘가로 전송되나요?',
        a: '무료이며 가입도 광고도 없습니다. AI가 전부 브라우저 안에서 실행되므로 보드는 기기 밖으로 나가지 않습니다. 스크린샷도 기기에서 읽으며 업로드하지 않습니다.',
      },
    ],
  },
  board: {
    yourBoard: '내 보드',
    row: '{row}행: {cells}',
    empty: '빈칸',
    emptyCell: '빈칸',
    tile: '타일 {value}',
    cell: '{what}, {row}행 {col}열',
    flagged: '{label} (확인 필요)',
  },
  status: {
    calculating: '최선의 수 계산 중…',
    bestMove: '최선의 수: {direction} 스와이프.',
    outOfMoves: '더 이상 둘 수 있는 수가 없습니다.',
  },
  setup: {
    lead: '처음 두 타일을 놓으세요(둘 다 **2**). 빈칸 두 곳을 탭하세요.',
    progress: '{count}/{total}개 놓음.',
    cellHint: '여기에 2 놓기',
  },
  continueGame: {
    instruction:
      '지금 하는 게임을 다시 만드세요. 스크린샷을 가져오거나, 숫자를 골라 칸을 탭해 보드를 채우세요. 채워진 칸을 탭하면 바꿀 수 있고, **지우기**를 고르면 비울 수 있습니다.',
    clearCell: '이 칸 비우기',
    placeValue: '여기에 {value} 놓기',
    solve: '여기서 풀기',
    solveTitle: '이 보드의 최선의 수 보기',
  },
  importShot: {
    button: '스크린샷 가져오기',
    reading: '스크린샷 읽는 중…',
    title: '게임 스크린샷으로 보드를 채웁니다. 이 기기에서 읽으며 업로드하지 않습니다.',
    pasteHint: '또는 Ctrl+V로 붙여 넣기',
    readUnsure:
      '타일 {tiles}개를 읽었습니다. 테두리가 표시된 {unsure}개를 확인하고 틀린 것을 고친 뒤 풀어 보세요.',
    readOk: '타일 {tiles}개를 읽었습니다. 게임과 일치하는지 확인한 뒤 풀어 보세요.',
    capLifted: '게임에 이미 {top} 타일이 있어서 타일 상한을 껐습니다.',
    noBoard:
      '이 이미지에서 2048 보드를 찾지 못했습니다. 보드 전체가 보이는 스크린샷을 사용하세요.',
    failed: '이미지를 읽는 중 문제가 생겼습니다. 다른 스크린샷으로 시도해 보세요.',
    notImage: '이 파일은 이미지가 아닙니다.',
    tooLarge: '이미지가 너무 큽니다(25MB 초과).',
    cannotOpen: '이미지를 열 수 없습니다.',
    noCanvas: '이 브라우저에서는 이미지 픽셀을 읽을 수 없습니다.',
  },
  palette: {
    label: '놓을 타일 숫자',
    erase: '지우기',
    eraseTitle: '보드의 타일을 탭해 지우기',
    placeTitle: '보드의 칸을 탭해 {value} 놓기',
  },
  proposal: {
    best: '최선의 수: **{direction}** 스와이프.',
    next: '그 수를 둔 뒤, **강조된** 보드에서 새 타일이 나타난 곳을 탭하세요.',
    capWarn: '이제 {next} 타일을 피할 수 있는 수가 없습니다. 이 수로 그 타일이 만들어지고 게임이 끝납니다.',
    now: '지금',
    tapSpot: '새 타일 위치를 탭 ↓',
    boardBefore: '수를 두기 전 보드',
    boardAfter: '수를 둔 뒤 보드: 새 타일이 나타난 곳을 탭하세요',
    cellHint: '탭: 여기에 새 {value}. 길게 누르기 또는 오른쪽 클릭: {alt}',
    newTileValue: '새 타일 숫자',
    tapHint: '탭하면 **{value}**, 길게 누르면(또는 오른쪽 클릭) **{alt}** 타일이 놓입니다.',
    selectorLabel: '새 타일 숫자',
    selectorTitle: '새 타일: {value}',
  },
  gameOver: {
    title: '더 이상 둘 수 있는 수가 없습니다',
    finalBoard: '최종 보드',
    restart: '다시 시작',
    restartTitle: '새 게임 시작',
  },
  leave: {
    title: '이 게임을 그만둘까요?',
    message: '지금 보드와 진행 상황이 사라집니다.',
    restart: '다시 시작',
    leave: '나가기',
    cancel: '취소',
    cancelTitle: '이 게임 계속하기',
  },
  advanced: {
    summary: '고급 설정',
    summaryTitle: 'AI가 만들 수 있는 가장 큰 타일 설정',
    label: '게임이 끝나기 전 최대 숫자',
    noLimit: '제한 없음',
    hintNoLimit: '제한 없음: AI가 가장 큰 타일을 목표로 전력을 다합니다.',
    hintCap: 'AI는 {cap}까지 플레이하고, 다른 수가 없을 때만 게임을 끝내는 {next} 타일을 만듭니다.',
  },
  footer: {
    credit: '제작: **FlexDev**',
    links: '프로젝트 링크',
    donate: '이 프로젝트 후원하기',
    donateTitle: 'monobank로 원하는 금액 후원',
    bug: '버그 신고',
    source: 'GitHub 소스 코드',
    language: '언어',
  },
};

export default ko;
