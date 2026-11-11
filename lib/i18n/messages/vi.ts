import type { Messages } from './en';

const vi: Messages = {
  meta: {
    title: '2048 AI Solver – Nước đi tốt nhất trong 2048, mỗi nước chỉ một chạm',
    description:
      'AI miễn phí cho 2048, cho bạn biết hướng vuốt tốt nhất trong ván đang chơi. Nhập bàn chơi một lần, sau đó chỉ cần chạm vào mỗi ô mới. Chạy ngay trên trình duyệt.',
  },
  tagline: 'Nhập bàn chơi của bạn — AI tính trước nhiều nước và tìm ra hướng vuốt tốt nhất.',
  directions: { up: 'lên', down: 'xuống', left: 'sang trái', right: 'sang phải' },
  directionLabels: { up: 'Lên', down: 'Xuống', left: 'Trái', right: 'Phải' },
  topbar: {
    homeTitle: 'Quay lại màn hình bắt đầu',
    undo: 'Hoàn tác nước vừa đi',
    menu: 'Quay lại menu',
    restart: 'Chơi lại từ đầu',
  },
  landing: {
    start: 'Bắt đầu',
    startTitle: 'Ván mới: chạm vào hai ô đầu tiên và nhận nước đi tốt nhất',
    continue: 'Tiếp tục ván',
    continueTitle: 'Đang chơi dở? Chép lại bàn chơi hoặc nhập ảnh chụp màn hình',
    hintLimit:
      'Mặc định, AI chơi đến **1024** và tránh tạo ô 2048, vì ở nhiều phiên bản ô này sẽ kết thúc ván. Bạn có thể đổi trong **Cài đặt nâng cao**.',
    hintContinue:
      'Đang chơi dở? Dùng **Tiếp tục ván** để dựng lại bàn chơi hiện tại, hoặc nhập ảnh chụp màn hình.',
  },
  demo: {
    label: 'Demo',
    play: 'Phát demo',
    pause: 'Tạm dừng demo',
    swipe: 'vuốt {direction}',
  },
  info: {
    howHeading: 'Cách hoạt động',
    steps: [
      '**Nhập bàn chơi.** Ván mới? Chạm vào hai ô đầu tiên. Đang chơi dở? Dùng **Tiếp tục ván** để chép lại bàn chơi.',
      '**Vuốt theo hướng AI chỉ** trong ván thật của bạn.',
      '**Chạm vào chỗ ô mới xuất hiện.** Mỗi nước một chạm — AI theo dõi phần còn lại.',
    ],
    faqHeading: 'Câu hỏi thường gặp',
    faq: [
      {
        q: 'Đây là loại AI gì?',
        a: 'Một thuật toán tìm kiếm cho trò chơi, không phải chatbot. Với mỗi hướng vuốt có thể, nó tính trước vài nước, lấy trung bình theo vị trí ô 2 hoặc 4 tiếp theo có thể xuất hiện (tìm kiếm expectimax) và chấm điểm từng thế cờ bằng hàm đánh giá từ AI 2048 nổi tiếng của nneonneo.',
      },
      {
        q: 'Nó theo chiến thuật nào?',
        a: 'Chiến thuật kinh điển: giữ ô lớn nhất ở một góc, các ô khác xếp phía sau theo thứ tự giảm dần, đồng thời chừa ô trống và sẵn các cặp để gộp. Quan sát các nước nó chọn là cách nhanh để chính bạn chơi 2048 giỏi hơn.',
      },
      {
        q: 'Nó có dùng được với trò 2048 của tôi không?',
        a: 'Có, nếu đó là bản 4×4 tiêu chuẩn, mỗi lần vuốt thêm một ô 2 hoặc 4: bản web gốc và hầu hết ứng dụng điện thoại.',
      },
      {
        q: 'Nó có đọc được bàn chơi từ ảnh chụp màn hình không?',
        a: 'Có. Chọn **Tiếp tục ván**, rồi nhập ảnh chụp màn hình ván chơi (hoặc dán vào). Nó đọc được 2048 gốc và play2048.co, ở cả chế độ sáng lẫn tối. Hãy kiểm tra bàn chơi trước khi giải: ô nào nó chưa chắc chắn sẽ được viền lại.',
      },
      {
        q: 'Có miễn phí không? Bàn chơi của tôi có bị gửi đi đâu không?',
        a: 'Miễn phí, không cần đăng ký và không có quảng cáo. AI chạy hoàn toàn trong trình duyệt nên bàn chơi không bao giờ rời khỏi thiết bị của bạn. Ảnh chụp màn hình cũng được đọc ngay trên thiết bị, không tải lên.',
      },
    ],
  },
  board: {
    yourBoard: 'Bàn chơi của bạn',
    row: 'hàng {row}: {cells}',
    empty: 'trống',
    emptyCell: 'Ô trống',
    tile: 'Ô {value}',
    cell: '{what} ở hàng {row}, cột {col}',
    flagged: '{label} (cần kiểm tra)',
  },
  status: {
    calculating: 'Đang tính nước đi tốt nhất…',
    bestMove: 'Nước đi tốt nhất: vuốt {direction}.',
    outOfMoves: 'Bạn đã hết nước đi.',
  },
  setup: {
    lead: 'Đặt hai ô đầu tiên (cả hai đều là **2**): chạm vào hai ô trống.',
    progress: 'Đã đặt {count}/{total}.',
    cellHint: 'Đặt ô 2 ở đây',
  },
  continueGame: {
    instruction:
      'Dựng lại ván đang chơi: nhập ảnh chụp màn hình, hoặc chọn một giá trị rồi chạm vào các ô để điền bàn chơi. Chạm vào ô đã có số để đổi, hoặc chọn **Xóa** để làm trống.',
    clearCell: 'Làm trống ô này',
    placeValue: 'Đặt {value} ở đây',
    solve: 'Giải từ đây',
    solveTitle: 'Xem nước đi tốt nhất cho bàn chơi này',
  },
  importShot: {
    button: 'Nhập ảnh chụp màn hình',
    reading: 'Đang đọc ảnh…',
    title:
      'Điền bàn chơi từ ảnh chụp màn hình ván chơi. Ảnh được đọc trên thiết bị này, không tải lên.',
    pasteHint: 'hoặc dán bằng Ctrl+V',
    readUnsure:
      'Số ô đã đọc: {tiles}. Kiểm tra các ô được viền ({unsure}), sửa ô nào sai rồi giải.',
    readOk: 'Số ô đã đọc: {tiles}. Kiểm tra xem có khớp với ván của bạn không rồi giải.',
    capLifted: 'Ván của bạn đã có ô {top} nên giới hạn ô đã được tắt.',
    noBoard:
      'Không tìm thấy bàn chơi 2048 trong ảnh này. Hãy dùng ảnh chụp có đầy đủ bàn chơi.',
    failed: 'Có lỗi khi đọc ảnh này. Hãy thử ảnh chụp màn hình khác.',
    notImage: 'Tệp này không phải là ảnh.',
    tooLarge: 'Ảnh quá lớn (trên 25 MB).',
    cannotOpen: 'Không mở được ảnh này.',
    noCanvas: 'Trình duyệt này không đọc được điểm ảnh.',
  },
  palette: {
    label: 'Giá trị ô cần đặt',
    erase: 'Xóa',
    eraseTitle: 'Chạm vào các ô trên bàn chơi để xóa',
    placeTitle: 'Chạm vào các ô trên bàn chơi để đặt {value}',
  },
  proposal: {
    best: 'Nước đi tốt nhất: vuốt **{direction}**.',
    next: 'Đi nước đó, rồi chạm vào chỗ ô mới xuất hiện trên bàn chơi **được làm nổi bật**.',
    capWarn: 'Không còn nước nào tránh được ô {next} — nước này sẽ tạo ra nó và kết thúc ván.',
    now: 'Hiện tại',
    tapSpot: 'Chạm vào vị trí ô mới ↓',
    boardBefore: 'Bàn chơi trước nước đi',
    boardAfter: 'Bàn chơi sau nước đi: chạm vào chỗ ô mới xuất hiện',
    cellHint: 'Chạm: ô {value} mới ở đây. Nhấn giữ hoặc nhấp chuột phải: ô {alt}',
    newTileValue: 'Giá trị ô mới',
    tapHint: 'Chạm để đặt **{value}**; nhấn giữ (hoặc nhấp chuột phải) để đặt **{alt}**.',
    selectorLabel: 'Giá trị ô mới',
    selectorTitle: 'Ô mới là {value}',
  },
  gameOver: {
    title: 'Bạn đã hết nước đi',
    finalBoard: 'Bàn chơi cuối cùng',
    restart: 'Chơi lại',
    restartTitle: 'Bắt đầu ván mới',
  },
  leave: {
    title: 'Rời ván này?',
    message: 'Bàn chơi hiện tại và tiến trình của bạn sẽ bị mất.',
    restart: 'Chơi lại',
    leave: 'Rời đi',
    cancel: 'Hủy',
    cancelTitle: 'Tiếp tục ván này',
  },
  advanced: {
    summary: 'Cài đặt nâng cao',
    summaryTitle: 'Đặt ô lớn nhất AI được phép tạo',
    label: 'Số lớn nhất trước khi kết thúc ván',
    noLimit: 'Không giới hạn',
    hintNoLimit: 'Không giới hạn — AI chơi hết sức để đạt ô cao nhất.',
    hintCap:
      'AI chơi đến {cap} và chỉ tạo ô {next} (sẽ kết thúc ván) khi không còn nước nào khác.',
  },
  footer: {
    credit: 'Thực hiện bởi **FlexDev**',
    links: 'Liên kết dự án',
    donate: 'Ủng hộ dự án này',
    donateTitle: 'Quyên góp số tiền bất kỳ qua monobank',
    bug: 'Báo lỗi',
    source: 'Mã nguồn trên GitHub',
    language: 'Ngôn ngữ',
  },
};

export default vi;
