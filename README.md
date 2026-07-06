# Binaire — Streaming UI

A Netflix-style browsing app built for the Binaire frontend assessment. Browse titles, search by name/ID/year, save a watchlist, and sign in with Firebase.

**Live demo:** [binaire-netlify-movie-app.netlify.app](https://binaire-netlify-movie-app.netlify.app)

---

## Screenshots

### Auth

| Sign in | Sign up |
|:---:|:---:|
| ![Sign in](./docs/screenshots/login.png) | ![Sign up](./docs/screenshots/signup.png) |

### Home & browse

| Hero | Content rows |
|:---:|:---:|
| ![Home hero](./docs/screenshots/home.png) | ![Content rows](./docs/screenshots/content-rows.png) |

| TV Shows | Add to list |
|:---:|:---:|
| ![TV Shows](./docs/screenshots/browse.png) | ![Watchlist tooltip](./docs/screenshots/watchlist-tooltip.png) |

### Title details

| Details modal | In My List |
|:---:|:---:|
| ![Details modal](./docs/screenshots/detail-modal.png) | ![In My List](./docs/screenshots/my-list-button.png) |

| From profile |
|:---:|
| ![Profile modal](./docs/screenshots/profile-modal.png) |

### Search

| Empty state | ID lookup |
|:---:|:---:|
| ![Search](./docs/screenshots/search.png) | ![Search by ID](./docs/screenshots/search-id.png) |

### Profile & offline

| My List | Sign out |
|:---:|:---:|
| ![Profile](./docs/screenshots/profile.png) | ![Sign out](./docs/screenshots/sign-out.png) |

| Offline | Back online |
|:---:|:---:|
| ![Offline mode](./docs/screenshots/offline-mode.png) | ![Back online](./docs/screenshots/back-online.png) |

### Footer

![Footer](./docs/screenshots/footer.png)

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
