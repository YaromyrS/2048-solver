import type { Messages } from './en';

/**
 * Turkish suffixes follow the sound of the word before them, so no suffix is
 * attached to a `{placeholder}` number; the sentences are built around it.
 */
const tr: Messages = {
  meta: {
    title: '2048 AI Solver – 2048’de en iyi hamle, her hamlede tek dokunuş',
    description:
      'Oynadığın 2048 oyunu için en iyi kaydırmayı söyleyen ücretsiz yapay zekâ. Tahtanı bir kez gir, sonra sadece her yeni karoya dokun. Tarayıcında çalışır.',
  },
  tagline: 'Tahtanı gir; yapay zekâ birkaç hamle ilerisini hesaplar ve en iyi kaydırmayı bulur.',
  directions: { up: 'yukarı', down: 'aşağı', left: 'sola', right: 'sağa' },
  directionLabels: { up: 'Yukarı', down: 'Aşağı', left: 'Sol', right: 'Sağ' },
  topbar: {
    homeTitle: 'Başlangıç ekranına dön',
    undo: 'Son hamleyi geri al',
    menu: 'Menüye dön',
    restart: 'Oyunu yeniden başlat',
  },
  landing: {
    start: 'Başla',
    startTitle: 'Yeni oyun: ilk iki karona dokun ve en iyi hamleyi gör',
    continue: 'Oyuna devam et',
    continueTitle: 'Zaten oynuyor musun? Tahtanı aktar ya da ekran görüntüsünü içe aktar',
    hintLimit:
      'Varsayılan olarak yapay zekâ **1024**’e kadar oynar ve birçok sürümde oyunu bitiren 2048’i oluşturmaktan kaçınır. Bunu **Gelişmiş ayarlar** bölümünden değiştirebilirsin.',
    hintContinue:
      'Oyunun ortasında mısın? Mevcut tahtanı yeniden oluşturmak için **Oyuna devam et** düğmesini kullan ya da ekran görüntüsünü içe aktar.',
  },
  demo: {
    label: 'Demo',
    play: 'Demoyu oynat',
    pause: 'Demoyu duraklat',
    swipe: '{direction} kaydır',
  },
  info: {
    howHeading: 'Nasıl çalışır?',
    steps: [
      '**Tahtanı gir.** Yeni oyun mu? İlk iki karona dokun. Zaten oynuyor musun? Tahtanı aktarmak için **Oyuna devam et** düğmesini kullan.',
      'Gerçek oyununda **yapay zekânın söylediği yöne kaydır**.',
      '**Yeni karonun çıktığı yere dokun.** Her hamlede tek dokunuş; gerisini yapay zekâ takip eder.',
    ],
    faqHeading: 'Sorular',
    faq: [
      {
        q: 'Bu nasıl bir yapay zekâ?',
        a: 'Bir sohbet botu değil, bir oyun arama algoritması. Her olası kaydırma için birkaç hamle ilerisine bakar, sıradaki 2 ya da 4’ün nerede çıkabileceğinin ortalamasını alır (expectimax araması) ve her konumu nneonneo’nun ünlü 2048 yapay zekâsındaki değerlendirme işleviyle puanlar.',
      },
      {
        q: 'Hangi stratejiyi izliyor?',
        a: 'Klasik olanı: en büyük karoyu bir köşede tutmak, diğerlerini arkasına büyükten küçüğe dizmek, bu sırada boş kareler ve hazır birleşmeler bırakmak. Hangi hamleleri seçtiğini izlemek, 2048’de kendin de hızla gelişmenin iyi bir yolu.',
      },
      {
        q: '2048 oyunumla çalışır mı?',
        a: 'Evet, her kaydırmada bir 2 ya da 4 eklenen standart 4×4 oyunsa: orijinal web sürümü ve çoğu mobil uygulama.',
      },
      {
        q: 'Tahtamı ekran görüntüsünden okuyabilir mi?',
        a: 'Evet. **Oyuna devam et** düğmesini seç, ardından oyununun ekran görüntüsünü içe aktar (ya da yapıştır). Orijinal 2048’i ve play2048.co’yu, açık veya koyu modda okur. Çözmeden önce tahtayı kontrol et: emin olamadığı karoların çevresi çizilir.',
      },
      {
        q: 'Ücretsiz mi? Tahtam bir yere gönderiliyor mu?',
        a: 'Ücretsiz; üyelik ve reklam yok. Yapay zekâ tamamen tarayıcında çalışır, yani tahtan cihazından hiç çıkmaz. Ekran görüntüleri de cihazında okunur, asla yüklenmez.',
      },
    ],
  },
  board: {
    yourBoard: 'Tahtan',
    row: 'satır {row}: {cells}',
    empty: 'boş',
    emptyCell: 'Boş kare',
    tile: 'Karo {value}',
    cell: '{what}, satır {row}, sütun {col}',
    flagged: '{label} (kontrol et)',
  },
  status: {
    calculating: 'En iyi hamle hesaplanıyor…',
    bestMove: 'En iyi hamle: {direction} kaydır.',
    outOfMoves: 'Hamle kalmadı.',
  },
  setup: {
    lead: 'İlk iki karonu yerleştir (ikisi de **2**): iki boş kareye dokun.',
    progress: '{count}/{total} yerleştirildi.',
    cellHint: 'Buraya 2 koy',
  },
  continueGame: {
    instruction:
      'Mevcut oyununu yeniden oluştur: ekran görüntüsünü içe aktar ya da bir değer seçip karelere dokunarak tahtanı doldur. Değiştirmek için dolu bir kareye dokun ya da temizlemek için **Sil** seçeneğini seç.',
    clearCell: 'Bu kareyi temizle',
    placeValue: 'Buraya {value} koy',
    solve: 'Buradan çöz',
    solveTitle: 'Bu tahta için en iyi hamleyi göster',
  },
  importShot: {
    button: 'Ekran görüntüsü içe aktar',
    reading: 'Ekran görüntüsü okunuyor…',
    title: 'Tahtayı oyununun ekran görüntüsünden doldur. Bu cihazda okunur, asla yüklenmez.',
    pasteHint: 'ya da Ctrl+V ile yapıştır',
    readUnsure:
      'Okunan karo sayısı: {tiles}. Çevresi çizili karoları ({unsure}) kontrol et, yanlışları düzelt, sonra çöz.',
    readOk: 'Okunan karo sayısı: {tiles}. Oyununla eşleştiğini kontrol et, sonra çöz.',
    capLifted: 'Oyununda zaten {top} karosu var, bu yüzden karo sınırı kapatıldı.',
    noBoard:
      'Bu görüntüde 2048 tahtası bulunamadı. Tahtanın tamamını gösteren bir ekran görüntüsü kullan.',
    failed: 'Görüntü okunurken bir sorun oluştu. Başka bir ekran görüntüsü dene.',
    notImage: 'Bu dosya bir görüntü değil.',
    tooLarge: 'Görüntü çok büyük (25 MB’tan fazla).',
    cannotOpen: 'Görüntü açılamadı.',
    noCanvas: 'Bu tarayıcı görüntü piksellerini okuyamıyor.',
  },
  palette: {
    label: 'Yerleştirilecek karo değeri',
    erase: 'Sil',
    eraseTitle: 'Silmek için tahtadaki karolara dokun',
    placeTitle: 'Tahtadaki karelere dokunarak {value} koy',
  },
  proposal: {
    best: 'En iyi hamle: **{direction}** kaydır.',
    next: 'Bu hamleyi yap, sonra **vurgulanan** tahtada yeni karonun çıktığı yere dokun.',
    capWarn:
      'Artık hiçbir hamle {next} karosunu engelleyemiyor; bu hamle onu oluşturur ve oyunu bitirir.',
    now: 'Şimdi',
    tapSpot: 'Yeni karonun yerine dokun ↓',
    boardBefore: 'Hamleden önceki tahta',
    boardAfter: 'Hamleden sonraki tahta: yeni karonun çıktığı yere dokun',
    cellHint: 'Dokun: buraya yeni bir {value}. Uzun bas ya da sağ tıkla: {alt}',
    newTileValue: 'Yeni karonun değeri',
    tapHint: 'Dokunmak **{value}**, uzun basmak (ya da sağ tık) **{alt}** koyar.',
    selectorLabel: 'Yeni karonun değeri',
    selectorTitle: 'Yeni karo: {value}',
  },
  gameOver: {
    title: 'Hamle kalmadı',
    finalBoard: 'Son tahta',
    restart: 'Yeniden başlat',
    restartTitle: 'Yeni bir oyun başlat',
  },
  leave: {
    title: 'Bu oyundan çıkılsın mı?',
    message: 'Mevcut tahtan ve ilerlemen kaybolacak.',
    restart: 'Yeniden başlat',
    leave: 'Çık',
    cancel: 'İptal',
    cancelTitle: 'Bu oyunda kal',
  },
  advanced: {
    summary: 'Gelişmiş ayarlar',
    summaryTitle: 'Yapay zekânın oluşturabileceği en yüksek karoyu ayarla',
    label: 'Oyun bitmeden önceki en yüksek sayı',
    noLimit: 'Sınır yok',
    hintNoLimit: 'Sınır yok: yapay zekâ en yüksek karo için sonuna kadar oynar.',
    hintCap:
      'Yapay zekâ en fazla {cap} değerine kadar oynar ve oyunu bitiren {next} karosunu yalnızca başka hamle kalmadığında oluşturur.',
  },
  footer: {
    credit: 'Geliştiren: **FlexDev**',
    links: 'Proje bağlantıları',
    donate: 'Bu projeyi destekle',
    donateTitle: 'monobank üzerinden istediğin miktarda bağış yap',
    bug: 'Hata bildir',
    source: 'GitHub’daki kaynak kod',
    language: 'Dil',
  },
};

export default tr;
