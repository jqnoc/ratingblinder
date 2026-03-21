'use strict';

const toggle = document.getElementById('toggle');
const status = document.getElementById('status');

/* ── Load current state ────────────────────────────────────────── */
browser.storage.local.get('enabled').then(res => {
    const on = res.enabled !== false;   // default ON
    toggle.checked = on;
    updateLabel(on);
});

/* ── Toggle handler ────────────────────────────────────────────── */
toggle.addEventListener('change', () => {
    const on = toggle.checked;

    // Persist
    browser.storage.local.set({ enabled: on });
    updateLabel(on);

    // Notify every open tab so the change is immediate (no reload)
    browser.tabs.query({}).then(tabs => {
        for (const tab of tabs) {
            browser.tabs.sendMessage(tab.id, {
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
