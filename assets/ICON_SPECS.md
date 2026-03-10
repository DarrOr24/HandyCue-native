# App Icon Specifications

## Required Format

- **Size:** 1024×1024 pixels (PNG)
- **File:** Replace `app-icon.png` in this folder

## iOS

Works well with centered logos. Standard 1024×1024 is used as-is.

## Android Adaptive Icon (Important)

Android masks the icon into a **squircle**. The visible area is the center ~66% (~675×675 px of a 1024 canvas). The logo must fit this zone.

### If the icon looks spread out or doesn't fit on Android

**Option A – Add a circular background:** Put the logo on a solid circular background (~700–800 px diameter, centered). Use a color that matches your app (e.g. #E0F0EB). The circle keeps the icon contained when the squircle mask is applied.

**Option B – Add a border:** Add a circular or rounded border around the logo to define the edges.

**Option C – Scale down:** Scale the logo to ~500×550 px, centered, with transparent padding. Use a transparent background so `backgroundColor` in app.json shows through.

### If the icon looks too small on Android

**Fix:** Scale up the logo so it occupies ~85–95% of the center 675×675 px area. Center it.

### General rules for app-icon-android.png

1. **Center** the logo in the 1024×1024 canvas
2. **Size** so the logo fits within ~600×675 px (not touching edges)
3. Use **transparent background** or match `backgroundColor` in app.json

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
