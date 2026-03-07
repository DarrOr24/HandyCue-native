# HandyCue Native

React Native (Expo) app — migrated from the HandyCue PWA, powered by Supabase.

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In **Project Settings → API**, copy:
   - Project URL
   - `anon` public key

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase URL and anon key:

```
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Supabase Storage (for profile avatars)

Create a storage bucket named `avatars` in your Supabase project:

1. Storage → New bucket → name: `avatars`
2. Make it **public**
3. Run the policies in `supabase-storage-policies.sql` (Supabase Dashboard → SQL Editor)

### 5. Run the app

```bash
npm run ios     # iOS Simulator
npm run android # Android Emulator
npm run web     # Web browser
```

### 6. EAS Build (production)

For `eas build`, set environment variables in EAS (`.env` is gitignored and not uploaded):

```bash
eas secret:create --name EXPO_PUBLIC_SUPABASE_URL --value "https://xxxxx.supabase.co" --scope project
eas secret:create --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "your-anon-key" --scope project
```

Or add them in [expo.dev](https://expo.dev) → your project → Secrets.

### App icon

Replace `assets/app-icon.png` with a **1024×1024** PNG. See `assets/ICON_SPECS.md` for Android adaptive icon requirements (logo centered in safe zone to avoid stretching/cropping).

### Magic link & password reset (deep linking)

For magic link and password reset emails to open the app instead of a localhost error:

1. In **Supabase Dashboard** → Authentication → URL Configuration
2. Add to **Redirect URLs**: `handycue://auth/callback`
3. Rebuild the app (scheme is baked into the build)

## Migration status

See [MIGRATION_ROADMAP.md](../MIGRATION_ROADMAP.md) in the project root for the full migration plan.
