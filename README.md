# Held — Adaptive Devotional PWA

Held is a free, offline-first devotional web app designed to adapt over time without a paid AI service.

## What it does

- Daily Bible-reference devotional
- Optional mood + need check-in
- On-device theme scoring that adapts future devotionals
- Reflection journal
- Prayer journal with answered-prayer tracking
- Favorites
- Gentle progress and weekly reflection
- "What Held is learning" theme view
- Library search and theme filters
- Quiet reading mode
- Optional Gentle Focus themes
- Export / import backup
- Offline support
- Installable on iPhone as a web app
- No account, no database, no monthly bill

## Privacy model

Held stores data in the browser's localStorage. Journal text is scanned only by simple on-device keyword rules to adjust theme weights. No journal, prayer, or check-in data is sent to a server or AI API by this app.

Because data is local, clearing browser/site data or deleting the web app can remove it. Use the Export backup button periodically.

## Free GitHub Pages deployment

1. Create a free GitHub account if needed.
2. Create a public repository.
3. Upload the Held files to the repository root.
4. Open Settings → Pages.
5. Under Build and deployment, choose Deploy from a branch.
6. Select the `main` branch and `/ (root)`, then save.
7. GitHub provides the live `github.io` address.

On iPhone:
1. Open the live address in Safari.
2. Tap Share.
3. Choose Add to Home Screen.
4. Choose Open as Web App if shown.
5. Tap Add.

## Content library

Held v1.3 contains **104 original devotionals**: 8 in each of 13 themes.

Themes:
- Peace
- Trust
- Identity
- Hope
- Rest
- Relationships
- Forgiveness
- Motherhood / Family
- Purpose
- Courage
- Gratitude
- Faith
- Grief

Each theme now progresses from foundational material into growing, deeper, and rooted reflection. The original 26 entries remain intact; the additional 78 entries live in `content.js` so future content updates stay clean.

## How the adaptive engine works

Held gives extra weight to:
- needs selected in recent check-ins
- recurring themes in recent journal/reflection text
- mood signals such as especially heavy days
- devotionals marked helpful or unhelpful
- saved devotionals
- optional Gentle Focus themes

It also applies recency weighting and variety so a recurring need can remain visible without forcing the same theme every day. Deeper entries do not surface until the user has already spent time in a theme.

This is personalization, not diagnosis. Held intentionally avoids medical or mental-health claims.

## v1.3

- Expanded from 26 to 104 devotionals
- 8 devotionals per theme
- Multi-stage content depth: Foundation, Growing, Deeper, Rooted
- Expanded library remains fully offline
- Existing journals, prayers, favorites, history, and learning data remain compatible

## v1.2 premium experience

- Premium Today screen and floating app-style navigation
- Daily rhythm progress
- Quiet reading mode
- Library search and theme filtering
- Weekly Journey reflection
- Improved prayer journal details
- Gentle Focus personalization controls
- Better install detection, accessibility, motion preferences, and update behavior

## v1.1 polish

- Proper iPhone Home Screen PNG icons
- Dark mode
- More reliable local date handling
- Check-in notes feed long-term devotional learning
- “Somewhat” feedback contributes to learning
- Empty learning states no longer pretend a pattern exists
- Compatibility fallback for IDs in limited webviews
