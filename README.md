# Binaire — Streaming UI

A Netflix-style browsing app built for the Binaire frontend assessment. Browse titles, search by name/ID/year, save a watchlist, and sign in with Firebase.

**Live demo:** [binaire-netlify-movie-app.netlify.app](https://binaire-netlify-movie-app.netlify.app)

---

## Screenshots

### Auth

<p align="center">
  <img src="docs/screenshots/login.png" alt="Sign in" width="700" />
  <br /><sub>Sign in</sub>
</p>

<p align="center">
  <img src="docs/screenshots/signup.png" alt="Sign up" width="700" />
  <br /><sub>Sign up</sub>
</p>

### Home & browse

<p align="center">
  <img src="docs/screenshots/home.png" alt="Home hero" width="700" />
  <br /><sub>Hero</sub>
</p>

<p align="center">
  <img src="docs/screenshots/content-rows.png" alt="Content rows" width="700" />
  <br /><sub>Content rows</sub>
</p>

<p align="center">
  <img src="docs/screenshots/browse.png" alt="TV Shows" width="700" />
  <br /><sub>TV Shows</sub>
</p>

<p align="center">
  <img src="docs/screenshots/watchlist-tooltip.png" alt="Watchlist tooltip" width="700" />
  <br /><sub>Add to list</sub>
</p>

### Title details

<p align="center">
  <img src="docs/screenshots/detail-modal.png" alt="Details modal" width="700" />
  <br /><sub>Details modal</sub>
</p>

<p align="center">
  <img src="docs/screenshots/my-list-button.png" alt="In My List" width="700" />
  <br /><sub>In My List</sub>
</p>

<p align="center">
  <img src="docs/screenshots/profile-modal.png" alt="Profile modal" width="700" />
  <br /><sub>From profile</sub>
</p>

### Search

<p align="center">
  <img src="docs/screenshots/search.png" alt="Search" width="700" />
  <br /><sub>Empty state</sub>
</p>

<p align="center">
  <img src="docs/screenshots/search-id.png" alt="Search by ID" width="700" />
  <br /><sub>ID lookup</sub>
</p>

### Profile & offline

<p align="center">
  <img src="docs/screenshots/profile.png" alt="Profile" width="700" />
  <br /><sub>My List</sub>
</p>

<p align="center">
  <img src="docs/screenshots/sign-out.png" alt="Sign out" width="700" />
  <br /><sub>Sign out</sub>
</p>

<p align="center">
  <img src="docs/screenshots/offline-mode.png" alt="Offline mode" width="700" />
  <br /><sub>Offline</sub>
</p>

<p align="center">
  <img src="docs/screenshots/back-online.png" alt="Back online" width="700" />
  <br /><sub>Back online</sub>
</p>

### Footer

<p align="center">
  <img src="docs/screenshots/footer.png" alt="Footer" width="700" />
</p>

---

## What it does

- Hero banner + horizontal content rows (trending, popular, classics)
- Full browse grid with infinite scroll
- Search by **title**, **IMDb ID** (`tt0903747`), or **year**
- Firebase email/password auth — login, signup, protected profile
- Watchlist & watch history (local storage)
- Offline-friendly caching when the network drops

---

## Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · React Router · Firebase Auth · [IMDbAPI](https://imdbapi.dev/)

---

## Run locally

```bash
npm install
cp .env.example .env   # add Firebase keys + API URL
npm run dev
```

`.env` needs:

```env
VITE_API_BASE_URL=https://api.imdbapi.dev
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

Build: `npm run build`

---

## Deploy

Hosted on **Netlify** with env vars matching `.env.example`. SPA redirects are in `public/_redirects` and `netlify.toml`.

---

## Data

Title metadata comes from [IMDbAPI](https://imdbapi.dev/) (`/titles`, `/search/titles`, `/titles/{id}`).
