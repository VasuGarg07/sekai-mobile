# Sekai Mobile

**Discover anime and keep your watchlist in sync, on Android.**

Sekai is the Android companion to [Sekai Arcadia](https://sekai-arcadia.web.app). Browse what is trending, search and
filter the whole AniList catalogue, and track what you watch. Your list lives in the same account as the website, so it
follows you from your phone to the browser and back.

[![Latest release](https://img.shields.io/github/v/release/VasuGarg07/sekai-mobile?label=release)](https://github.com/VasuGarg07/sekai-mobile/releases/latest)
[![Platform](https://img.shields.io/badge/platform-Android%207.0%2B-3DDC84)](#install)
[![React Native](https://img.shields.io/badge/React%20Native-0.86-61DAFB)](https://reactnative.dev)
[![License](https://img.shields.io/github/license/VasuGarg07/sekai-mobile)](LICENSE)

## Install

1. Open the [latest release](https://github.com/VasuGarg07/sekai-mobile/releases/latest) on your phone and download
   `sekai-v<version>.apk` from **Assets**.
2. Open the downloaded file. When Android asks, allow installs from your browser (a one-time prompt).
3. Tap **Install**.

New versions install over the old one and keep your data. When a newer release is published, the app shows an update
banner on Home and Profile that links to it.

Requires Android 7.0 or newer on a 64-bit ARM (arm64) phone, which covers most current devices.

## Features

**Discover**

- Home with a spotlight carousel and ranked shelves: trending now, most popular, all-time favourites, recently completed
  and airing now, each with a "See all" list.
- Explore: browse by genre, search by title, and refine with filters for format, status, season, year, country of origin
  and sort order.
- Detail pages with the banner and cover, key facts, synopsis, genres and tags, the next episode, relations,
  recommendations, a trailer button and sharing.

**Track**

- Add anything to your list from Home, from a detail page, or with the quick button on a card.
- Six statuses: watching, completed, on hold, plan to watch, dropped and rewatch.
- List and grid views, status filters, pull to refresh, and instant updates that roll back if a save fails.
- Export your list as CSV, JSON or XML and share the file with any app.

**Make it yours**

- System, light or dark theme, with eight accent colours.
- A default status for new additions, and an 18+ mode that is off until you turn it on.
- Sign in with email and password or with Google.

## Built with

[React Native](https://reactnative.dev) 0.86 (new architecture, Hermes) and TypeScript, with
[React Navigation](https://reactnavigation.org), [TanStack Query](https://tanstack.com/query),
[Firebase](https://firebase.google.com) Auth and Firestore, and the [AniList](https://anilist.co) GraphQL API.

## Run it locally

You need Node 24.13.0, JDK 17, the Android SDK with `ANDROID_HOME` set, and a USB-debugging phone or an emulator.

1. `npm install`
2. Copy `.env.example` to `.env` and fill in the six values from your Firebase **web app** configuration.
3. Put the `google-services.json` for your Firebase Android app (package `com.vasugarg.sekai`) in `android/app/`. The
   one in this repository belongs to the maintainer's project, so replace it with yours if you fork the app, and add your
   debug key's SHA-1 in Firebase so Google sign-in works.
4. Start Metro in one terminal and build the app in another:

```bash
npm start
npm run android
```

A debug build loads its JavaScript and local images from Metro, so keep it running. After changing Babel, Metro or
`.env`, restart it with `npm start -- --reset-cache`.

---

Anime data and images come from [AniList](https://anilist.co). Sekai is an unofficial client and is not affiliated with
AniList. Released under the [MIT License](LICENSE).
