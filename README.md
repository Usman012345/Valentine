# Valentine Cat Meme (MERN on Vercel Free Tier)

This project is set up for **Vercel free tier**:
- **React frontend** (Vite)
- **Node + Express API** (Vercel Serverless Functions in `/api`)
- Optional **MongoDB** (MongoDB Atlas + Mongoose) so you can add new memes later.

## 1) Run locally

```bash
npm install
npm run dev
```

Open the URL shown by Vite (usually http://localhost:5173).

## 2) Deploy to Vercel (free)

1. Push this project to GitHub (or GitLab/Bitbucket).
2. In Vercel, **New Project** → import the repo.
3. Deploy.

### Optional: Connect MongoDB Atlas
If you want to **add memes later**, create a free MongoDB Atlas cluster and add this env var in Vercel:

- `MONGODB_URI` = your Atlas connection string
- (optional) `MONGODB_DB` = database name (e.g. `valentine`)

Without MongoDB, the site still works using the default 3 images.

## 3) API usage

### Get memes for the “Yes” gallery
`GET /api/memes`

### Add a new meme (requires MongoDB configured)
`POST /api/memes`
```json
{ "title": "New meme 💞", "src": "https://example.com/meme.jpg" }
```

> Tip: You can also point `src` to a file you put in `/public`, like `/my-new-meme.jpg`.

## Notes
- The “No” button moves on hover.
- After **5 hovers** (or clicking “No”), it opens the `nope.jpeg` modal and resets the counter.
- Everything is responsive by default (mobile-friendly layout + grid gallery).
