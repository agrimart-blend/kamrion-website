# DOE Studio website

Static, GitHub Pages-friendly website for DOE Studio and WallFall.

## Structure
- `/` — homepage (intro logo animation, hero, game modes, gallery, CTA)
- `/games/wallfall/` — WallFall game page
- `/privacy-policy/` — Privacy Policy
- `/account-deletion/` — Account Deletion
- `/terms/` — Terms of Service
- `/contact/` — Contact
- `/assets/intro/` — DOE Studio logo reveal animation (frame sequence + audio) used as the homepage loading screen
- `/assets/` — logo and WallFall screenshots

## Run locally
Because this is a static site, any local static server works. Example with Python:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080/`.

## GitHub Pages
1. In **Settings → Pages**, choose **Deploy from a branch**.
2. Select the branch (usually `main`) and root folder `/`.
3. Save. GitHub Pages will publish the site.
4. The site uses normal static folders, so clean URLs work directly without a SPA router.

## Notes
- No stock images — all screenshots are real WallFall captures.
- The site is vanilla HTML/CSS/JS (no build step). `main.js` implements the intro loader, the off-canvas staggered menu, the split-flap hero text, and the scroll-expand cinematic section.
- Support: support.doe.studio@gmail.com
