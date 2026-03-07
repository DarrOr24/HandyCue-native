# App Icon Specifications

To fix stretching/cropping on Android, the app icon must follow these specs:

## Required Format

- **Size:** 1024×1024 pixels (PNG)
- **File:** Replace `app-icon.png` in this folder

## Android Adaptive Icon Safe Zone

Android masks the icon into different shapes (circle, squircle, etc.). To avoid cropping:

1. **Center your logo** in the middle 66% of the canvas (the "safe zone")
2. **Leave ~17% padding** on each side — the outer edges can be cut off
3. **Use transparent background** or white (#ffffff) — the adaptive icon uses `backgroundColor: "#ffffff"` for transparent areas

## Visual Guide

```
┌─────────────────────────────────┐
│  ~17% padding (may be cropped)  │
│  ┌─────────────────────────┐   │
│  │                         │   │
│  │   66% SAFE ZONE         │   │
│  │   Put your logo here    │   │
│  │                         │   │
│  └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
      1024 × 1024 px
```

## After Adding Your Icon

1. Replace `assets/app-icon.png` with your 1024×1024 PNG
2. Run `npx expo prebuild --clean` (if using prebuild)
3. Build: `eas build --platform android`
