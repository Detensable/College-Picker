# College Picker — Find Your Best Fit

A web app where students input their stats (GPA, SAT/ACT, interests, location, budget) and get personalized college recommendations ranked by fit.

## Features

- **Input form**: GPA (to hundredths), SAT/ACT, searchable intended major (100+ options), location preference, budget (including "Doesn't matter"), optional extracurriculars
- **College Scorecard API**: Uses live data when an API key is set; falls back to built-in JSON
- **Recommendation engine**: Scores colleges on stats match, cost, major strength, and location
- **Results page**: Top 10 matches with fit score (%), why it matches, and links to college sites
- **Export**: Download results as a text file

## Tech Stack

- **Frontend**: React 18 + Vite
- **Data**: College Scorecard API (api.data.gov) or fallback JSON (~130 colleges)
- **Hosting**: Static — works on GitHub Pages, Replit, Vercel, Netlify

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build for Production

```bash
npm run build
```

Output is in `dist/`. Serve that folder statically.

## Deployment

### GitHub Pages

1. In your repo: Settings → Pages → Source: **GitHub Actions**
2. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci && npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

3. Push; the site will be at `https://<username>.github.io/<repo>/`

### Replit

1. Import the repo
2. Add a `.replit` file with `run = "npm run dev"`
3. Replit will run the dev server and provide a URL

## College Scorecard API

For live, updated college data:

1. Get a free API key at [api.data.gov/signup](https://api.data.gov/signup/)
2. Copy `.env.example` to `.env`
3. Set `VITE_COLLEGE_SCORECARD_API_KEY=your_key`

Without an API key, the app falls back to built-in data (`src/data/colleges.json`, ~130 colleges).

## License

MIT
