# Held — Adaptive Devotional PWA

Held is a free, offline-first devotional web app designed to adapt over time without a paid AI service.

## What it does

- Daily Bible-reference devotional
- Optional mood + need check-in
- On-device theme scoring that adapts future devotionals
- Reflection journal
- Prayer journal with "answered" tracking
- Favorites
- Progress and streaks
- "What Held is learning" theme view
- Export / import backup
- Offline support
- Installable on iPhone as a web app
- No account, no database, no monthly bill

## Privacy model

Version 1 stores data in the browser's localStorage. Journal text is scanned only by simple keyword rules on the device to adjust theme weights. No journal, prayer, or check-in data is sent to a server or AI API by this app.

Because data is local, clearing browser/site data or deleting the web app can remove it. Use the Export backup button periodically.

## Free GitHub Pages deployment

1. Create a free GitHub account if needed.
2. Create a **public** repository, for example `held-devotional`.
3. Upload every file and folder from this package to the repository root.
4. In the repository, open **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select the `main` branch and `/ (root)`, then save.
7. GitHub will provide the live `github.io` address.

On Savanna's iPhone:
1. Open the live address in Safari.
2. Tap the Share button.
3. Choose **Add to Home Screen**.
4. Choose **Open as Web App** if that option is shown.
5. Tap **Add**.

## Content

The first build contains 26 devotional entries across:
peace, trust, identity, hope, rest, relationships, forgiveness, motherhood/family, purpose, courage, gratitude, faith, and grief.

You can expand the `DEVOTIONALS` array in `app.js` with more entries at any time.

## How the adaptive engine works

The app gives extra weight to:
- needs selected in recent check-ins
- recurring themes in recent journal/reflection text
- low-day check-ins that may benefit from peace/hope/rest
- themes from devotionals marked helpful
- saved devotionals

It avoids repeating the same theme too many days in a row and gradually unlocks deeper entries within themes.

This is personalization, not diagnosis. It intentionally avoids medical or mental-health claims.

## v1.1 polish

- Proper iPhone Home Screen PNG icons
- Dark mode
- More reliable local date handling
- Check-in notes now feed long-term devotional learning
- "Somewhat" feedback contributes to learning
- Empty learning state no longer pretends a pattern exists
- Compatibility fallback for IDs in limited webviews
