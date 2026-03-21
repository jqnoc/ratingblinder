'use strict';
(() => {

/* ── Configuration ─────────────────────────────────────────────── */

// Unicode star characters often used for inline ratings
const STAR_RE = /[★☆⭐🌟✮✯⭑⭒✡🌠💫]{2,}/;

// Tags whose text content should never be scanned
const SKIP_TAGS = new Set([
    'SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'NOSCRIPT',
    'CODE', 'PRE', 'SVG', 'MATH'
]);

let enabled = true;

/* ── Initialise from storage ─────────────────────────────────────
   Default state is ON (ratings hidden).                           */
chrome.storage.local.get('enabled', (res) => {
    enabled = res.enabled !== false;
    if (!enabled) {
        document.documentElement.classList.add('rb-off');
    } else if (document.body) {
        scan(document.body);
    }
});

/* ── Scan a subtree for star-character text nodes ────────────────
   When a text node contains sequences of star unicode characters
   (e.g. ★★★★☆)  its parent element is hidden via the .rb-hidden
   CSS class.                                                      */
function scan(root) {
    if (!root || !enabled) return;

    const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode(node) {
                const tag = node.parentElement?.tagName;
                if (!tag || SKIP_TAGS.has(tag)) {
                    return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_ACCEPT;
            }
        }
    );

    const toHide = new Set();
    while (walker.nextNode()) {
        if (STAR_RE.test(walker.currentNode.textContent)) {
            const el = walker.currentNode.parentElement;
            if (el && !el.classList.contains('rb-hidden')) {
                toHide.add(el);
            }
        }
    }
    toHide.forEach(el => el.classList.add('rb-hidden'));
}

/* ── MutationObserver for dynamically-loaded content (SPAs) ───── */
const observer = new MutationObserver(mutations => {
    if (!enabled) return;
    for (const m of mutations) {
        for (const node of m.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
                scan(node);
            }
        }
    }
});

function startObserving() {
    const target = document.body || document.documentElement;
    if (target) {
        observer.observe(target, { childList: true, subtree: true });
    }
}

if (document.body) {
    startObserving();
} else {
    /* Body not ready yet – wait for it */
    const bodyWaiter = new MutationObserver(() => {
        if (document.body) {
            bodyWaiter.disconnect();
            startObserving();
            if (enabled) scan(document.body);
        }
    });
    bodyWaiter.observe(document.documentElement, { childList: true });
}

/* ── Message handler (toggle from popup) ─────────────────────────
   The popup sends { action:'toggle', enabled:bool }.
   We add/remove the .rb-off class so all CSS rules activate or
   deactivate instantly, and show/hide JS-managed elements.        */
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg.action === 'toggle') {
        enabled = msg.enabled;
        if (enabled) {
            document.documentElement.classList.remove('rb-off');
            if (document.body) scan(document.body);
        } else {
            document.documentElement.classList.add('rb-off');
            document.querySelectorAll('.rb-hidden').forEach(el => {
                el.classList.remove('rb-hidden');
            });
        }
    } else if (msg.action === 'getState') {
        sendResponse({ enabled });
    }
});

})();
