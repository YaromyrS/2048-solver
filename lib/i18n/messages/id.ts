import type { Messages } from './en';

const id: Messages = {
  meta: {
    title: '2048 AI Solver – Langkah terbaik di 2048, satu ketukan per langkah',
    description:
      'AI gratis untuk 2048 yang memberi tahu arah geser terbaik untuk permainan yang sedang kamu mainkan. Masukkan papanmu sekali, lalu cukup ketuk setiap ubin baru. Berjalan di browser.',
  },
  tagline: 'Masukkan papanmu — AI melihat beberapa langkah ke depan dan menemukan arah geser terbaik.',
  directions: { up: 'ke atas', down: 'ke bawah', left: 'ke kiri', right: 'ke kanan' },
  directionLabels: { up: 'Atas', down: 'Bawah', left: 'Kiri', right: 'Kanan' },
  topbar: {
    homeTitle: 'Kembali ke layar awal',
    undo: 'Batalkan langkah terakhir',
    menu: 'Kembali ke menu',
    restart: 'Mulai ulang permainan',
  },
  landing: {
    start: 'Mulai',
    startTitle: 'Permainan baru: ketuk dua ubin pertamamu dan dapatkan langkah terbaik',
    continue: 'Lanjutkan permainan',
    continueTitle: 'Sudah bermain? Salin papanmu atau impor tangkapan layarnya',
    hintLimit:
      'Secara bawaan AI bermain sampai **1024** dan menghindari membuat 2048, yang di banyak versi mengakhiri permainan. Ubah ini di **Pengaturan lanjutan**.',
    hintContinue:
      'Sudah di tengah permainan? Gunakan **Lanjutkan permainan** untuk membuat ulang papanmu, atau impor tangkapan layarnya.',
  },
  demo: {
    label: 'Demo',
    play: 'Putar demo',
    pause: 'Jeda demo',
    swipe: 'geser {direction}',
  },
  info: {
    howHeading: 'Cara kerjanya',
    steps: [
      '**Masukkan papanmu.** Permainan baru? Ketuk dua ubin pertamamu. Sudah bermain? Gunakan **Lanjutkan permainan** untuk menyalin papanmu.',
      '**Geser ke arah yang ditunjukkan AI** di permainanmu yang sebenarnya.',
      '**Ketuk tempat ubin baru muncul.** Satu ketukan per langkah — sisanya dilacak AI.',
    ],
    faqHeading: 'Pertanyaan',
    faq: [
      {
        q: 'AI jenis apa ini?',
        a: 'Pencarian permainan, bukan chatbot. Untuk setiap kemungkinan geser, AI melihat beberapa langkah ke depan, merata-ratakan posisi munculnya angka 2 atau 4 berikutnya (pencarian expectimax), dan menilai setiap posisi dengan heuristik dari AI 2048 terkenal buatan nneonneo.',
      },
      {
        q: 'Strategi apa yang dipakai?',
        a: 'Strategi klasik: simpan ubin terbesar di satu sudut, ubin lain berbaris di belakangnya dari besar ke kecil, sambil menjaga petak kosong dan gabungan yang siap. Memperhatikan langkah yang dipilihnya adalah cara cepat untuk jadi lebih jago main 2048.',
      },
      {
        q: 'Apakah bisa dipakai untuk game 2048 saya?',
        a: 'Bisa, jika itu game standar 4×4 yang menambahkan 2 atau 4 setiap kali digeser: versi web asli dan sebagian besar aplikasi ponsel.',
      },
      {
        q: 'Bisakah membaca papan saya dari tangkapan layar?',
        a: 'Bisa. Pilih **Lanjutkan permainan**, lalu impor tangkapan layar permainanmu (atau tempelkan). AI bisa membaca 2048 asli dan play2048.co, dalam mode terang maupun gelap. Periksa papan sebelum mencari langkah: ubin yang belum pasti terbaca akan diberi garis tepi.',
      },
      {
        q: 'Apakah gratis? Apakah papan saya dikirim ke mana-mana?',
        a: 'Gratis, tanpa daftar dan tanpa iklan. AI berjalan sepenuhnya di browsermu, jadi papanmu tidak pernah keluar dari perangkatmu. Tangkapan layar juga dibaca di perangkatmu dan tidak pernah diunggah.',
      },
    ],
  },
  board: {
    yourBoard: 'Papanmu',
    row: 'baris {row}: {cells}',
    empty: 'kosong',
    emptyCell: 'Petak kosong',
    tile: 'Ubin {value}',
    cell: '{what} di baris {row}, kolom {col}',
    flagged: '{label} (periksa)',
  },
  status: {
    calculating: 'Menghitung langkah terbaik…',
    bestMove: 'Langkah terbaik: geser {direction}.',
    outOfMoves: 'Langkahmu sudah habis.',
  },
  setup: {
    lead: 'Letakkan dua ubin pertamamu (keduanya **2**): ketuk dua petak kosong.',
    progress: '{count}/{total} diletakkan.',
    cellHint: 'Letakkan 2 di sini',
  },
  continueGame: {
    instruction:
      'Buat ulang permainanmu saat ini: impor tangkapan layarnya, atau pilih nilai lalu ketuk petak untuk mengisi papanmu. Ketuk petak yang terisi untuk mengubahnya, atau pilih **Hapus** untuk mengosongkannya.',
    clearCell: 'Kosongkan petak ini',
    placeValue: 'Letakkan {value} di sini',
    solve: 'Cari langkah dari sini',
    solveTitle: 'Dapatkan langkah terbaik untuk papan ini',
  },
  importShot: {
    button: 'Impor tangkapan layar',
    reading: 'Membaca tangkapan layar…',
    title:
      'Isi papan dari tangkapan layar permainanmu. Gambar dibaca di perangkat ini dan tidak pernah diunggah.',
    pasteHint: 'atau tempel dengan Ctrl+V',
    readUnsure:
      'Ubin terbaca: {tiles}. Periksa yang bergaris tepi ({unsure}), perbaiki yang salah, lalu cari langkah.',
    readOk: 'Ubin terbaca: {tiles}. Pastikan sesuai dengan permainanmu, lalu cari langkah.',
    capLifted: 'Permainanmu sudah punya {top}, jadi batas ubin sekarang dimatikan.',
    noBoard:
      'Tidak menemukan papan 2048 di gambar itu. Gunakan tangkapan layar yang menampilkan seluruh papan.',
    failed: 'Terjadi kesalahan saat membaca gambar itu. Coba tangkapan layar lain.',
    notImage: 'File itu bukan gambar.',
    tooLarge: 'Gambar itu terlalu besar (lebih dari 25 MB).',
    cannotOpen: 'Gambar itu tidak bisa dibuka.',
    noCanvas: 'Browser ini tidak bisa membaca piksel gambar.',
  },
  palette: {
    label: 'Nilai ubin yang diletakkan',
    erase: 'Hapus',
    eraseTitle: 'Ketuk ubin di papan untuk menghapusnya',
    placeTitle: 'Ketuk petak di papan untuk meletakkan {value}',
  },
  proposal: {
    best: 'Langkah terbaik: geser **{direction}**.',
    next: 'Lakukan langkah itu, lalu ketuk tempat ubin baru muncul di papan yang **disorot**.',
    capWarn:
      'Tidak ada lagi langkah yang menghindari {next} — langkah ini membentuknya dan mengakhiri permainan.',
    now: 'Sekarang',
    tapSpot: 'Ketuk tempat ubin baru ↓',
    boardBefore: 'Papan sebelum langkah',
    boardAfter: 'Papan setelah langkah: ketuk tempat ubin baru muncul',
    cellHint: 'Ketuk: {value} baru di sini. Tekan lama atau klik kanan: {alt}',
    newTileValue: 'Nilai ubin baru',
    tapHint: 'Ketuk untuk meletakkan **{value}**; tekan lama (atau klik kanan) untuk **{alt}**.',
    selectorLabel: 'Nilai ubin baru',
    selectorTitle: 'Ubin barunya {value}',
  },
  gameOver: {
    title: 'Langkahmu sudah habis',
    finalBoard: 'Papan akhir',
    restart: 'Mulai ulang',
    restartTitle: 'Mulai permainan baru',
  },
  leave: {
    title: 'Tinggalkan permainan ini?',
    message: 'Papan dan progresmu saat ini akan hilang.',
    restart: 'Mulai ulang',
    leave: 'Tinggalkan',
    cancel: 'Batal',
    cancelTitle: 'Tetap di permainan ini',
  },
  advanced: {
    summary: 'Pengaturan lanjutan',
    summaryTitle: 'Atur ubin tertinggi yang boleh dibuat AI',
    label: 'Angka maksimum sebelum permainan berakhir',
    noLimit: 'Tanpa batas',
    hintNoLimit: 'Tanpa batas — AI bermain habis-habisan demi ubin tertinggi.',
    hintCap:
      'AI bermain sampai {cap} dan hanya membentuk {next}, yang mengakhiri permainan, jika tidak ada langkah lain.',
  },
  footer: {
    credit: 'Dibuat oleh **FlexDev**',
    links: 'Tautan proyek',
    donate: 'Dukung proyek ini',
    donateTitle: 'Donasi berapa pun lewat monobank',
    bug: 'Laporkan bug',
    source: 'Kode sumber di GitHub',
    language: 'Bahasa',
  },
};

export default id;
