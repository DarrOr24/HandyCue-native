# HandyCue Web Pages

Static pages for Google Play and App Store requirements.

## Delete Account Page

**Location:** `delete-account/`  
**URL path:** `/delete-account/` (or `/delete-account`)

### Deploy to Netlify Drop (fastest, ~5 min)

**Option 1 — Delete page as site root**
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag the **`delete-account`** folder onto the page
3. Netlify gives you a URL like `https://random-name-123.netlify.app`
4. That URL is your delete-account page (it’s the site root)
5. Use it in Google Play Console → App content → Data safety → Account deletion

**Option 2 — Delete page at /delete-account/**
1. Drag the whole **`docs`** folder onto Netlify Drop
2. Your delete-account page will be at: `https://yoursite.netlify.app/delete-account/`

### Alternative: GitHub Pages

1. Create a repo (e.g. `handycue-docs`)
2. Push the `docs` folder contents to the repo
3. Enable GitHub Pages in repo Settings → Pages
4. URL: `https://yourusername.github.io/handycue-docs/delete-account/`

### Files

- `delete-account/index.html` — the page
- `delete-account/app-icon.png` — HandyCue icon (keep in same folder when deploying)
