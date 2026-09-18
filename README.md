# PhsarNow

A C2C marketplace for buying and selling with a single account. Built with React Native, Expo SDK 57, TypeScript, and Expo Router.

One account. Two roles. One marketplace.

## Stack

- Expo SDK 57, Expo Router, TypeScript
- TanStack Query for server state
- Zustand for client state
- `expo-glass-effect` on iOS, translucent fallbacks on Android
- Mock services that can be swapped for a real API

## Run

```bash
npm install
npx expo start
```

Then open iOS Simulator, Android emulator, or Expo Go.

Demo login is on the welcome screen. OTP code is `123456`.

## App loop

**Buy:** Discover → Search → Product → Seller → Message / Offer → Buy → Transaction

**Sell:** Sell → Photos → Details → Price → Preview → Publish → Messages / Offers

Published listings are stored locally in the mock database, so they appear in Home and Discover after you publish.

## Environment

Public config lives in `.env`, `.env.development`, and `.env.production`:

```
EXPO_PUBLIC_API_URL=
EXPO_PUBLIC_IMAGE_URL=
EXPO_PUBLIC_APP_ENV=development
```

Leave `EXPO_PUBLIC_API_URL` empty to keep using the mock API. Do not put private secrets in `EXPO_PUBLIC_*` variables.
