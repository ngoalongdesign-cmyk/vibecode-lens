(() => {
  if (window.__VIBECODE_LENS_LOADED__) return;
  window.__VIBECODE_LENS_LOADED__ = true;

  const VERSION = '0.3.0';
  const MARA_URL = 'https://maralabs.vn';
  const VIBECODE_URL = 'https://vibecode.maralabs.vn';
  const OVERRIDE_STORAGE_KEY = 'vibecodeLensPageOverridesV1';


  const STATE = {
    enabled: false,
    locked: false,
    currentElement: null,
    tooltip: null,
    highlight: null,
    lastInfo: null,
    overTooltip: false,
    pointer: { x: 20, y: 20 },
    lastMoveAt: 0,
    hideTimer: null,
    activeReasonIndex: 0,
    reasonPage: 0,
    lang: 'vi',
    selectedType: null,
    showTypePicker: false,
    showHelp: false,
    showAdvanced: false,
    currentPrompt: '',
    overrides: {},
    matchedOverride: null,
    memoryNotice: null,
    memoryTimer: null,
    stablePanelPosition: null
  };

  const UI = {
    navbar: { label: 'Thanh trên cùng', desc: 'Khu vực điều hướng ở đầu trang, thường chứa logo, menu và nút chính.' },
    sidebar: { label: 'Thanh bên', desc: 'Khu vực điều hướng bên trái hoặc bên phải của ứng dụng.' },
    footer: { label: 'Chân trang', desc: 'Phần cuối trang, thường chứa link phụ, thông tin thương hiệu hoặc liên hệ.' },
    logo: { label: 'Logo', desc: 'Tên hoặc dấu hiệu nhận diện thương hiệu, thường dùng để quay về trang chính.' },
    button: { label: 'Nút bấm', desc: 'Nút để người dùng thực hiện một hành động.' },
    searchInput: { label: 'Ô tìm kiếm', desc: 'Ô để tìm nhanh nội dung trong trang hoặc trong ứng dụng.' },
    chatComposer: { label: 'Ô nhập chat', desc: 'Nơi người dùng nhập câu hỏi hoặc prompt để gửi cho AI.' },
    accountMenu: { label: 'Khu vực tài khoản', desc: 'Phần hiển thị tài khoản hiện tại, thường dùng để mở menu hồ sơ hoặc cài đặt.' },
    menuItem: { label: 'Mục menu', desc: 'Một mục trong menu để chuyển sang màn hình hoặc tính năng khác.' },
    link: { label: 'Đường dẫn', desc: 'Chữ hoặc vùng bấm để mở trang, chuyển khu vực hoặc xem thêm.' },
    input: { label: 'Ô nhập liệu', desc: 'Ô để người dùng nhập thông tin như email, tên, mật khẩu hoặc ghi chú.' },
    form: { label: 'Biểu mẫu', desc: 'Nhóm ô nhập và nút gửi để thu thập thông tin từ người dùng.' },
    card: { label: 'Thẻ nội dung', desc: 'Một khối gom thông tin riêng biệt như tiêu đề, mô tả, ảnh hoặc nút.' },
    modal: { label: 'Popup', desc: 'Khung nổi trên giao diện để xác nhận, nhập dữ liệu hoặc đọc thông báo.' },
    hero: { label: 'Màn mở đầu', desc: 'Phần đầu trang nói sản phẩm là gì, dành cho ai và kêu gọi hành động.' },
    pricing: { label: 'Bảng giá', desc: 'Khu vực trình bày các gói giá, quyền lợi và nút mua/nâng cấp.' },
    table: { label: 'Bảng dữ liệu', desc: 'Khu vực hiển thị thông tin theo hàng và cột.' },
    image: { label: 'Hình ảnh', desc: 'Ảnh minh họa, avatar, thumbnail hoặc hình sản phẩm.' },
    textLabel: { label: 'Cụm chữ', desc: 'Một cụm chữ ngắn để đặt tên, đánh dấu hoặc dẫn người dùng.' },
    text: { label: 'Đoạn mô tả', desc: 'Khối chữ dùng để giải thích hoặc trình bày nội dung chính.' },
    list: { label: 'Danh sách', desc: 'Nhóm nhiều mục được xếp thành dòng để người đọc quét nhanh.' },
    section: { label: 'Khối nội dung', desc: 'Một vùng lớn gom một ý chính hoặc nhóm thành phần liên quan.' },
    container: { label: 'Khung chứa', desc: 'Lớp bao ngoài dùng để căn chiều rộng, khoảng cách và bố cục bên trong.' }
  };

  const REASONS = {
    navbar: {
      primary: ['gọn hơn', 'rõ menu hơn', 'nổi nút chính', 'căn lại'],
      alt: ['giảm rối', 'đổi style', 'dễ quét hơn', 'active rõ hơn']
    },
    sidebar: {
      primary: ['gọn hơn', 'rõ mục đang chọn', 'căn lại', 'bớt rối'],
      alt: ['thu nhỏ lại', 'đổi style', 'dễ quét hơn', 'nổi menu chính']
    },
    footer: {
      primary: ['gọn hơn', 'dễ đọc hơn', 'bớt rối', 'đồng bộ style'],
      alt: ['chia cột lại', 'giảm chữ', 'nổi link chính', 'thoáng hơn']
    },
    logo: {
      primary: ['dễ nhận ra', 'căn lại', 'đổi chữ', 'đúng kích thước'],
      alt: ['nổi hơn', 'gọn hơn', 'đồng bộ style', 'đổi style']
    },
    button: {
      primary: ['nổi hơn', 'đổi chữ', 'to/nhỏ lại', 'bo mềm hơn'],
      alt: ['đổi màu', 'rõ hover hơn', 'ít gắt hơn', 'đồng bộ style']
    },
    searchInput: {
      primary: ['rõ hơn', 'gọn hơn', 'đổi placeholder', 'căn icon'],
      alt: ['nổi viền hơn', 'dễ nhập hơn', 'đổi style', 'giảm chiều cao']
    },
    chatComposer: {
      primary: ['rõ hơn', 'dễ nhập hơn', 'gọn hơn', 'căn icon'],
      alt: ['đổi placeholder', 'nổi nút gửi', 'thoáng hơn', 'đổi style']
    },
    accountMenu: {
      primary: ['gọn hơn', 'nổi hơn', 'căn lại', 'đổi chữ'],
      alt: ['giảm thông tin', 'đổi style', 'avatar rõ hơn', 'ít chiếm chỗ']
    },
    menuItem: {
      primary: ['rõ hơn', 'căn lại', 'active rõ hơn', 'bớt rối'],
      alt: ['đổi icon', 'đổi chữ', 'giảm khoảng cách', 'dễ quét hơn']
    },
    link: {
      primary: ['rõ hơn', 'đổi chữ', 'nổi hơn', 'bỏ gạch chân'],
      alt: ['đổi màu', 'nhấn nhẹ hơn', 'đồng bộ style', 'dễ bấm hơn']
    },
    input: {
      primary: ['rõ hơn', 'gọn hơn', 'đổi placeholder', 'căn lại'],
      alt: ['nổi viền hơn', 'dễ nhập hơn', 'lỗi rõ hơn', 'đổi style']
    },
    form: {
      primary: ['gọn hơn', 'dễ nhập hơn', 'lỗi rõ hơn', 'căn lại'],
      alt: ['giảm số ô', 'đổi nhãn', 'nổi nút gửi', 'thoáng hơn']
    },
    card: {
      primary: ['gọn hơn', 'nổi hơn', 'thoáng hơn', 'bớt rối'],
      alt: ['rõ thứ tự hơn', 'đổi style', 'bo mềm hơn', 'đồng bộ hơn']
    },
    modal: {
      primary: ['gọn hơn', 'rõ hành động', 'dễ đóng hơn', 'bớt rối'],
      alt: ['đổi tiêu đề', 'nổi nút chính', 'giảm chữ', 'đổi style']
    },
    hero: {
      primary: ['rõ thông điệp', 'nổi nút chính', 'thoáng hơn', 'đỡ rối'],
      alt: ['đổi headline', 'mạnh hơn', 'ít chữ hơn', 'đổi bố cục']
    },
    pricing: {
      primary: ['nổi gói chính', 'dễ so sánh', 'gọn hơn', 'rõ nút mua'],
      alt: ['giảm chữ', 'đổi badge', 'rõ quyền lợi', 'đồng bộ card']
    },
    table: {
      primary: ['dễ đọc hơn', 'căn lại', 'gọn hơn', 'rõ cột'],
      alt: ['nổi header', 'giãn dòng', 'bớt rối', 'dễ quét hơn']
    },
    image: {
      primary: ['đúng tỉ lệ', 'bo mềm hơn', 'rõ hơn', 'căn lại'],
      alt: ['đổi ảnh', 'ít méo hơn', 'nổi hơn', 'đồng bộ style']
    },
    textLabel: {
      primary: ['đổi chữ', 'dễ đọc hơn', 'nổi hơn', 'căn lại'],
      alt: ['ngắn hơn', 'đậm hơn', 'nhẹ hơn', 'đổi giọng văn']
    },
    text: {
      primary: ['ngắn hơn', 'dễ đọc hơn', 'thoáng hơn', 'bớt rối'],
      alt: ['đổi giọng văn', 'chia đoạn', 'nhấn ý chính', 'ít khô hơn']
    },
    list: {
      primary: ['gọn hơn', 'dễ quét hơn', 'giãn dòng', 'bớt rối'],
      alt: ['đổi thứ tự', 'rõ nhóm hơn', 'giảm mục', 'nổi ý chính']
    },
    section: {
      primary: ['thoáng hơn', 'rõ bố cục', 'đỡ rối', 'đồng bộ style'],
      alt: ['chia lại phần', 'đổi nền', 'nổi nội dung chính', 'giảm chiều cao']
    },
    container: {
      primary: ['căn lại', 'gọn hơn', 'thoáng hơn', 'đúng chiều rộng'],
      alt: ['giảm padding', 'tăng khoảng cách', 'đổi layout', 'đồng bộ style']
    }
  };

  const UI_EN = {
    navbar: { label: 'Top bar', desc: 'Navigation area at the top, usually contains logo, menu, and main CTA.' },
    sidebar: { label: 'Sidebar', desc: 'Navigation panel on the left or right side of the app.' },
    footer: { label: 'Footer', desc: 'Bottom section with secondary links, brand info, or contact.' },
    logo: { label: 'Logo', desc: 'Brand name or mark, usually links back to the home page.' },
    button: { label: 'Button', desc: 'A clickable element to trigger an action.' },
    searchInput: { label: 'Search field', desc: 'Input to quickly find content on the page or in the app.' },
    chatComposer: { label: 'Chat input', desc: 'Where users type questions or prompts to send to AI.' },
    accountMenu: { label: 'Account area', desc: 'Shows the current account, usually opens profile or settings.' },
    menuItem: { label: 'Menu item', desc: 'A navigation item to switch to another screen or feature.' },
    link: { label: 'Link', desc: 'Text or clickable area to open a page, jump to a section, or see more.' },
    input: { label: 'Input field', desc: 'Where users type info like email, name, password, or notes.' },
    form: { label: 'Form', desc: 'A group of inputs and a submit button to collect user data.' },
    card: { label: 'Card', desc: 'A content block grouping a title, description, image, or actions.' },
    modal: { label: 'Modal', desc: 'Overlay dialog for confirmation, data entry, or notifications.' },
    hero: { label: 'Hero section', desc: "Opening section that explains the product, who it's for, and the CTA." },
    pricing: { label: 'Pricing', desc: 'Area showing plans, benefits, and buy/upgrade buttons.' },
    table: { label: 'Data table', desc: 'Area displaying information in rows and columns.' },
    image: { label: 'Image', desc: 'Illustration, avatar, thumbnail, or product photo.' },
    textLabel: { label: 'Label', desc: 'Short text used to name, tag, or guide the user.' },
    text: { label: 'Body text', desc: 'Text block used to explain or present main content.' },
    list: { label: 'List', desc: 'Multiple items arranged in rows for quick scanning.' },
    section: { label: 'Section', desc: 'A large area grouping one main idea or related components.' },
    container: { label: 'Container', desc: 'Outer wrapper to control width, spacing, and inner layout.' }
  };

  const REASONS_EN = {
    navbar: { primary: ['cleaner', 'clearer menu', 'highlight CTA', 'realign'], alt: ['less clutter', 'restyle', 'easier to scan', 'clearer active state'] },
    sidebar: { primary: ['cleaner', 'clearer active item', 'realign', 'less clutter'], alt: ['collapse it', 'restyle', 'easier to scan', 'highlight main nav'] },
    footer: { primary: ['cleaner', 'more readable', 'less clutter', 'consistent style'], alt: ['restructure columns', 'less text', 'highlight main links', 'more spacious'] },
    logo: { primary: ['more recognizable', 'realign', 'change text', 'right size'], alt: ['more prominent', 'cleaner', 'consistent style', 'restyle'] },
    button: { primary: ['more prominent', 'change label', 'resize', 'softer corners'], alt: ['change color', 'clearer hover', 'less intense', 'consistent style'] },
    searchInput: { primary: ['clearer', 'cleaner', 'change placeholder', 'align icon'], alt: ['stronger border', 'easier to type', 'restyle', 'reduce height'] },
    chatComposer: { primary: ['clearer', 'easier to type', 'cleaner', 'align icon'], alt: ['change placeholder', 'highlight send button', 'more spacious', 'restyle'] },
    accountMenu: { primary: ['cleaner', 'more prominent', 'realign', 'change label'], alt: ['less info', 'restyle', 'clearer avatar', 'less space'] },
    menuItem: { primary: ['clearer', 'realign', 'clearer active state', 'less clutter'], alt: ['change icon', 'change label', 'reduce spacing', 'easier to scan'] },
    link: { primary: ['clearer', 'change label', 'more prominent', 'remove underline'], alt: ['change color', 'softer', 'consistent style', 'easier to tap'] },
    input: { primary: ['clearer', 'cleaner', 'change placeholder', 'realign'], alt: ['stronger border', 'easier to type', 'clearer error state', 'restyle'] },
    form: { primary: ['cleaner', 'easier to fill', 'clearer errors', 'realign'], alt: ['fewer fields', 'change labels', 'highlight submit', 'more spacious'] },
    card: { primary: ['cleaner', 'more prominent', 'more spacious', 'less clutter'], alt: ['clearer hierarchy', 'restyle', 'softer corners', 'more consistent'] },
    modal: { primary: ['cleaner', 'clearer actions', 'easier to close', 'less clutter'], alt: ['change title', 'highlight main button', 'less text', 'restyle'] },
    hero: { primary: ['clearer message', 'highlight CTA', 'more spacious', 'less clutter'], alt: ['change headline', 'more impactful', 'less text', 'change layout'] },
    pricing: { primary: ['highlight main plan', 'easier to compare', 'cleaner', 'clearer CTA'], alt: ['less text', 'change badge', 'clearer benefits', 'consistent cards'] },
    table: { primary: ['easier to read', 'realign', 'cleaner', 'clearer columns'], alt: ['highlight header', 'more row spacing', 'less clutter', 'easier to scan'] },
    image: { primary: ['correct ratio', 'softer corners', 'clearer', 'realign'], alt: ['change image', 'less distorted', 'more prominent', 'consistent style'] },
    textLabel: { primary: ['change label', 'more readable', 'more prominent', 'realign'], alt: ['shorter', 'bolder', 'lighter', 'change tone'] },
    text: { primary: ['shorter', 'more readable', 'more spacious', 'less clutter'], alt: ['change tone', 'add paragraphs', 'highlight key points', 'less formal'] },
    list: { primary: ['cleaner', 'easier to scan', 'more line spacing', 'less clutter'], alt: ['reorder', 'clearer groups', 'fewer items', 'highlight key points'] },
    section: { primary: ['more spacious', 'clearer layout', 'less clutter', 'consistent style'], alt: ['restructure', 'change background', 'highlight main content', 'reduce height'] },
    container: { primary: ['realign', 'cleaner', 'more spacious', 'correct width'], alt: ['reduce padding', 'increase spacing', 'change layout', 'consistent style'] }
  };

  const T = {
    vi: {
      promptLabel: 'Prompt cho AI', chipsLabel: 'Sửa nhanh', cycleTitle: 'Đổi gợi ý sửa',
      copyBtn: 'Copy câu này', copiedBtn: 'Đã copy', addedToPrompt: 'Đã thêm vào prompt',
      wrongType: 'Không đúng? Đổi loại', viewTech: 'Xem kỹ thuật',
      lockTitle: 'Khóa vùng', unlockTitle: 'Mở khóa vùng', settingsTitle: 'Cài đặt', closeTitle: 'Đóng',
      shortcutToggle: 'bật/tắt', shortcutClose: 'tắt', shortcutLock: 'khóa vùng', shortcutCopy: 'copy câu',
      techLabel: 'Chi tiết kỹ thuật', langLabel: 'Ngôn ngữ', madeBy: 'tạo bởi',
      rememberQ: 'Nhớ lựa chọn này?', rememberBtn: 'Nhớ cho trang này', rememberDone: 'Đã nhớ cho trang này',
      forgetBtn: 'Bỏ nhớ vùng này', clearMemBtn: 'Xóa các vùng đã nhớ trên trang này',
    },
    en: {
      promptLabel: 'AI Prompt', chipsLabel: 'Quick fixes', cycleTitle: 'Shuffle suggestions',
      copyBtn: 'Copy prompt', copiedBtn: 'Copied!', addedToPrompt: 'Added to prompt',
      wrongType: 'Wrong type? Change it', viewTech: 'Technical details',
      lockTitle: 'Lock zone', unlockTitle: 'Unlock zone', settingsTitle: 'Settings', closeTitle: 'Close',
      shortcutToggle: 'toggle', shortcutClose: 'close', shortcutLock: 'lock zone', shortcutCopy: 'copy',
      techLabel: 'Technical details', langLabel: 'Language', madeBy: 'created by',
      rememberQ: 'Remember this choice?', rememberBtn: 'Remember for this page', rememberDone: 'Remembered!',
      forgetBtn: 'Forget this zone', clearMemBtn: 'Clear all saved zones on this page',
    }
  };

  const TYPE_CHOICES = ['chatComposer', 'searchInput', 'button', 'accountMenu', 'menuItem', 'logo', 'card', 'text', 'input', 'form', 'navbar', 'sidebar', 'modal', 'pricing', 'section', 'container'];

  function init() {
    loadOverrides();
    loadLang();
    chrome.storage?.sync?.get('lensEnabled', ({ lensEnabled = false }) => setEnabled(Boolean(lensEnabled)));

    chrome.runtime?.onMessage?.addListener((message, sender, sendResponse) => {
      if (message.type === 'VIBECODE_LENS_PING') { sendResponse({ ok: true }); return; }
      if (message.type === 'VIBECODE_LENS_TOGGLE') setEnabled(Boolean(message.enabled));
    });

    document.addEventListener('keydown', onKeyDown, true);
  }

  function onKeyDown(event) {
    if (!STATE.enabled) return;
    const active = document.activeElement;
    const typing = active && (active.matches?.('input, textarea, [contenteditable="true"], [role="textbox"]'));
    if (event.key === 'Escape') {
      event.preventDefault();
      setEnabled(false, true);
      return;
    }
    if (!typing && (event.key === 'c' || event.key === 'C') && STATE.lastInfo && STATE.currentPrompt) {
      event.preventDefault();
      copyText(STATE.currentPrompt);
      flashCopyButton(T[STATE.lang].copiedBtn);
    }
  }

  function setEnabled(enabled, persist = false) {
    STATE.enabled = enabled;
    if (persist) chrome.storage?.sync?.set({ lensEnabled: false });
    if (enabled) {
      ensureLayers();
      document.addEventListener('mousemove', onMouseMove, true);
      document.addEventListener('click', onPageClick, true);
      document.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition, true);
    } else {
      document.removeEventListener('mousemove', onMouseMove, true);
      document.removeEventListener('click', onPageClick, true);
      document.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition, true);
      cleanupLayers();
    }
  }

  function ensureLayers() {
    if (!STATE.highlight) {
      STATE.highlight = document.createElement('div');
      STATE.highlight.id = 'vibecode-lens-highlight';
      document.documentElement.appendChild(STATE.highlight);
    }
    if (!STATE.tooltip) {
      STATE.tooltip = document.createElement('div');
      STATE.tooltip.id = 'vibecode-lens-tooltip';
      STATE.tooltip.addEventListener('click', onTooltipClick, true);
      STATE.tooltip.addEventListener('mouseenter', () => { STATE.overTooltip = true; clearHideTimer(); });
      STATE.tooltip.addEventListener('mouseleave', () => { STATE.overTooltip = false; });
      document.documentElement.appendChild(STATE.tooltip);
    }
  }

  function cleanupLayers() {
    clearHideTimer();
    STATE.currentElement = null;
    STATE.lastInfo = null;
    STATE.locked = false;
    STATE.overTooltip = false;
    STATE.activeReasonIndex = 0;
    STATE.reasonPage = 0;
    STATE.selectedType = null;
    STATE.showTypePicker = false;
    STATE.showHelp = false;
    STATE.showAdvanced = false;
    STATE.currentPrompt = '';
    STATE.matchedOverride = null;
    STATE.stablePanelPosition = null;
    STATE.highlight?.remove();
    STATE.tooltip?.remove();
    STATE.highlight = null;
    STATE.tooltip = null;
  }

  function clearHideTimer() {
    if (STATE.hideTimer) clearTimeout(STATE.hideTimer);
    STATE.hideTimer = null;
  }

  function onMouseMove(event) {
    if (!STATE.enabled || STATE.locked) return;
    STATE.pointer = { x: event.clientX, y: event.clientY };
    const target = event.target;
    if (!target || target === STATE.highlight) return;
    if (STATE.overTooltip || target === STATE.tooltip || STATE.tooltip?.contains(target) || isInsideTooltipBuffer(event.clientX, event.clientY)) return;
    if (!(target instanceof Element)) return;
    if (target === document.documentElement || target === document.body) return;

    const now = Date.now();
    if (now - STATE.lastMoveAt < 45) return;
    STATE.lastMoveAt = now;

    const element = chooseUsefulElement(target);
    if (!element) return;

    if (element !== STATE.currentElement) {
      clearHideTimer();
      STATE.currentElement = element;
      STATE.activeReasonIndex = 0;
      STATE.reasonPage = 0;
      STATE.selectedType = null;
      STATE.showTypePicker = false;
      STATE.showHelp = false;
      STATE.showAdvanced = false;
      STATE.lastInfo = analyzeElement(element);
      STATE.stablePanelPosition = null;
      render(element, STATE.lastInfo);
      return;
    }

    updatePosition();
  }

  function onPageClick(event) {
    if (!STATE.enabled) return;
    if (STATE.tooltip?.contains(event.target)) return;
    if (!(event.target instanceof Element)) return;

    const element = chooseUsefulElement(event.target);
    if (!element) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    const sameElement = element === STATE.currentElement;
    const currentTooltipRect = STATE.tooltip?.getBoundingClientRect?.();
    STATE.locked = true;
    STATE.stablePanelPosition = sameElement && currentTooltipRect ? { left: currentTooltipRect.left, top: currentTooltipRect.top } : null;
    STATE.currentElement = element;
    STATE.activeReasonIndex = 0;
    STATE.reasonPage = 0;
    STATE.selectedType = null;
    STATE.showTypePicker = false;
    STATE.showHelp = false;
    STATE.showAdvanced = false;
    STATE.lastInfo = analyzeElement(element);
    render(element, STATE.lastInfo);
  }

  function isInsideTooltipBuffer(x, y) {
    if (!STATE.tooltip) return false;
    const r = STATE.tooltip.getBoundingClientRect();
    const pad = 44;
    return x >= r.left - pad && x <= r.right + pad && y >= r.top - pad && y <= r.bottom + pad;
  }

  function tooHuge(rect) {
    return rect.width > window.innerWidth * 0.88 && rect.height > window.innerHeight * 0.62;
  }

  function visibleEnough(rect) {
    return rect.width >= 24 && rect.height >= 16 && rect.bottom > 0 && rect.right > 0 && rect.top < window.innerHeight && rect.left < window.innerWidth;
  }

  function chooseUsefulElement(el) {
    const composer = findChatComposerAncestor(el);
    if (composer) {
      const action = el.closest('button, [role="button"], a');
      const textBox = el.closest('textarea, input, [contenteditable="true"], [role="textbox"]');
      if (textBox || !action || !composer.contains(action)) {
        const cr = composer.getBoundingClientRect();
        if (visibleEnough(cr) && !tooHuge(cr)) return composer;
      }
    }

    const semantic = el.closest('textarea, input, select, button, [role="button"], [role="searchbox"], [role="tab"], [role="menuitem"], [role="dialog"], nav, aside, footer, header, form, table, img, a');
    if (semantic && semantic !== document.body && semantic !== document.documentElement) {
      const r = semantic.getBoundingClientRect();
      if (visibleEnough(r) && !tooHuge(r)) return semantic;
    }

    const candidates = [];
    let node = el;
    for (let i = 0; i < 8 && node && node !== document.body && node !== document.documentElement; i++, node = node.parentElement) {
      const r = node.getBoundingClientRect();
      if (!visibleEnough(r) || tooHuge(r)) continue;
      candidates.push({ node, key: detectType(node), rect: r, text: getElementText(node).short });
    }

    const strong = candidates.find(c => ['chatComposer', 'searchInput', 'accountMenu', 'menuItem', 'logo', 'button', 'input', 'card', 'modal', 'pricing'].includes(c.key));
    if (strong) return strong.node;

    const meaningful = candidates.find(c => c.key !== 'container' && c.key !== 'section');
    if (meaningful) return meaningful.node;

    const block = candidates.find(c => c.rect.width >= 80 && c.rect.height >= 28 && c.rect.width <= window.innerWidth * .82);
    return block?.node || candidates[0]?.node || el;
  }

  function analyzeElement(el) {
    const detectedKey = detectType(el);
    const remembered = findRememberedOverride(el);
    const key = STATE.selectedType || remembered?.type || detectedKey;
    STATE.matchedOverride = remembered || null;
    const isEn = STATE.lang === 'en';
    const uiData = isEn ? UI_EN : UI;
    const base = uiData[key] || uiData.container;
    const css = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    const rawClasses = (el.getAttribute('class') || '').toString().trim().split(/\s+/).filter(Boolean).slice(0, 3);
    const textInfo = getElementText(el);
    const context = getContext(el, key, isEn);
    const displayTitle = isEn ? buildDisplayTitleEn(key, textInfo) : buildDisplayTitle(key, textInfo);
    const promptBase = isEn ? buildTargetPhraseEn(key, textInfo, context) : buildTargetPhrase(key, textInfo, context);
    const editSet = getReasonSet(key, STATE.reasonPage);
    const selectedReason = editSet[STATE.activeReasonIndex] || editSet[0] || (isEn ? 'clearer' : 'rõ hơn');
    const prompt = isEn ? buildPromptEn(key, promptBase, selectedReason) : buildPrompt(key, promptBase, selectedReason);

    const facts = [
      `tag: ${el.tagName.toLowerCase()}`,
      el.getAttribute('role') ? `role: ${el.getAttribute('role')}` : '',
      textInfo.source ? `text: ${textInfo.source}` : '',
      context.short ? `${isEn ? 'location' : 'vị trí'}: ${context.short}` : '',
      `display: ${css.display}`,
      `position: ${css.position}`,
      `size: ${Math.round(rect.width)}×${Math.round(rect.height)}px`,
      ...rawClasses.map(c => `.${c}`)
    ].filter(Boolean);

    return {
      key,
      detectedKey,
      title: displayTitle,
      desc: base.desc,
      promptBase,
      prompt,
      textInfo,
      context,
      editReasons: editSet,
      selectedReason,
      facts,
      remembered,
      hasManualType: Boolean(STATE.selectedType),
      css,
      rect
    };
  }

  function detectType(el) {
    const tag = el.tagName.toLowerCase();
    const role = (el.getAttribute('role') || '').toLowerCase();
    const cls = (el.getAttribute('class') || '').toString().toLowerCase();
    const id = (el.id || '').toLowerCase();
    const hay = `${tag} ${role} ${cls} ${id}`;
    const textInfo = getElementText(el);
    const text = `${textInfo.short} ${textInfo.full}`.trim().toLowerCase();
    const css = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    const clickable = isClickable(el);
    const context = getContext(el);

    if (isChatComposerLike(el, text, hay, role, tag)) return 'chatComposer';
    if (isSearchLike(el, text, hay, role, tag)) return 'searchInput';
    if (isLogoLike(el, textInfo, hay, context, clickable, tag, role)) return 'logo';
    if (isAccountLike(el, text, hay, context, clickable)) return 'accountMenu';
    if (isMenuItemLike(el, text, hay, context, clickable, tag, role)) return 'menuItem';

    if (tag === 'nav' || role === 'navigation' || /navbar|nav-bar|topnav|main-menu/.test(hay)) return rect.width > rect.height ? 'navbar' : 'sidebar';
    if (tag === 'aside' || /sidebar|side-nav|sidenav|drawer/.test(hay)) return 'sidebar';
    if (tag === 'footer' || /footer/.test(hay)) return 'footer';
    if (tag === 'header' || /header|topbar|appbar/.test(hay)) return 'navbar';
    if (tag === 'button' || role === 'button' || /btn|button|cta/.test(hay)) return 'button';
    if (tag === 'a' || role === 'link') return 'link';
    if (['input', 'textarea', 'select'].includes(tag) || /input|field/.test(hay)) return 'input';
    if (tag === 'form' || /form/.test(hay)) return 'form';
    if (role === 'dialog' || /modal|dialog|popup|overlay/.test(hay)) return 'modal';
    if (tag === 'table' || role === 'table' || /table|data-grid/.test(hay)) return 'table';
    if (tag === 'img' || /image|avatar|thumbnail|cover/.test(hay)) return 'image';
    if (isPricingLike(el, textInfo, hay)) return 'pricing';
    if (/hero|headline|above-fold|intro/.test(hay)) return 'hero';
    if (/card|tile|panel|widget|box/.test(hay)) return 'card';
    if (tag === 'ul' || tag === 'ol' || role === 'list') return 'list';
    if (/^(p|h1|h2|h3|h4|h5|h6|label|span|strong|em|small)$/.test(tag) && text.length > 0) {
      return textInfo.short && textInfo.short.length <= 55 ? 'textLabel' : 'text';
    }
    if (tag === 'section' || tag === 'article' || /section|content/.test(hay)) return 'section';
    if (css.position === 'fixed' && rect.width > window.innerWidth * 0.55 && rect.height < 150) return rect.top > window.innerHeight * 0.55 ? 'chatComposer' : 'navbar';
    if ((css.display.includes('grid') || css.display.includes('flex')) && rect.width > 160 && rect.height > 80) return 'section';
    return 'container';
  }

  function isClickable(el) {
    const tag = el.tagName.toLowerCase();
    const role = (el.getAttribute('role') || '').toLowerCase();
    const tabindex = el.getAttribute('tabindex');
    return tag === 'button' || tag === 'a' || role === 'button' || role === 'menuitem' || role === 'tab' || tabindex === '0' || Boolean(el.onclick);
  }

  function isSearchLike(el, text, hay, role, tag) {
    const type = (el.getAttribute('type') || '').toLowerCase();
    const placeholder = (el.getAttribute('placeholder') || '').toLowerCase();
    const aria = (el.getAttribute('aria-label') || '').toLowerCase();
    const label = `${hay} ${placeholder} ${aria}`.toLowerCase();
    const shortText = cleanText(text || '').toLowerCase();
    if (type === 'search' || role === 'searchbox' || tag === 'search') return true;
    if (/\bsearch\b|\bfind\b|tìm kiếm|tim kiem/.test(label)) return true;
    // Chỉ dùng text visible nếu nó là nhãn/placeholder ngắn kiểu “Tìm kiếm…”.
    if (shortText.length <= 48 && /^(tìm kiếm|tim kiem|search|find)\b/.test(shortText)) return true;
    return false;
  }

  function findChatComposerAncestor(el) {
    let node = el;
    for (let i = 0; i < 7 && node && node !== document.body && node !== document.documentElement; i++, node = node.parentElement) {
      if (isChatComposerLike(node)) return node;
    }
    return null;
  }

  function isChatComposerLike(el, text = '', hay = '', role = '', tag = '') {
    if (!(el instanceof Element)) return false;
    tag = tag || el.tagName.toLowerCase();
    role = role || (el.getAttribute('role') || '').toLowerCase();
    hay = hay || `${tag} ${role} ${(el.getAttribute('class') || '')} ${el.id || ''}`.toLowerCase();
    const rect = el.getBoundingClientRect();
    const nearBottom = rect.top > window.innerHeight * 0.5;
    const hasTextBox = Boolean(el.matches?.('textarea, input, [contenteditable="true"], [role="textbox"]') || el.querySelector?.('textarea, input[type="text"], input:not([type]), [contenteditable="true"], [role="textbox"]'));
    const hasButton = Boolean(el.querySelector?.('button, [role="button"], input[type="submit"]'));
    const ownPlaceholder = el.getAttribute('placeholder') || el.getAttribute('aria-placeholder') || el.getAttribute('data-placeholder') || '';
    const childPlaceholderEl = el.querySelector?.('textarea[placeholder], input[placeholder], [role="textbox"][aria-placeholder], [contenteditable="true"][data-placeholder]');
    const childPlaceholder = childPlaceholderEl ? (childPlaceholderEl.getAttribute('placeholder') || childPlaceholderEl.getAttribute('aria-placeholder') || childPlaceholderEl.getAttribute('data-placeholder') || '') : '';
    const labels = Array.from(el.querySelectorAll?.('[aria-label], [title]') || []).slice(0, 8).map(x => `${x.getAttribute('aria-label') || ''} ${x.getAttribute('title') || ''}`).join(' ');
    const combined = `${text} ${hay} ${ownPlaceholder} ${childPlaceholder} ${labels}`.toLowerCase();
    const chatWords = /hỏi bất kỳ|hoi bat ky|ask anything|ask me|message|tin nhắn|tin nhan|câu hỏi|cau hoi|prompt|nhập tin|nhap tin|gửi tin|gui tin|send message|send prompt|trò chuyện|tro chuyen/.test(combined);
    const actionWords = /send|gửi|gui|đính kèm|dinh kem|attach|microphone|voice|arrow-up|submit/.test(combined);
    if (!hasTextBox) return false;
    if (chatWords && (nearBottom || hasButton)) return true;
    if (nearBottom && hasButton && actionWords) return true;
    if (tag === 'form' && nearBottom && hasButton && hasTextBox) return true;
    return false;
  }


  function isLogoLike(el, textInfo, hay, context, clickable, tag, role) {
    const text = cleanText(textInfo?.full || textInfo?.short || '');
    const rect = el.getBoundingClientRect();
    const shortBrand = text && text.length <= 32 && text.split(/\s+/).length <= 4;
    const brandClass = /logo|brand|mark|wordmark/.test(hay);
    const knownBrand = /^(chatgpt|claude|cursor|figma|notion|vibecode|mara|bolt|lovable|replit)$/i.test(text);
    const topLeft = rect.left < window.innerWidth * 0.22 && rect.top < window.innerHeight * 0.24;
    const inNavishArea = context.inNavbar || context.inSidebar || topLeft;
    if (brandClass && shortBrand) return true;
    if (knownBrand && inNavishArea) return true;
    if (shortBrand && topLeft && clickable && !/button|btn|menuitem|tab/.test(hay) && tag !== 'button' && role !== 'button') return true;
    return false;
  }

  function isPricingLike(el, textInfo, hay) {
    const text = cleanText(textInfo?.full || textInfo?.short || '').toLowerCase();
    if (/pricing|price-card|pricecard|billing|plan-card|pricing-table/.test(hay)) return true;
    // Chỉ bắt chữ “bảng giá/pricing” nếu đây là nhãn ngắn, không phải cả đoạn nội dung dài có nhắc tới giá/gói.
    if (text.length <= 80 && /(bảng giá|bang gia|pricing|gói giá|goi gia)/.test(text)) return true;
    const hasMoney = /\$|₫|vnđ|vnd|k\/tháng|\/tháng|\/năm|month|year/.test(text);
    const hasPlanWords = /free|pro|plus|premium|basic|starter|gói|goi|plan/.test(text);
    const looksLikePricingBlock = el.querySelectorAll?.('button, a').length >= 2 && el.querySelectorAll?.('li, [class*="feature"], [class*="price"]').length >= 2;
    return Boolean(hasMoney && hasPlanWords && looksLikePricingBlock);
  }

  function isAccountLike(el, text, hay, context, clickable) {
    if (!clickable && !/avatar|profile|account|user/.test(hay)) return false;
    const hasPlanWord = /\b(plus|pro|free|team|basic|premium|trial)\b|gói|goi|tài khoản|tai khoan|account|profile|avatar|user/.test(`${text} ${hay}`);
    const hasAvatarSignal = /avatar|profile|account|user|member|plan|subscription/.test(hay);
    return Boolean((hasPlanWord || hasAvatarSignal) && (context.inSidebar || context.nearBottom));
  }

  function isMenuItemLike(el, text, hay, context, clickable, tag, role) {
    if (!context.inSidebar && !context.inNavbar) return false;
    if (!clickable && tag !== 'a' && role !== 'menuitem') return false;
    if (!text || text.length > 60) return false;
    if (/plus|pro|free|team|account|profile|avatar|tài khoản|tai khoan/.test(`${text} ${hay}`)) return false;
    return true;
  }

  function getElementText(el) {
    const tag = el.tagName.toLowerCase();
    const isTextField = ['input', 'textarea', 'select'].includes(tag) || (el.getAttribute('role') || '').toLowerCase() === 'textbox' || el.getAttribute('contenteditable') === 'true';
    const attrs = isTextField ? [
      ['placeholder', el.getAttribute('placeholder') || el.getAttribute('aria-placeholder') || el.getAttribute('data-placeholder')],
      ['value', el.value],
      ['aria-label', el.getAttribute('aria-label')],
      ['title', el.getAttribute('title')],
      ['alt', el.getAttribute('alt')]
    ] : [
      ['aria-label', el.getAttribute('aria-label')],
      ['title', el.getAttribute('title')],
      ['placeholder', el.getAttribute('placeholder')],
      ['alt', el.getAttribute('alt')]
    ];

    // Với element có chữ hiện rõ, ưu tiên chữ người dùng đang thấy.
    // Điều này tránh case logo/link có aria-label chung chung như “Trang chủ”
    // nhưng chữ thực tế trên UI là “ChatGPT”, “MARA labs”, “VibeCode”…
    if (!isTextField) {
      const directVisible = cleanText(Array.from(el.childNodes)
        .filter(node => node.nodeType === Node.TEXT_NODE)
        .map(node => node.textContent || '')
        .join(' '));
      const innerVisible = (() => {
        if (el.querySelector) {
          const clone = el.cloneNode(true);
          clone.querySelectorAll('button,[role="button"],select,svg,[contenteditable]').forEach(function(e){e.remove();});
          return cleanText(clone.textContent || '');
        }
        return cleanText(el.innerText || el.textContent || '');
      })();
      const visible = directVisible || (innerVisible.length <= 80 ? innerVisible : '');
      if (visible) return buildTextInfo(visible, 'text');
    }

    for (const [source, value] of attrs) {
      const cleaned = cleanText(value || '');
      if (cleaned) return buildTextInfo(cleaned, source);
    }

    const placeholderChild = el.querySelector?.('textarea[placeholder], input[placeholder], [role="textbox"][aria-placeholder], [contenteditable="true"][data-placeholder]');
    if (placeholderChild) {
      const childPlaceholder = placeholderChild.getAttribute('placeholder') || placeholderChild.getAttribute('aria-placeholder') || placeholderChild.getAttribute('data-placeholder') || '';
      const cleaned = cleanText(childPlaceholder);
      if (cleaned) return buildTextInfo(cleaned, 'placeholder');
    }

    const direct = cleanText(Array.from(el.childNodes)
      .filter(node => node.nodeType === Node.TEXT_NODE)
      .map(node => node.textContent || '')
      .join(' '));
    if (direct) return buildTextInfo(direct, 'text');

    const ariaChild = el.querySelector?.('[aria-label], [title], [placeholder], img[alt]');
    if (ariaChild) {
      const childValue = ariaChild.getAttribute('aria-label') || ariaChild.getAttribute('title') || ariaChild.getAttribute('placeholder') || ariaChild.getAttribute('alt') || '';
      const cleaned = cleanText(childValue);
      if (cleaned) return buildTextInfo(cleaned, 'label con');
    }

    const inner = cleanText(el.innerText || el.textContent || '');
    if (inner) return buildTextInfo(inner, 'text');

    return { full: '', short: '', source: '', kind: 'none', isLong: false };
  }

  function cleanText(value) {
    return String(value || '')
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      .replace(/[\u{1F000}-\u{1FFFF}]/gu, '')
      .replace(/[\u2300-\u2BFF\uFE0F]/g, '')
      .replace(/[\uE000-\uF8FF]/g, '')
      .replace(/\s+/g, ' ')
      .replace(/^[\u2022\u00B7\-\u2013\u2014]+\s*/, '')
      .trim();
  }

  function removeLikelyAvatarInitials(text) {
    const parts = text.split(' ').filter(Boolean);
    if (parts.length >= 3 && /^[A-ZĐ]{1,3}$/.test(parts[0]) && /[a-zA-ZÀ-ỹ]/.test(parts.slice(1).join(' '))) {
      return parts.slice(1).join(' ');
    }
    return text;
  }

  function buildTextInfo(text, source) {
    let cleaned = removeLikelyAvatarInitials(cleanText(text));
    const isLong = cleaned.length > 90 || cleaned.split(' ').length > 13;
    const isMedium = cleaned.length > 55 && !isLong;
    let short = cleaned;
    if (isLong) short = `${cleaned.slice(0, 72).trim()}…`;
    if (isMedium) short = `${cleaned.slice(0, 55).trim()}…`;
    return {
      full: cleaned,
      short,
      source,
      kind: isLong ? 'long' : isMedium ? 'medium' : 'short',
      isLong
    };
  }

  function getContext(el, key = '', isEn = false) {
    const rect = el.getBoundingClientRect();
    if (key === 'chatComposer' || isChatComposerLike(el)) {
      return { inSidebar: false, inNavbar: false, inChatComposer: true, nearBottom: true, nearTop: false, short: isEn ? 'at the bottom of the screen' : 'ở dưới cùng màn hình' };
    }
    const sidebar = findSidebarAncestor(el);
    const navbar = el.closest('nav, header, [role="navigation"], [class*="navbar"], [class*="topbar"], [class*="header"], [class*="appbar"]');
    const nearBottom = rect.top > window.innerHeight * 0.62;
    const nearTop = rect.bottom < window.innerHeight * 0.22;
    let short = '';

    if (sidebar) {
      const sr = sidebar.getBoundingClientRect();
      const side = isEn ? (sr.left < window.innerWidth * 0.33 ? 'left' : sr.right > window.innerWidth * 0.66 ? 'right' : '') : (sr.left < window.innerWidth * 0.33 ? 'bên trái' : sr.right > window.innerWidth * 0.66 ? 'bên phải' : '');
      const atBottom = rect.top > sr.top + sr.height * 0.65;
      short = isEn ? (atBottom ? `at the bottom of the ${side} sidebar`.trim() : `in the ${side} sidebar`.trim()) : (atBottom ? `ở cuối sidebar ${side}`.trim() : `trong sidebar ${side}`.trim());
      return { inSidebar: true, inNavbar: false, nearBottom: atBottom || nearBottom, nearTop, short };
    }

    if (navbar && nearTop) {
      short = isEn ? 'in the top bar' : 'trong thanh trên cùng';
      return { inSidebar: false, inNavbar: true, nearBottom, nearTop, short };
    }

    if (nearTop) short = isEn ? 'near the top of the page' : 'ở gần đầu trang';
    else if (nearBottom) short = isEn ? 'near the bottom of the screen' : 'ở gần cuối màn hình';
    return { inSidebar: false, inNavbar: false, nearBottom, nearTop, short };
  }

  function findSidebarAncestor(el) {
    let node = el;
    for (let i = 0; i < 8 && node && node !== document.body && node !== document.documentElement; i++, node = node.parentElement) {
      const tag = node.tagName.toLowerCase();
      const role = (node.getAttribute('role') || '').toLowerCase();
      const hay = `${tag} ${role} ${(node.getAttribute('class') || '')} ${node.id || ''}`.toLowerCase();
      const r = node.getBoundingClientRect();
      const onSide = r.left < window.innerWidth * 0.28 || r.right > window.innerWidth * 0.72;
      const tallSide = r.width > 90 && r.width < window.innerWidth * 0.34 && r.height > window.innerHeight * 0.38 && onSide;
      const explicitSide = tag === 'aside' || /sidebar|side-nav|sidenav|drawer|conversation-list|nav-list|sidepanel/.test(hay);
      const navSide = role === 'navigation' && tallSide;
      const linkCount = node.querySelectorAll?.('a, button, [role="button"], [role="menuitem"]').length || 0;
      const navListSide = tallSide && linkCount >= 4 && /nav|menu|list|conversation|sidebar|side/.test(hay);
      // Không gọi mọi cột trái là sidebar. Phải có tín hiệu navigation/menu rõ.
      if (explicitSide || navSide || navListSide) return node;
    }
    return null;
  }

  function getDisplayContent(textInfo) {
    if (!textInfo.short || textInfo.kind === 'long') return '';
    let content = textInfo.full || textInfo.short;
    const parts = content.split(/[,;|•]/).map(p => cleanText(p)).filter(Boolean);
    if (parts.length > 1 && parts[0].length <= 42 && /mở|mo |open|opens|toggle|menu|hồ sơ|profile|settings|cài đặt/i.test(parts.slice(1).join(' '))) {
      content = parts[0];
    }
    if (content.length > 50) content = `${content.slice(0, 47).trim()}…`;
    return content;
  }

  function buildDisplayTitle(key, textInfo) {
    const label = UI[key]?.label || UI.container.label;
    const content = getDisplayContent(textInfo);
    if (!content || (key === 'text' && textInfo.kind !== 'short')) return label;
    return `${label} — “${content}”`;
  }

  function buildTargetPhrase(key, textInfo, context) {
    const label = (UI[key]?.label || UI.container.label).toLowerCase();
    const content = getDisplayContent(textInfo);
    const contentPart = content && !(key === 'text' && textInfo.kind !== 'short') ? ` “${content}”` : '';
    const ctx = context.short ? ` ${context.short}` : '';
    return `${label}${contentPart}${ctx}`.replace(/\s+/g, ' ').trim();
  }

  function getReasonSet(key, page = 0) {
    const bank = STATE.lang === 'en' ? REASONS_EN : REASONS;
    const set = bank[key] || bank.container;
    return page % 2 === 0 ? set.primary : set.alt;
  }

  function buildPrompt(key, targetPhrase, reason) {
    const r = String(reason || 'rõ hơn').trim();
    if (/đổi chữ|đổi placeholder|đổi headline|đổi nhãn|đổi tiêu đề/.test(r)) {
      return `Cần đổi chữ của ${targetPhrase} thành: [...]`;
    }
    if (/đổi style/.test(r)) {
      return `Cần đổi style của ${targetPhrase} theo hướng: [...]`;
    }
    if (/đổi ảnh/.test(r)) {
      return `Cần đổi ảnh trong ${targetPhrase} thành: [...]`;
    }
    if (/đổi kích thước|đúng kích thước|kích thước/.test(r)) {
      return `Cần chỉnh kích thước của ${targetPhrase} cho cân đối hơn.`;
    }
    if (/dễ nhận ra/.test(r)) {
      return `Cần làm ${targetPhrase} dễ nhận ra hơn như logo/thương hiệu chính.`;
    }
    if (/to\/nhỏ lại/.test(r)) {
      return `Cần chỉnh kích thước của ${targetPhrase} cho hợp lý hơn.`;
    }
    if (/rõ menu hơn/.test(r)) return `Cần làm menu trong ${targetPhrase} rõ hơn và dễ quét mắt hơn.`;
    if (/rõ mục đang chọn|active rõ hơn/.test(r)) return `Cần làm trạng thái đang chọn trong ${targetPhrase} rõ hơn.`;
    if (/nổi nút chính|nổi CTA|rõ nút mua|nổi nút gửi/.test(r)) return `Cần làm nút chính trong ${targetPhrase} nổi bật hơn.`;
    if (/căn icon/.test(r)) return `Cần căn lại icon trong ${targetPhrase} cho thẳng hàng và gọn hơn.`;
    if (/căn lại|căn/.test(r)) return `Cần căn lại ${targetPhrase} cho thẳng hàng và cân đối hơn.`;
    if (/gọn/.test(r)) return `Cần làm gọn hơn ${targetPhrase}.`;
    if (/thoáng/.test(r)) return `Cần làm thoáng hơn ${targetPhrase}.`;
    if (/nổi/.test(r)) return `Cần làm nổi bật hơn ${targetPhrase}.`;
    if (/dễ đọc/.test(r)) return `Cần làm ${targetPhrase} dễ đọc hơn.`;
    if (/dễ nhập/.test(r)) return `Cần làm ${targetPhrase} dễ nhập và dễ thao tác hơn.`;
    if (/bớt rối|đỡ rối|giảm rối/.test(r)) return `Cần giảm độ rối của ${targetPhrase}.`;
    if (/đồng bộ/.test(r)) return `Cần làm ${targetPhrase} đồng bộ hơn với style chung.`;
    if (/ngắn hơn|ít chữ|giảm chữ/.test(r)) return `Cần viết ngắn hơn phần nội dung trong ${targetPhrase}.`;
    if (/rõ/.test(r)) return `Cần chỉnh rõ hơn ${targetPhrase}.`;
    return `Cần chỉnh ${targetPhrase} cho ${r}.`;
  }

  function buildDisplayTitleEn(key, textInfo) {
    const label = UI_EN[key]?.label || 'Container';
    const content = getDisplayContent(textInfo);
    if (!content || (key === 'text' && textInfo.kind !== 'short')) return label;
    return `${label} — "${content}"`;
  }

  function buildTargetPhraseEn(key, textInfo, context) {
    const label = (UI_EN[key]?.label || 'container').toLowerCase();
    const content = getDisplayContent(textInfo);
    const contentPart = content && !(key === 'text' && textInfo.kind !== 'short') ? ` "${content}"` : '';
    let ctx = '';
    if (context.inChatComposer) ctx = ' at the bottom of the screen';
    else if (context.inSidebar) ctx = ' in the sidebar';
    else if (context.inNavbar) ctx = ' in the top bar';
    else if (context.nearTop) ctx = ' near the top';
    else if (context.nearBottom) ctx = ' near the bottom';
    return `${label}${contentPart}${ctx}`.replace(/\s+/g, ' ').trim();
  }

  function buildPromptEn(key, targetPhrase, reason) {
    const r = String(reason || 'clearer').trim();
    if (/change label|change text|change placeholder|change headline/.test(r)) return `Change the text of the ${targetPhrase} to: [...]`;
    if (/restyle/.test(r)) return `Restyle the ${targetPhrase} to match: [...]`;
    if (/change image/.test(r)) return `Replace the image in ${targetPhrase} with: [...]`;
    if (/correct ratio|resize/.test(r)) return `Adjust the size of ${targetPhrase} to be more proportional.`;
    if (/more recognizable/.test(r)) return `Make the ${targetPhrase} more recognizable as the main brand/logo.`;
    if (/highlight CTA|highlight main button|highlight send button/.test(r)) return `Make the primary button in ${targetPhrase} more prominent.`;
    if (/align icon/.test(r)) return `Fix the icon alignment inside ${targetPhrase}.`;
    if (/realign|reorder/.test(r)) return `Realign ${targetPhrase} for better balance and consistency.`;
    if (/cleaner/.test(r)) return `Make ${targetPhrase} cleaner.`;
    if (/more spacious/.test(r)) return `Make ${targetPhrase} more spacious.`;
    if (/more prominent/.test(r)) return `Make ${targetPhrase} more prominent.`;
    if (/more readable/.test(r)) return `Make ${targetPhrase} easier to read.`;
    if (/easier to type|easier to fill/.test(r)) return `Make ${targetPhrase} easier to interact with.`;
    if (/less clutter|less cluttered/.test(r)) return `Reduce visual clutter in ${targetPhrase}.`;
    if (/consistent style|more consistent/.test(r)) return `Make ${targetPhrase} visually consistent with the rest of the UI.`;
    if (/shorter|less text/.test(r)) return `Shorten the content in ${targetPhrase}.`;
    if (/clearer/.test(r)) return `Make ${targetPhrase} clearer.`;
    return `Adjust ${targetPhrase} to be ${r}.`;
  }

  function getPageKey() {
    return `${location.origin}${location.pathname}`;
  }

  function loadOverrides() {
    try {
      chrome.storage?.local?.get(OVERRIDE_STORAGE_KEY, (result = {}) => {
        STATE.overrides = result[OVERRIDE_STORAGE_KEY] || {};
      });
    } catch (_) {
      STATE.overrides = {};
    }
  }

  function loadLang() {
    try {
      chrome.storage?.local?.get('vibecodeLensLang', (result = {}) => {
        if (result.vibecodeLensLang === 'en' || result.vibecodeLensLang === 'vi') STATE.lang = result.vibecodeLensLang;
      });
    } catch (_) {}
  }

  function saveLang() {
    try { chrome.storage?.local?.set({ vibecodeLensLang: STATE.lang }); } catch (_) {}
  }

  function saveOverrides() {
    try {
      chrome.storage?.local?.set({ [OVERRIDE_STORAGE_KEY]: STATE.overrides });
    } catch (_) {}
  }

  function normalizeToken(value) {
    return cleanText(value || '').toLowerCase();
  }

  function stableClassTokens(el) {
    const raw = (el.getAttribute('class') || '').toString().split(/\s+/).filter(Boolean);
    return raw
      .map(t => t.trim())
      .filter(t => t.length >= 2 && t.length <= 32)
      .filter(t => !/^[a-z0-9_-]{10,}$/i.test(t) || /nav|side|menu|search|chat|input|button|btn|card|logo|brand|price|user|account|profile|prompt|hero|footer|header|composer/i.test(t))
      .slice(0, 8);
  }

  function rectZone(el) {
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const x = cx < window.innerWidth * .33 ? 'left' : cx > window.innerWidth * .66 ? 'right' : 'center';
    const y = cy < window.innerHeight * .33 ? 'top' : cy > window.innerHeight * .66 ? 'bottom' : 'middle';
    return `${x}-${y}`;
  }

  function meaningfulId(id) {
    id = cleanText(id || '');
    if (!id || id.length > 64) return '';
    if (/^[a-z0-9_-]{16,}$/i.test(id) && !/nav|side|menu|search|chat|input|button|card|logo|brand|price|user|account|profile|prompt|hero|footer|header|composer/i.test(id)) return '';
    return id;
  }

  function getPlaceholderLike(el) {
    const direct = el.getAttribute('placeholder') || el.getAttribute('aria-placeholder') || el.getAttribute('data-placeholder') || '';
    if (cleanText(direct)) return cleanText(direct);
    const child = el.querySelector?.('textarea[placeholder], input[placeholder], [role="textbox"][aria-placeholder], [contenteditable="true"][data-placeholder]');
    return child ? cleanText(child.getAttribute('placeholder') || child.getAttribute('aria-placeholder') || child.getAttribute('data-placeholder') || '') : '';
  }

  function buildFingerprint(el) {
    const textInfo = getElementText(el);
    const context = getContext(el);
    return {
      tag: el.tagName.toLowerCase(),
      role: normalizeToken(el.getAttribute('role') || ''),
      id: normalizeToken(meaningfulId(el.id || '')),
      text: normalizeToken(getDisplayContent(textInfo)),
      placeholder: normalizeToken(getPlaceholderLike(el)),
      aria: normalizeToken(el.getAttribute('aria-label') || el.getAttribute('title') || ''),
      classes: stableClassTokens(el).map(normalizeToken).filter(Boolean),
      context: normalizeToken(context.short || ''),
      zone: rectZone(el)
    };
  }

  function fingerprintHasSignal(fp) {
    return Boolean(fp.id || fp.text || fp.placeholder || fp.aria || (fp.classes && fp.classes.length >= 1));
  }

  function scoreFingerprint(saved, current) {
    if (!fingerprintHasSignal(saved.fp || saved) || !fingerprintHasSignal(current)) return 0;
    const fp = saved.fp || saved;
    let score = 0;
    if (fp.id && current.id && fp.id === current.id) score += 5;
    if (fp.placeholder && current.placeholder && fp.placeholder === current.placeholder) score += 6;
    if (fp.text && current.text && fp.text === current.text) score += 6;
    else if (fp.text && current.text && (fp.text.includes(current.text) || current.text.includes(fp.text))) score += 3;
    if (fp.aria && current.aria && fp.aria === current.aria) score += 4;
    if (fp.tag && current.tag && fp.tag === current.tag) score += 1;
    if (fp.role && current.role && fp.role === current.role) score += 1;
    if (fp.context && current.context && fp.context === current.context) score += 2;
    if (fp.zone && current.zone && fp.zone === current.zone) score += 1;
    const savedClasses = new Set(fp.classes || []);
    for (const c of current.classes || []) if (savedClasses.has(c)) score += 1;
    return score;
  }

  function findRememberedOverride(el) {
    const pageItems = STATE.overrides[getPageKey()] || [];
    if (!pageItems.length) return null;
    const fp = buildFingerprint(el);
    let best = null;
    let bestScore = 0;
    for (const item of pageItems) {
      const score = scoreFingerprint(item, fp);
      if (score > bestScore) { best = item; bestScore = score; }
    }
    return best && bestScore >= 5 ? { ...best, score: bestScore } : null;
  }

  function rememberCurrentElement(type) {
    if (!STATE.currentElement || !type) return false;
    const pageKey = getPageKey();
    const fp = buildFingerprint(STATE.currentElement);
    if (!fingerprintHasSignal(fp)) return false;
    const list = Array.isArray(STATE.overrides[pageKey]) ? [...STATE.overrides[pageKey]] : [];
    const existing = findRememberedOverride(STATE.currentElement);
    const id = existing?.id || `vc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const next = { id, type, fp, savedAt: Date.now() };
    const filtered = list.filter(item => item.id !== id && scoreFingerprint(item, fp) < 7);
    filtered.push(next);
    STATE.overrides[pageKey] = filtered.slice(-60);
    saveOverrides();
    STATE.matchedOverride = next;
    return true;
  }

  function forgetCurrentElement() {
    if (!STATE.currentElement) return false;
    const pageKey = getPageKey();
    const list = Array.isArray(STATE.overrides[pageKey]) ? [...STATE.overrides[pageKey]] : [];
    const match = findRememberedOverride(STATE.currentElement);
    if (!match) return false;
    STATE.overrides[pageKey] = list.filter(item => item.id !== match.id);
    saveOverrides();
    STATE.matchedOverride = null;
    return true;
  }

  function clearPageMemory() {
    const pageKey = getPageKey();
    delete STATE.overrides[pageKey];
    saveOverrides();
    STATE.matchedOverride = null;
  }

  function svgIcon(name) {
    const icons = {
      close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17"/></svg>',
      settings: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/><circle cx="9" cy="6" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="9" cy="18" r="2"/></svg>',
      random: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7h7a4 4 0 0 1 4 4v.5"/><path d="M16 9l2-2 2 2"/><path d="M17 17h-7a4 4 0 0 1-4-4v-.5"/><path d="M8 15l-2 2-2-2"/></svg>',
      lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6.5" y="10" width="11" height="9" rx="2"/><path d="M9 10V7.8a3 3 0 0 1 6 0V10"/></svg>',
      unlock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6.5" y="10" width="11" height="9" rx="2"/><path d="M9 10V7.8a3 3 0 0 1 5.3-1.9"/></svg>'
    };
    return icons[name] || '';
  }

  function buildTechPrompt(value, info) {
    const clean = cleanText(value || '');
    if (!clean) return STATE.currentPrompt || info.prompt;
    const target = info.promptBase || (STATE.lang === 'en' ? 'selected zone' : 'vùng đang chọn');
    if (STATE.lang === 'en') {
      if (/^tag:/.test(clean)) return `Check the HTML element type of ${target} (${clean}).`;
      if (/^role:/.test(clean)) return `Check the accessibility role of ${target} (${clean}).`;
      if (/^display:/.test(clean)) return `Review the layout display of ${target} (${clean}).`;
      if (/^position:/.test(clean)) return `Check the positioning of ${target} (${clean}).`;
      if (/^size:/.test(clean)) return `Check the dimensions of ${target} (${clean}).`;
      if (/^vị trí:|^location:/.test(clean)) return `Adjust ${target}, note context: ${clean.replace(/^vị trí:\s*|^location:\s*/,'')}.`;
      if (/^text:/.test(clean)) return `Adjust the text content of ${target}.`;
      if (/^\./.test(clean)) return `Adjust ${target}, find by class ${clean}.`;
      return `Adjust ${target}, note: ${clean}.`;
    }
    if (/^tag:/.test(clean)) return `Cần kiểm tra đúng thành phần HTML của ${target} (${clean}).`;
    if (/^role:/.test(clean)) return `Cần kiểm tra vai trò truy cập của ${target} (${clean}).`;
    if (/^display:/.test(clean)) return `Cần xem lại cách dàn layout của ${target} (${clean}).`;
    if (/^position:/.test(clean)) return `Cần kiểm tra vị trí hiển thị của ${target} (${clean}).`;
    if (/^size:/.test(clean)) return `Cần kiểm tra kích thước của ${target} (${clean}).`;
    if (/^vị trí:/.test(clean)) return `Cần chỉnh ${target}, lưu ý ${clean.replace(/^vị trí:\s*/,'')}.`;
    if (/^text:/.test(clean)) return `Cần chỉnh nội dung chữ của ${target}.`;
    if (/^\./.test(clean)) return `Cần chỉnh ${target}, có thể tìm theo class ${clean}.`;
    return `Cần chỉnh ${target}, lưu ý ${clean}.`;
  }


  function buildMemoryHtml(info) {
    const t = T[STATE.lang];
    const remembered = info.remembered;
    const canOfferRemember = STATE.selectedType && !remembered;
    const notice = STATE.memoryNotice && Date.now() < STATE.memoryNotice.until ? STATE.memoryNotice.label : '';
    if (notice) return `<div class="vc-memory vc-remembered vc-memory-notice"><span>${escapeHtml(notice)}</span></div>`;
    if (canOfferRemember) return `<div class="vc-memory"><span>${escapeHtml(t.rememberQ)}</span><button class="vc-memory-action" data-action="remember-type">${escapeHtml(t.rememberBtn)}</button></div>`;
    return '';
  }

  function render(el, info) {
    const t = T[STATE.lang];
    const reasons = info.editReasons || [];
    const prompt = info.prompt;
    STATE.currentPrompt = prompt;
    const memoryHtml = buildMemoryHtml(info);
    const uiData = STATE.lang === 'en' ? UI_EN : UI;

    STATE.tooltip.classList.toggle('vc-panel-locked', STATE.locked);
    STATE.tooltip.innerHTML = `
      <div class="vc-top">
        <div>
          <div class="vc-kicker">VIBECODE LENS</div>
          <div class="vc-title">${escapeHtml(info.title)}</div>
        </div>
        <div class="vc-actions">
          <button class="vc-icon vc-lock ${STATE.locked ? 'vc-is-locked' : ''}" data-action="toggle-lock" title="${STATE.locked ? escapeHtml(t.unlockTitle) : escapeHtml(t.lockTitle)}">${svgIcon(STATE.locked ? 'lock' : 'unlock')}</button>
          <button class="vc-icon ${STATE.showHelp ? 'vc-is-active' : ''}" data-action="help" title="${escapeHtml(t.settingsTitle)}">${svgIcon('settings')}</button>
          <button class="vc-close" data-action="close" title="${escapeHtml(t.closeTitle)}">${svgIcon('close')}</button>
        </div>
      </div>
      <p class="vc-desc">${escapeHtml(info.desc)}</p>
      <div class="vc-ai-box">
        <div class="vc-label">${escapeHtml(t.promptLabel)}</div>
        <textarea class="vc-ai-sentence" data-role="prompt" rows="2">${escapeHtml(prompt)}</textarea>
      </div>
      <div class="vc-mini-section">
        <div class="vc-label-row">
          <div class="vc-label">${escapeHtml(t.chipsLabel)}</div>
          <button class="vc-random" data-action="cycle-reasons" title="${escapeHtml(t.cycleTitle)}">${svgIcon('random')}</button>
        </div>
        <div class="vc-tags">${reasons.map((tag, idx) => `<button class="vc-tag ${idx === STATE.activeReasonIndex ? 'vc-active' : ''}" data-action="reason" data-index="${idx}">${escapeHtml(tag)}</button>`).join('')}</div>
      </div>
      <button class="vc-copy" data-action="copy">${escapeHtml(t.copyBtn)}</button>
      <div class="vc-links">
        <button class="vc-link" data-action="toggle-types">${escapeHtml(t.wrongType)}</button>
        <button class="vc-link" data-action="toggle-advanced">${escapeHtml(t.viewTech)}</button>
      </div>
      <div class="vc-type-picker ${STATE.showTypePicker ? 'vc-open' : ''}">
        ${TYPE_CHOICES.map(k => `<button class="vc-type ${k === info.key ? 'vc-selected' : ''}" data-action="choose-type" data-type="${k}">${escapeHtml(uiData[k]?.label || k)}</button>`).join('')}
      </div>
      ${memoryHtml}
      <div class="vc-advanced ${STATE.showHelp ? 'vc-open' : ''}" data-panel="help">
        <div class="vc-help-grid">
          <div><b>Alt+Shift+L</b><span>${escapeHtml(t.shortcutToggle)}</span></div>
          <div><b>Esc</b><span>${escapeHtml(t.shortcutClose)}</span></div>
          <div><b>Click</b><span>${escapeHtml(t.shortcutLock)}</span></div>
          <div><b>C</b><span>${escapeHtml(t.shortcutCopy)}</span></div>
        </div>
        <div class="vc-lang-row">
          <span class="vc-label">${escapeHtml(t.langLabel)}</span>
          <div class="vc-lang-btns">
            <button class="vc-lang-btn ${STATE.lang === 'vi' ? 'vc-active' : ''}" data-action="lang-switch" data-lang="vi">Tiếng Việt</button>
            <button class="vc-lang-btn ${STATE.lang === 'en' ? 'vc-active' : ''}" data-action="lang-switch" data-lang="en">English</button>
          </div>
        </div>
        <div class="vc-made">v${VERSION} · ${escapeHtml(t.madeBy)} <a href="${MARA_URL}" target="_blank" rel="noreferrer">MARA LABS</a> · <a href="${VIBECODE_URL}" target="_blank" rel="noreferrer">VibeCode</a></div>
        ${info.remembered ? `<button class="vc-clear-memory" data-action="forget-type">${escapeHtml(t.forgetBtn)}</button>` : ''}
        <button class="vc-clear-memory" data-action="clear-page-memory">${escapeHtml(t.clearMemBtn)}</button>
      </div>
      <div class="vc-advanced ${STATE.showAdvanced ? 'vc-open' : ''}" data-panel="tech">
        <div class="vc-label">${escapeHtml(t.techLabel)}</div>
        <div class="vc-tags">${info.facts.slice(0, 10).map(f => `<button class="vc-tech-tag" data-action="tech-keyword" data-value="${escapeHtml(f)}">${escapeHtml(f)}</button>`).join('')}</div>
      </div>
    `;

    const area = STATE.tooltip.querySelector('[data-role="prompt"]');
    area?.addEventListener('input', () => { STATE.currentPrompt = area.value; });

    updatePosition();
    requestAnimationFrame(updatePosition);
  }

  function updatePosition() {
    if (!STATE.currentElement || !STATE.highlight || !STATE.tooltip) return;
    const rect = STATE.currentElement.getBoundingClientRect();

    const leftEdge = Math.max(0, rect.left);
    const topEdge = Math.max(0, rect.top);
    const width = Math.max(0, Math.min(rect.width, window.innerWidth - leftEdge));
    const height = Math.max(0, Math.min(rect.height, window.innerHeight - topEdge));

    STATE.highlight.style.left = `${leftEdge}px`;
    STATE.highlight.style.top = `${topEdge}px`;
    STATE.highlight.style.width = `${width}px`;
    STATE.highlight.style.height = `${height}px`;
    STATE.highlight.classList.toggle('vc-locked', STATE.locked);
    STATE.tooltip.classList.toggle('vc-panel-locked', STATE.locked);

    const tt = STATE.tooltip.getBoundingClientRect();
    const tooltipWidth = Math.min(tt.width || 330, window.innerWidth - 24);
    const tooltipHeight = Math.min(tt.height || 360, window.innerHeight - 24);
    const margin = 12;
    let left, top;

    // Khi vùng đã khóa, giữ panel ở vị trí người dùng đang thao tác.
    // Tránh case mở Help/Kỹ thuật làm panel cao hơn rồi thuật toán đổi anchor sang góc khác.
    if (STATE.locked && STATE.stablePanelPosition) {
      left = Math.max(margin, Math.min(STATE.stablePanelPosition.left, window.innerWidth - tooltipWidth - margin));
      top = Math.max(margin, Math.min(STATE.stablePanelPosition.top, window.innerHeight - tooltipHeight - margin));
      STATE.tooltip.style.left = `${left}px`;
      STATE.tooltip.style.top = `${top}px`;
      STATE.stablePanelPosition = { left, top };
      return;
    }

    if (tooHuge(rect)) {
      left = STATE.pointer.x + 16;
      top = STATE.pointer.y + 16;
    } else if (rect.right + tooltipWidth + margin <= window.innerWidth) {
      left = rect.right + margin;
      top = rect.top;
    } else if (rect.left - tooltipWidth - margin >= 0) {
      left = rect.left - tooltipWidth - margin;
      top = rect.top;
    } else if (rect.bottom + tooltipHeight + margin <= window.innerHeight) {
      left = rect.left;
      top = rect.bottom + margin;
    } else {
      left = window.innerWidth - tooltipWidth - margin;
      top = margin;
    }

    left = Math.max(margin, Math.min(left, window.innerWidth - tooltipWidth - margin));
    top = Math.max(margin, Math.min(top, window.innerHeight - tooltipHeight - margin));
    STATE.tooltip.style.left = `${left}px`;
    STATE.tooltip.style.top = `${top}px`;
    if (STATE.locked) STATE.stablePanelPosition = { left, top };
  }

  async function onTooltipClick(event) {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const action = button.dataset.action;

    if (action === 'close') {
      setEnabled(false, true);
      return;
    }

    if (action === 'toggle-lock') {
      if (!STATE.locked) {
        const currentTooltipRect = STATE.tooltip?.getBoundingClientRect?.();
        STATE.stablePanelPosition = currentTooltipRect ? { left: currentTooltipRect.left, top: currentTooltipRect.top } : null;
        STATE.locked = true;
      } else {
        STATE.locked = false;
        STATE.stablePanelPosition = null;
      }
      render(STATE.currentElement, analyzeElement(STATE.currentElement));
      return;
    }

    if (action === 'help') {
      STATE.showHelp = !STATE.showHelp;
      STATE.showAdvanced = false;
      render(STATE.currentElement, analyzeElement(STATE.currentElement));
      return;
    }

    if (action === 'toggle-advanced') {
      STATE.showAdvanced = !STATE.showAdvanced;
      STATE.showHelp = false;
      render(STATE.currentElement, analyzeElement(STATE.currentElement));
      return;
    }

    if (action === 'toggle-types') {
      STATE.showTypePicker = !STATE.showTypePicker;
      render(STATE.currentElement, analyzeElement(STATE.currentElement));
      return;
    }

    if (action === 'choose-type') {
      STATE.selectedType = button.dataset.type;
      STATE.activeReasonIndex = 0;
      STATE.reasonPage = 0;
      STATE.showTypePicker = false;
      render(STATE.currentElement, analyzeElement(STATE.currentElement));
      return;
    }

    if (action === 'lang-switch') {
      const newLang = button.dataset.lang;
      if (newLang !== STATE.lang && (newLang === 'vi' || newLang === 'en')) {
        STATE.lang = newLang;
        saveLang();
        STATE.activeReasonIndex = 0;
        STATE.reasonPage = 0;
        render(STATE.currentElement, analyzeElement(STATE.currentElement));
      }
      return;
    }

    if (action === 'remember-type') {
      const infoNow = analyzeElement(STATE.currentElement);
      if (rememberCurrentElement(STATE.selectedType || infoNow.key)) {
        STATE.selectedType = null;
        showMemoryNotice(T[STATE.lang].rememberDone);
        render(STATE.currentElement, analyzeElement(STATE.currentElement));
      }
      return;
    }

    if (action === 'forget-type') {
      if (forgetCurrentElement()) {
        STATE.selectedType = null;
        render(STATE.currentElement, analyzeElement(STATE.currentElement));
      }
      return;
    }

    if (action === 'clear-page-memory') {
      clearPageMemory();
      STATE.selectedType = null;
      render(STATE.currentElement, analyzeElement(STATE.currentElement));
      return;
    }

    if (action === 'cycle-reasons') {
      STATE.reasonPage += 1;
      STATE.activeReasonIndex = 0;
      render(STATE.currentElement, analyzeElement(STATE.currentElement));
      return;
    }

    if (action === 'reason') {
      STATE.activeReasonIndex = Number(button.dataset.index || 0);
      render(STATE.currentElement, analyzeElement(STATE.currentElement));
      return;
    }

    if (action === 'tech-keyword') {
      const value = button.dataset.value || button.textContent || '';
      const area = STATE.tooltip.querySelector('[data-role="prompt"]');
      const next = buildTechPrompt(value, STATE.lastInfo || analyzeElement(STATE.currentElement));
      if (area) area.value = next;
      STATE.currentPrompt = next;
      flashCopyButton(T[STATE.lang].addedToPrompt);
      return;
    }

    if (action === 'copy') {
      const area = STATE.tooltip.querySelector('[data-role="prompt"]');
      const text = cleanText(area?.value || STATE.currentPrompt || '');
      await copyText(text);
      flashCopyButton(T[STATE.lang].copiedBtn);
    }
  }


  function showMemoryNotice(label) {
    STATE.memoryNotice = { label, until: Date.now() + 1800 };
    if (STATE.memoryTimer) clearTimeout(STATE.memoryTimer);
    STATE.memoryTimer = setTimeout(() => {
      STATE.memoryNotice = null;
      if (STATE.enabled && STATE.currentElement && STATE.tooltip) {
        render(STATE.currentElement, analyzeElement(STATE.currentElement));
      }
    }, 1850);
  }

  function flashCopyButton(label) {
    const button = STATE.tooltip?.querySelector('[data-action="copy"]');
    if (!button) return;
    const old = button.textContent;
    button.textContent = label;
    setTimeout(() => { button.textContent = T[STATE.lang]?.copyBtn || old || 'Copy câu này'; }, 900);
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (_) {
      const area = document.createElement('textarea');
      area.value = text;
      area.style.position = 'fixed';
      area.style.left = '-9999px';
      document.body.appendChild(area);
      area.focus();
      area.select();
      document.execCommand('copy');
      area.remove();
    }
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[char]));
  }

  init();
})();
