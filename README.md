# Sekai Mobile

Android app for Sekai Arcadia (anime discovery + watchlist). Bare React Native 0.86 (new architecture),
React Navigation, TypeScript, Firebase JS SDK, TanStack Query. It shares one Firebase project with
`../sekai-web`.

## Download

Get the latest APK from the [Releases page](https://github.com/VasuGarg07/sekai-mobile/releases/latest). On the phone, open the
downloaded file and allow installs from that browser when Android asks. New versions install over the old one.

## Requirements

- Node 24.13.0, JDK 17, Android SDK (`ANDROID_HOME` set), a USB-debugging phone or an emulator.

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill in the six Firebase web-app values.
3. `android/app/google-services.json` must be the Firebase config for `com.vasugarg.sekai`.

## Run

```bash
npm start            # Metro
npm run android      # build, install and launch the debug app
```

After changing Babel, Metro or `.env`: `npm start -- --reset-cache` (and rebuild for `.env` changes).
In a debug build, local images are fetched from Metro, so keep it running while you use the app.

## Checks

```bash
npm run typecheck
npm run lint
```

## Release

Push a tag like `v1.2.0`. GitHub Actions (`.github/workflows/release.yml`) builds a signed APK and attaches it
to a GitHub Release. The workflow needs the secrets and variable listed at the top of that file. The tag becomes
the app's `versionName`, and `versionCode` is `VERSION_CODE_BASE` plus the run number. The in-app update banner
compares the tag with the latest release.

The release key is never stored in the repo. Keep the keystore and its passwords outside it.

### Local signed build

From `android/`, set the signing variables in the same shell, then build. Use the next free `versionCode`
(higher than any build users already have):

```cmd
set SEKAI_UPLOAD_STORE_FILE=<absolute path to the .jks>
set SEKAI_UPLOAD_KEY_ALIAS=<key alias>
set /p SEKAI_UPLOAD_STORE_PASSWORD=Store password:
set /p SEKAI_UPLOAD_KEY_PASSWORD=Key password:
gradlew assembleRelease -PappVersionName=1.0.0 -PappVersionCode=<n> -PreactNativeArchitectures=arm64-v8a
```

The APK is `android/app/build/outputs/apk/release/app-release.apk`. Check which key signed it with
`apksigner verify --print-certs <apk>` from the Android SDK `build-tools` folder. `keytool -printcert -jarfile` does not
work here: with `minSdk` 24 the APK has no v1 signature.

## Project layout

See `CLAUDE.md`.
