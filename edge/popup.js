'use strict';

const toggle = document.getElementById('toggle');
const status = document.getElementById('status');

/* ── Load current state ────────────────────────────────────────── */
chrome.storage.local.get('enabled', (res) => {
    const on = res.enabled !== false;   // default ON
    toggle.checked = on;
    updateLabel(on);
});

/* ── Toggle handler ────────────────────────────────────────────── */
toggle.addEventListener('change', () => {
    const on = toggle.checked;

    // Persist
    chrome.storage.local.set({ enabled: on });
    updateLabel(on);

    // Notify every open tab so the change is immediate (no reload)
    chrome.tabs.query({}, (tabs) => {
        for (const tab of tabs) {
            chrome.tabs.sendMessage(tab.id, {
                action: 'toggle',
                enabled: on
            }).catch(() => {});   // tab may not have content script
        }
    });
});

function updateLabel(on) {
    status.textContent = on ? 'Ratings are hidden' : 'Ratings are visible';
    status.className   = 'status' + (on ? ' active' : '');
}
