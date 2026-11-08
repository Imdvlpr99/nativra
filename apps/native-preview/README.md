# @nativra/native-preview

The official Expo verification and interactive test harness for Nativra components.

It renders all 31 Nativra foundation primitives using exact registry source files and mock fixtures.

## Running in the Browser (Web)

Nativra native preview supports first-class web rendering via Expo and `react-native-web`.

### Start Local Web Dev Server
```bash
pnpm --filter @nativra/native-preview web
# or
cd apps/native-preview && npx expo start --web
```
This opens the preview directly in your default browser at `http://localhost:8081` with fast refresh.

### Export Static Web Bundle
```bash
pnpm --filter @nativra/native-preview export:web
```
Produces an optimized static bundle in `dist/` containing `index.html`, JavaScript bundles, and assets that can be hosted on any static web server or embedded inside an `<iframe>`.

---

## Running on Mobile (Android & iOS)

### Android
```bash
pnpm --filter @nativra/native-preview android
```

### iOS (macOS required)
```bash
pnpm --filter @nativra/native-preview ios
```

---

## Synchronizing Components

To re-sync components from the latest registry build into the preview app:
```bash
pnpm --filter @nativra/native-preview sync
```
