import type { Messages } from './en';

/** Traditional Chinese, worded for Taiwan (列 = row, 行 = column). */
const zhHant: Messages = {
  meta: {
    title: '2048 AI Solver – 2048 最佳下一步，每步只要點一下',
    description:
      '免費的 2048 AI，告訴你正在玩的遊戲最佳的滑動方向。只要輸入一次盤面，之後每步點一下新出現的方塊即可。直接在瀏覽器中執行。',
  },
  tagline: '輸入你的盤面，AI 會往後推算數步，幫你找出最佳滑動方向。',
  directions: { up: '上', down: '下', left: '左', right: '右' },
  directionLabels: { up: '上', down: '下', left: '左', right: '右' },
  topbar: {
    homeTitle: '回到開始畫面',
    undo: '復原上一步',
    menu: '回到選單',
    restart: '重新開始遊戲',
  },
  landing: {
    start: '開始解題',
    startTitle: '新遊戲：點選最初的兩個方塊，取得最佳下一步',
    continue: '繼續遊戲',
    continueTitle: '已經在玩了嗎？抄下你的盤面，或匯入盤面截圖',
    hintLimit:
      'AI 預設最多玩到 **1024**，並避免合成 2048，因為在許多版本中這會結束遊戲。可以在**進階設定**中更改。',
    hintContinue: '已經玩到一半？使用**繼續遊戲**重建目前的盤面，或匯入盤面截圖。',
  },
  demo: {
    label: '示範',
    play: '播放示範',
    pause: '暫停示範',
    swipe: '往{direction}滑',
  },
  info: {
    howHeading: '使用方式',
    steps: [
      '**輸入盤面。** 新遊戲？點選最初的兩個方塊。已經在玩？用**繼續遊戲**抄下你的盤面。',
      '在真正的遊戲中**照 AI 指示的方向滑動**。',
      '**點選新方塊出現的位置。** 每步只要點一下，其餘由 AI 追蹤。',
    ],
    faqHeading: '常見問題',
    faq: [
      {
        q: '這是什麼樣的 AI？',
        a: '這是遊戲搜尋演算法，不是聊天機器人。它會針對每個可能的滑動方向往後推算數步，對下一個 2 或 4 可能出現的位置取平均（expectimax 搜尋），並用 nneonneo 知名 2048 AI 的評估函數為每個局面打分數。',
      },
      {
        q: '它採用什麼策略？',
        a: '經典攻略：把最大的方塊放在角落，其他方塊依大小遞減排在後面，同時保留空格和可合併的方塊。觀察它選擇的每一步，是讓自己的 2048 快速進步的好方法。',
      },
      {
        q: '可以用在我的 2048 遊戲嗎？',
        a: '可以，只要是每次滑動會新增一個 2 或 4 的標準 4×4 遊戲，包括原版網頁版和大多數手機 App。',
      },
      {
        q: '可以從截圖讀取我的盤面嗎？',
        a: '可以。選擇**繼續遊戲**，再匯入（或貼上）遊戲截圖。它能讀取原版 2048 和 play2048.co，淺色或深色模式皆可。解題前請檢查盤面：沒把握的方塊會加上外框。',
      },
      {
        q: '免費嗎？我的盤面會被傳送出去嗎？',
        a: '完全免費，不用註冊也沒有廣告。AI 完全在你的瀏覽器中執行，所以盤面不會離開你的裝置。截圖也是在裝置上讀取，絕不上傳。',
      },
    ],
  },
  board: {
    yourBoard: '你的盤面',
    row: '第 {row} 列：{cells}',
    empty: '空',
    emptyCell: '空格',
    tile: '方塊 {value}',
    cell: '{what}，第 {row} 列第 {col} 行',
    flagged: '{label}（請檢查）',
  },
  status: {
    calculating: '正在計算最佳下一步…',
    bestMove: '最佳下一步：往{direction}滑。',
    outOfMoves: '已經沒有可走的步了。',
  },
  setup: {
    lead: '放上最初的兩個方塊（都是 **2**）：點選兩個空格。',
    progress: '已放置 {count}/{total}。',
    cellHint: '在這裡放 2',
  },
  continueGame: {
    instruction:
      '重建你目前的遊戲：匯入遊戲截圖，或選一個數字後點選格子來填滿盤面。點選有數字的格子可以修改，選擇**清除**可以清空。',
    clearCell: '清空這一格',
    placeValue: '在這裡放 {value}',
    solve: '從這裡開始解題',
    solveTitle: '取得這個盤面的最佳下一步',
  },
  importShot: {
    button: '匯入截圖',
    reading: '正在讀取截圖…',
    title: '用遊戲截圖填入盤面。截圖只在這台裝置上讀取，絕不上傳。',
    pasteHint: '或用 Ctrl+V 貼上',
    readUnsure: '已讀取 {tiles} 個方塊。請檢查加上外框的 {unsure} 個，修正錯誤後再解題。',
    readOk: '已讀取 {tiles} 個方塊。確認與你的遊戲一致後再解題。',
    capLifted: '你的遊戲已經有 {top}，因此已關閉方塊上限。',
    noBoard: '在這張圖片中找不到 2048 盤面。請使用能看到完整盤面的截圖。',
    failed: '讀取圖片時發生問題。請換一張截圖試試。',
    notImage: '這個檔案不是圖片。',
    tooLarge: '圖片太大（超過 25 MB）。',
    cannotOpen: '無法開啟這張圖片。',
    noCanvas: '這個瀏覽器無法讀取圖片像素。',
  },
  palette: {
    label: '要放置的方塊數字',
    erase: '清除',
    eraseTitle: '點選盤面上的方塊來清除',
    placeTitle: '點選盤面上的格子來放置 {value}',
  },
  proposal: {
    best: '最佳下一步：往**{direction}**滑。',
    next: '走完這一步後，在**醒目標示**的盤面上點選新方塊出現的位置。',
    capWarn: '已經沒有任何一步能避免 {next}，這一步會合成它並結束遊戲。',
    now: '目前',
    tapSpot: '點選新方塊的位置 ↓',
    boardBefore: '移動前的盤面',
    boardAfter: '移動後的盤面：點選新方塊出現的位置',
    cellHint: '點一下：在這裡放新的 {value}。長按或按右鍵：{alt}',
    newTileValue: '新方塊的數字',
    tapHint: '點一下放 **{value}**；長按（或按右鍵）放 **{alt}**。',
    selectorLabel: '新方塊的數字',
    selectorTitle: '新方塊是 {value}',
  },
  gameOver: {
    title: '已經沒有可走的步了',
    finalBoard: '最終盤面',
    restart: '重新開始',
    restartTitle: '開始新遊戲',
  },
  leave: {
    title: '要離開這局遊戲嗎？',
    message: '目前的盤面和進度將會遺失。',
    restart: '重新開始',
    leave: '離開',
    cancel: '取消',
    cancelTitle: '繼續這局遊戲',
  },
  advanced: {
    summary: '進階設定',
    summaryTitle: '設定 AI 最多可以合成的方塊',
    label: '遊戲結束前的最大數字',
    noLimit: '無上限',
    hintNoLimit: '無上限：AI 會全力衝刺最大的方塊。',
    hintCap: 'AI 會玩到 {cap}，只有在沒有其他步可走時，才會合成結束遊戲的 {next}。',
  },
  footer: {
    credit: '製作：**FlexDev**',
    links: '專案連結',
    donate: '支持這個專案',
    donateTitle: '透過 monobank 捐贈任意金額',
    bug: '回報錯誤',
    source: 'GitHub 原始碼',
    language: '語言',
  },
};

export default zhHant;
