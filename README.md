# Held — Adaptive Devotional PWA

Held is a free, offline-first devotional web app designed to adapt over time without a paid AI service.

## What it does

- Daily adaptive devotional
- Scripture displayed directly inside Held
- Public-domain World English Bible passage caching for offline reading
- Optional one-tap download of the current Scripture library
- Mood + need check-ins
- On-device theme scoring that adapts future devotionals
- Reflection journal
- Prayer journal with answered-prayer tracking
- Answered-prayer retrospectives
- Favorites
- Gentle progress and weekly reflection
- Monthly reflections generated from the user's actual Held history
- Meaningful growth markers without scorekeeping
- Journey completion reflections
- "What Held is learning" theme view
- Library search and theme filters
- Quiet reading mode
- Optional Gentle Focus themes
- Seven Guided Journeys with local progress and notes
- Export / import backup
- Offline support
- Installable on iPhone as a web app
- No account, no database, no monthly bill

## Privacy model

Held stores personal devotional data in the browser's localStorage. Journal text is scanned only by simple on-device keyword rules to adjust theme weights. No journal, prayer, check-in, reflection, milestone, or adaptive-profile data is sent to a server or AI API by Held.

When Scripture text is first requested, Held sends only the Bible reference (for example, `Philippians 4:6-7`) to Bible API and requests the public-domain World English Bible. The returned passage is then cached on the device. The Settings screen also includes **Download all current passages** so the current devotional library can be prepared for offline use. Bulk downloads are intentionally paced to respect the free Scripture service's request limits.

Because personal data is local, clearing browser/site data or deleting the web app can remove it. Use the Export backup button periodically.

## Guided Journeys

Held includes seven 7-day Guided Journeys:

- Peace When Your Mind Won't Stop
- Learning to Trust Again
- Healthy Love
- Who God Says I Am
- When God Feels Quiet
- Grief & Remembering
- Becoming a Mother

Journeys live alongside the normal adaptive devotional rather than replacing it. Each journey remembers its own current day, completed days, and private notes. Held can suggest a journey from the same on-device theme signals used for the daily devotional.

## Long-term growth

Held v1.5 adds a long-term reflection layer designed to make months of use more meaningful without turning faith into a points system.

- **Monthly reflection:** summarizes devotional days, recurring themes, journal activity, answered prayers, and completed Guided Journeys for the month, then asks four reflection questions.
- **Growth markers:** quietly remembers meaningful moments such as the first completed devotional, seven and thirty days of returning, the first journal entry, answered prayers, and completed Guided Journeys.
- **Answered-prayer retrospectives:** lets the user record how a prayer unfolded, what surprised them, and what they want to remember about God.
- **Journey completion reflection:** after finishing a Guided Journey, Held creates a dedicated space to record what stayed with the user and what feels different.

All of this remains local to the device and is included in the existing Held backup because it lives inside the same saved state.

## Content library

Held contains **104 original devotionals**: 8 in each of 13 themes.

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

Each theme progresses from foundational material into growing, deeper, and rooted reflection. The original 26 entries remain intact; the additional 78 entries live in `content.js` so future content updates stay clean.

## Scripture

Held displays Scripture inside the devotional experience using the **World English Bible (WEB)**, a modern-English public-domain translation. Passage text is cached locally after it is loaded. The Settings screen can download every unique reference currently used in the Held devotional library for stronger offline support.

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

## Free GitHub Pages deployment

1. Create a public GitHub repository.
2. Put the Held files in the repository root.
3. Open Settings → Pages.
4. Under Build and deployment, choose Deploy from a branch.
5. Select the `main` branch and `/ (root)`, then save.

On iPhone, open the live Pages address in Safari → Share → Add to Home Screen → Open as Web App (if shown) → Add.

## v1.5

- Added monthly reflection summaries and prompts
- Added non-competitive growth markers
- Added answered-prayer retrospectives
- Added Guided Journey completion reflections
- Kept every long-term reflection local and backup-compatible
- Added the v1.5 files to the offline app cache

## v1.4

- Added seven Guided Journeys
- Added per-journey day progress and private notes
- Added adaptive journey suggestions
- Added in-app public-domain World English Bible Scripture
- Added local Scripture caching
- Added paced one-tap offline Scripture download
- Kept journals, prayers, favorites, history, and learning data compatible

## v1.3

- Expanded from 26 to 104 devotionals
- 8 devotionals per theme
- Multi-stage content depth: Foundation, Growing, Deeper, Rooted
- Expanded library remains fully offline

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
