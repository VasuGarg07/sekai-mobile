# Sekai Mobile

Android app for Sekai Arcadia (anime discovery + watchlist): Expo SDK 57, Expo Router, TypeScript, Firebase JS SDK, TanStack Query.
It shares one Firebase project with `../sekai-web`. `../sekai-web/firestore.rules` is the backend contract both apps follow.

Conventions below follow the Google TypeScript Style Guide, the Airbnb React/JSX style guide and the React docs, adapted where Expo's tooling expects otherwise.

## Workflow

- After every change run `npx tsc --noEmit` and `npx expo lint`, and fix what they report.
- Never run installs, prebuild or builds. Give the user the exact command instead:
  - `npx expo install <package>` (not `npm install`, so versions match the Expo SDK)
  - `npx expo prebuild --clean --platform android`
  - `npx expo run:android --device`
- Never commit, push or create branches unless the user explicitly asks in that turn.
- Don't edit `app.json` or other native config while the user has a build running.
- `android/` is generated. Never edit it; configure native behaviour through `app.json` and config plugins.
- Expo APIs change every SDK. Check the docs for the installed version (`https://docs.expo.dev/versions/v57.0.0/`) instead of relying on memory.

## Structure

```
src/
  app/          routes only (Expo Router); read route params, render a screen
  screens/      screen bodies; a complex screen is a folder with index.tsx + components/
  components/   shared components; ui/ holds generic primitives
  providers/    React context providers
  hooks/        shared hooks
  services/     everything that talks to Firebase or AniList
  lib/          client setup (Firebase, query client)
  utils/        small pure helpers
  types/        shared types
  theme/        design tokens
  constants.ts  app-wide constants
```

- UI never calls Firebase directly; it goes through `services/`.
- Server data goes through TanStack Query. React context is only for app-wide client state (auth).
- Import project files with the `@/` alias. Group imports: packages, then `@/`, then relative. Use `import type` for type-only imports.

## TypeScript

- Named exports only. Route files are the only default exports, because Expo Router requires them.
- `interface` for object shapes, including props. `type` for unions and other aliases.
- No `any`. Use `unknown` and narrow it with a type guard.
- No non-null `!` and no `as` casts without a reason that is obvious or stated in a comment.
- Optional fields (`foo?: string`) rather than `foo: string | undefined`.
- Naming: `camelCase` for variables and functions, `PascalCase` for components, types and interfaces, `CONSTANT_CASE` for module-level constants. No `I` prefix on interfaces, no `_` prefixes.

## React

- Function components only. One component per file; small private helpers may live alongside it.
- Files and folders are kebab-case (`password-field.tsx`); the component inside is PascalCase.
- Props interface is named `<Component>Props` and declared just above the component.
- Event handlers are `handleX` inside a component; callback props are `onX`.
- Boolean props without a value when true (`<Button loading />`). Self-close tags without children.
- Stable keys from data, never array indexes.
- Derive values during render instead of storing them in state. Put user-triggered logic in event handlers. Use effects only to sync with something outside React (subscriptions, native APIs).
- Prefer early returns over nested conditionals. No nested ternaries in JSX.
- Keep components small. If a component needs scrolling to understand, extract components or a hook.
- Every screen that shows server data supports pull to refresh: a `RefreshControl` on its scroll view or list, wired to the query's `refetch`.

## Styling

- `StyleSheet.create` at the bottom of the file. No inline style objects except for values computed at render.
- Use tokens from `@/theme` (colors, spacing, radius, font sizes and weights). No raw hex values or magic numbers in components.
- Every pressable gets `accessibilityRole`. Every pressable without visible text gets `accessibilityLabel`.

## Comments

- Default to none. Names and types should explain what the code does.
- Comment only what the code can't say: why a choice was made, an external constraint (Firestore rules, Firebase or library behaviour), or a gotcha.
- `/** */` for documentation on exported APIs and interface fields; `//` for implementation notes, one `//` per line.
- Never restate the code, label sections or narrate steps.

## Errors

- Reads used by TanStack Query throw (`AniListError` for AniList), so queries get error states and retries.
- Writes and auth actions return `ActionResult` (`{ success: true } | { success: false; message }`) with a user-facing message, and don't throw to the UI.
- `message: null` means there is nothing to show (e.g. the user cancelled).
- Firestore document shapes (snake_case fields) stay inside `services/`; the rest of the app uses the camelCase types in `types/`.
- Never swallow an error silently unless the reason is obvious from the code or stated in a comment.
- No `console.log`. `console.warn` only for failures we deliberately don't surface to the user.
