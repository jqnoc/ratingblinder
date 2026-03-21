# Rating Blinder

Ever landed on a movie page and had the score spoil your expectations? Rating Blinder is a browser extension that **hides ratings and scores across the web** so you can form your own opinion before watching a movie, reading a book, picking a restaurant, or buying a product. One click in the toolbar turns it on or off.

Available for **Firefox** and **Microsoft Edge** (and other Chromium-based browsers).

## How It Works

Rating Blinder runs as a content script that is injected into every page you visit. It uses two complementary strategies to hide ratings:

1. **CSS rules** (`content.css`) — A stylesheet loaded at `document_start` (before the page renders) that sets `display: none` on known rating elements. Rules are scoped under `html:not(.rb-off)` so they can be toggled instantly without reloading. The file contains:
   - **Site-specific selectors** for popular sites (Amazon, IMDb, Goodreads, etc.).
   - **Generic selectors** that catch ratings on any site via Schema.org microdata (`itemprop="ratingValue"`), ARIA labels (`aria-label*="star rating"`), common class-name patterns (`star-rating`, `avg-rating`, …), and data attributes (`data-rating`, `data-score`, …).

2. **JavaScript scanner** (`content.js`) — A script loaded at `document_end` that walks the DOM looking for text nodes containing sequences of Unicode star characters (★★★★☆, ⭐⭐⭐, etc.) and hides their parent elements. A `MutationObserver` keeps watching for dynamically-loaded content so it also works on single-page apps.

The **popup** (`popup.html` + `popup.js`) provides a simple toggle switch. When you flip it, the extension:
- Persists the new state to `storage.local`.
- Sends a message to every open tab so the change takes effect immediately — no page reload needed.

## Supported Sites

Dedicated selectors for: **Amazon**, **Goodreads**, **FilmAffinity**, **LibraryThing**, **IMDb**, **Rotten Tomatoes**, **Metacritic**, **Letterboxd**, **TMDB**, **Steam**, **Yelp**, **TripAdvisor**, and **Google Search**.

The generic rules provide broad coverage on most other sites as well.

## Project Structure

```
RatingBlinder/
├── firefox/            Firefox add-on (Manifest V2, browser.* API)
│   ├── manifest.json
│   ├── content.js
│   ├── content.css
│   ├── popup.html
│   ├── popup.js
│   └── icons/
│       └── icon.svg
├── edge/               Edge / Chrome extension (Manifest V3, chrome.* API)
│   ├── manifest.json
│   ├── content.js
│   ├── content.css
│   ├── popup.html
│   ├── popup.js
│   └── icons/
│       └── icon.svg
└── README.md
```

The two folders are self-contained extensions that share the same CSS and HTML. The only differences are:

| | Firefox | Edge / Chrome |
|---|---|---|
| Manifest version | 2 | 3 |
| Toolbar entry | `browser_action` | `action` |
| Extension API | `browser.*` (Promise-based) | `chrome.*` (callback-based) |
| Browser-specific settings | `gecko.id` | — |

## How to Load

### Firefox

1. Open Firefox and navigate to `about:debugging`.
2. Click **"This Firefox"** in the left sidebar.
3. Click **"Load Temporary Add-on…"**.
4. Navigate to the **`firefox/`** folder and select **`manifest.json`**.
5. The ⭐ icon appears in the toolbar — click it to toggle ratings on/off.

> **Tip:** Temporary add-ons are removed when Firefox restarts. For a permanent install, package the extension as a `.xpi` and sign it through [addons.mozilla.org](https://addons.mozilla.org), or set `xpinstall.signatures.required` to `false` in `about:config` (Developer/Nightly editions only).

### Microsoft Edge

1. Open Edge and navigate to `edge://extensions`.
2. Enable **Developer mode** (toggle in the bottom-left corner).
3. Click **"Load unpacked"**.
4. Select the **`edge/`** folder (the folder itself, not a file inside it).
5. The ⭐ icon appears in the toolbar — click it to toggle ratings on/off.

> **Tip:** The Edge version uses Manifest V3 and the standard `chrome.*` API, so it also works on **Google Chrome** (`chrome://extensions`) and other Chromium-based browsers.
