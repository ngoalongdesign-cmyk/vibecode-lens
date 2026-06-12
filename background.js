function isRestrictedUrl(url = '') {
  return url.startsWith('chrome://') ||
    url.startsWith('edge://') ||
    url.startsWith('about:') ||
    url.startsWith('chrome-extension://') ||
    url.startsWith('https://chromewebstore.google.com/');
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

async function setLensEnabled(enabled) {
  await chrome.storage.sync.set({ lensEnabled: enabled });
  const tab = await getActiveTab();
  if (!tab?.id || isRestrictedUrl(tab.url || '')) return;
  try {
    await ensureInjected(tab.id);
    await chrome.tabs.sendMessage(tab.id, { type: 'VIBECODE_LENS_TOGGLE', enabled });
  } catch (_) {
    // Một số trang chặn injection. Bỏ qua để không làm gãy shortcut.
  }
}

async function toggleLens() {
  const { lensEnabled = false } = await chrome.storage.sync.get('lensEnabled');
  await setLensEnabled(!lensEnabled);
}

chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle-lens') toggleLens();
});
