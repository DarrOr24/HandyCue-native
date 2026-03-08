# App Icon Specifications

## Required Format

- **Size:** 1024×1024 pixels (PNG)
- **File:** Replace `app-icon.png` in this folder

## iOS

Works well with centered logos. Standard 1024×1024 is used as-is.

## Android Adaptive Icon (Important)

Android masks the icon into a **squircle**. If your logo looks small on Android (but good on iPhone), the logo is too small within the canvas.

### The Fix: Logo Must FILL the Safe Zone

The visible area is the center **66%** (~675×675 px of a 1024 canvas). Your logo should **fill** that area:

1. **Scale up your logo** so it occupies ~85–95% of the center 675×675 px
2. **Center it** in the canvas
3. Use **transparent background** or match `backgroundColor` in app.json

### Why It Looks Small on Android

- iOS uses the full icon; Android crops to a squircle
- If the logo is 400×400 px in the center, it looks tiny in the squircle
- The PWA icon likely uses different proportions that display better

### Android-Specific Icon (app-icon-android.png)

The app uses `app-icon-android.png` for Android's adaptive icon. A copy of `app-icon.png` is provided as a starting point. **To fix the small logo on Android:** open `app-icon-android.png` in an image editor and scale up the logo layer so it fills ~85–95% of the center 675×675 px area. Keep the canvas at 1024×1024.

## Visual Guide

```
┌─────────────────────────────────┐
│  ~17% padding (may be cropped)  │
│  ┌─────────────────────────┐   │
│  │  LOGO SHOULD FILL THIS   │   │
│  │  (~675×675 px)           │   │
│  │  Not sit small inside it │   │
│  └─────────────────────────┘   │
└─────────────────────────────────┘
      1024 × 1024 px
```

## After Adding Your Icon

1. Replace `assets/app-icon.png` with your 1024×1024 PNG
2. Optionally create `app-icon-android.png` with logo scaled up for Android
3. Run `npx expo prebuild --clean` (if using prebuild)
4. Build: `eas build --platform android`
