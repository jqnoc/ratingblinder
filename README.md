# Rating Blinder

A browser extension that hides ratings and scores from websites so you can form your own opinion before reading a book or watching a movie. Available for **Firefox** and **Microsoft Edge**.

## Project Structure

```
RatingBlinder/
├── firefox/          # Firefox add-on (Manifest V2, browser.* API)
│   ├── manifest.json
│   ├── content.js
│   ├── content.css
│   ├── popup.html
│   ├── popup.js
│   └── icons/
├── edge/             # Edge extension (Manifest V3, chrome.* API)
│   ├── manifest.json
│   ├── content.js
│   ├── content.css
│   ├── popup.html
│   ├── popup.js
│   └── icons/
└── README.md
```

## Supported Sites

Site-specific selectors for: **Amazon**, **Goodreads**, **FilmAffinity**, **LibraryThing**, **IMDb**, **Rotten Tomatoes**, **Metacritic**, **Letterboxd**, **Steam**, **Yelp**, **TripAdvisor**, and **Google Search**.

Generic coverage catches ratings on most other sites via Schema.org microdata, aria-labels, data attributes, common class-name patterns, and inline star characters (★★★★☆, ⭐⭐⭐, etc.).

## How to Install

### Firefox

1. Open Firefox and type `about:debugging` in the address bar.
2. Click **"This Firefox"** in the left sidebar.
3. Click **"Load Temporary Add-on…"**.
4. Navigate to the **`firefox/`** folder and select the **manifest.json** file.
5. The extension icon appears in the toolbar — click it to toggle ratings on/off.

> **Note:** Temporary add-ons are removed when Firefox restarts. For a permanent install you would need to package it as a `.xpi` file and sign it through [addons.mozilla.org](https://addons.mozilla.org), or set `xpinstall.signatures.required` to `false` in `about:config` (Developer/Nightly editions only).

### Microsoft Edge

1. Open Edge and type `edge://extensions` in the address bar.
2. Enable **Developer mode** (toggle in the bottom-left corner).
3. Click **"Load unpacked"**.
4. Select the **`edge/`** folder.
5. The extension icon appears in the toolbar — click it to toggle ratings on/off.

> **Note:** The Edge version uses Manifest V3 and the `chrome.*` extension API, which is the standard for all Chromium-based browsers. This version also works in Google Chrome and other Chromium-based browsers via their respective extension pages.
