const toggle = document.getElementById('lensToggle');
const statusEl = document.getElementById('status');
const copyGuide = document.getElementById('copyGuide');

const GUIDE = `Cách mô tả UI cho AI: gọi tên vùng UI + vị trí + thứ muốn chỉnh. Ví dụ: "Sửa sidebar bên trái: làm active item rõ hơn, giảm khoảng cách menu, giữ nút settings ở cuối."`;

async function init() {
  const { lensEnabled = false } = await chrome.storage.sync.get('lensEnabled');
  toggle.checked = lensEnabled;
  statusEl.textContent = lensEnabled ? 'Lens Mode đang bật.' : 'Bật Lens Mode rồi quay lại trang web để hover.';
}

function isRestrictedUrl(url = '') {
  return url.startsWith('chrome://') || url.startsWith('edge://') || url.startsWith('about:') || url.startsWith('chrome-extension://') || url.startsWith('https://chromewebstore.google.com/');
}

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

async function ensureInjected(tabId) {
  try {
    await chrome.tabs.sendMessage(tabId, { type: 'VIBECODE_LENS_PING' });
  } catch (_) {
    await chrome.scripting.insertCSS({ target: { tabId }, files: ['content.css'] });
    await chrome.scripting.executeScript({ target: { tabId }, files: ['content.js'] });
  }
}

async function broadcastEnabled(enabled) {
  await chrome.storage.sync.set({ lensEnabled: enabled });
  const tab = await getActiveTab();

  if (!tab?.id || isRestrictedUrl(tab.url || '')) {
    statusEl.textContent = 'Trang này Chrome không cho extension chạy. Hãy thử trên website http/https bình thường.';
    return;
  }

  try {
    await ensureInjected(tab.id);
    await chrome.tabs.sendMessage(tab.id, { type: 'VIBECODE_LENS_TOGGLE', enabled });
    statusEl.textContent = enabled ? 'Đã bật. Quay lại trang và hover vào UI.' : 'Đã tắt Lens Mode.';
  } catch (error) {
    statusEl.textContent = 'Chưa bật được trên tab này. Reload trang rồi bật lại.';
  }
}

toggle.addEventListener('change', () => broadcastEnabled(toggle.checked));

copyGuide.addEventListener('click', async () => {
  await navigator.clipboard.writeText(GUIDE);
  statusEl.textContent = 'Đã copy hướng dẫn.';
});

init();
