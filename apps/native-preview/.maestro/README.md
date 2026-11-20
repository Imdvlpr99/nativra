# Device flows

[Maestro](https://maestro.mobile.dev) flows for what the web preview can't check: gestures (Slider, SwipeableRow, TimePicker) and the camera (CodeScanner). Each flow opens the preview app, filters the gallery to one item, and drives it by its visible text.

## Run

1. Build and install the preview app on a simulator, emulator or device. Expo Go won't work: the app id must be `dev.nativra.preview`.

   ```bash
   cd apps/native-preview
   npx expo run:android   # or: npx expo run:ios
   ```

2. Install the [Maestro CLI](https://maestro.mobile.dev/getting-started/installing-maestro), then run every flow:

   ```bash
   maestro test apps/native-preview/.maestro
   ```

   Or run one, e.g. `maestro test apps/native-preview/.maestro/swipeable-row.yaml`.

## Status

These flows haven't run in CI yet: CI has no simulator. Run them before a release that touches gestures or the camera. If a flow fails because a demo's text changed, update the flow along with the demo in `App.tsx`.
