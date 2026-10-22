# Kova

A mobile-first crypto wallet web app, built as a complete product: onboarding, the wallet itself,
and the back office the wallet company runs on.

> **Everything is mocked.** Kova never creates real keys, never touches real funds and never
> connects to a blockchain. Seed phrases, addresses, balances and transactions are fake.
> The only live data is market prices from the free [CoinGecko API](https://www.coingecko.com/en/api).

## Features

**Onboarding:** welcome, create wallet, show + confirm seed phrase, import wallet, set PIN

**Wallet:** home with total balance and portfolio chart, asset detail, send, receive (QR code),
swap, transaction history with filters, market & explore, notifications, settings

**Admin:** overview dashboard, user list, user detail with KYC status, transaction monitoring,
fee & supported-asset settings, support tickets

## Tech stack

| Concern               | Tool                       |
| --------------------- | -------------------------- |
| Build / dev server    | [Vite 7](https://vite.dev) |
| UI                    | React 19 + TypeScript      |
| Styling               | Tailwind CSS v4            |
| Routing               | React Router               |
| Server data & caching | TanStack Query             |
| Local state           | Zustand                    |
| Charts                | Recharts                   |
| QR codes              | qrcode.react               |
| Linting / formatting  | ESLint + Prettier          |

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:5173. The wallet is designed for phone widths. On desktop it renders inside
a centered phone-sized column. The admin back office lives at `/admin`.

## Install it like an app (PWA)

Kova is a Progressive Web App: open the deployed link on your phone and

- **Android (Chrome):** tap **Install** when prompted, or ⋮ → **Add to Home screen**
- **iPhone (Safari):** tap **Share** → **Add to Home Screen**

It then launches full screen with its own icon, works offline (last known prices are cached),
and updates itself in the background.

> The service worker only runs in production builds. Use `npm run build && npm run preview` to test it locally.

## Scripts

| Command           | What it does                                     |
| ----------------- | ------------------------------------------------ |
| `npm run dev`     | Start the dev server with hot reload             |
| `npm run build`   | Type-check and build for production into `dist/` |
| `npm run preview` | Serve the production build locally               |
| `npm run lint`    | Lint with ESLint                                 |
| `npm run format`  | Format all files with Prettier                   |

## Project structure

```
src/
  app/          router, providers, layouts
  pages/        one file per screen (onboarding/, wallet/, admin/)
  components/   shared UI building blocks
  lib/          API clients, formatters, helpers
  store/        Zustand stores (mock wallet state)
  mocks/        seeded fake data
```
