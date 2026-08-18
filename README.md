# KAMRION website

Static, GitHub Pages-friendly website for KAMRION and WallFall.

## Routes

- `/` — KAMRION homepage
- `/games/wallfall/` — WallFall game page
- `/privacy-policy/` — Privacy Policy
- `/account-deletion/` — WallFall Account Deletion
- `/terms/` — Terms of Service
- `/contact/` — Contact

## Test locally

From this folder, run:

```bash
python -m http.server 8080
```

Then open:

```text
http://localhost:8080/
```

Test each direct route by entering its URL manually:

```text
http://localhost:8080/
http://localhost:8080/games/wallfall/
http://localhost:8080/privacy-policy/
http://localhost:8080/account-deletion/
http://localhost:8080/terms/
http://localhost:8080/contact/
```

The Account Deletion page includes an in-game step flow, the supplied WallFall settings screenshot, data-deletion scope, conservative retention language, moderation/report retention, and a fallback contact section. The website itself does not claim to execute deletion.

## GitHub Pages

Upload the contents of this folder to the repository root. In **Settings → Pages**, select **Deploy from a branch**, choose your publication branch, and select the repository root.

After deployment, verify the published site by opening each route directly. If the repository is a project site rather than a user/organization site, GitHub Pages will place the site under the repository path; the folder-based routes remain the same relative to that site root.

## Before public launch

Replace only the clearly marked official-information placeholders, including:

- `[OFFICIAL EMAIL]`
- `[SUPPORT EMAIL]`
- `[BUSINESS CONTACT]`
- `[OFFICIAL PRIVACY EMAIL]`
- `[PRIVACY CONTACT EMAIL]`
- `[LEGAL ENTITY NAME]`
- `[COMPANY ADDRESS]`
- `[LEGAL / SUPPORT EMAIL]`
- `[SOCIAL LINK]`

Once the official privacy email is provided, change the Account Deletion page's `Request Account Deletion` button from the current internal anchor to a `mailto:` link.

## Assets

WallFall screenshots are stored in `assets/`. Keep the existing filenames or update the image paths in the HTML when replacing them.
