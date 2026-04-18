# server.jedbillyb.com — Absolute Server Manifest

A **Terminal Noir** dashboard that visualizes the full state of `server.jedbillyb.com` — every systemd service, PM2 process, tmux session, nginx route, SSL cert, firewall rule, cron job, filesystem entry, and recent deploy — in one scrollable page.

Built as a static SSR site so the manifest can be regenerated server-side and served straight from nginx.

---

## ✨ Features

- **Live system stats** — uptime, RAM, load average, disk, network I/O, swap
- **Systemd service catalog** — collapsible unit files & env keys
- **PM2 process panel** — live CPU / memory metrics
- **Tmux session list**
- **Nginx routing map** — proxy + static targets
- **Security panel** — SSL cert details, IPTables rules, cron jobs
- **Filesystem map** — `du -sh` with usage bars
- **Recent deploys feed** — repo, SHA, branch, commit message
- Animated status dots, terminal cursor blink, faint grid background
- Fully responsive (2 → 3 column stat grid)

---

## 🛠 Tech stack

- **[TanStack Start](https://tanstack.com/start)** v1 (React 19 + SSR)
- **Vite 7** build pipeline
- **Tailwind CSS v4** with native `@theme` tokens (`oklch` colors)
- **Lucide React** icons
- **Bun** package manager
- **Cloudflare Workers** runtime (via Wrangler)

---

## 🎨 Design system

Defined entirely in `src/styles.css` with semantic tokens:

| Token            | Purpose                                |
| ---------------- | -------------------------------------- |
| `--background`   | `#0d1117` — GitHub dark canvas         |
| `--card`         | `#161b22` — elevated surfaces          |
| `--primary`      | `#58a6ff` — electric blue accents      |
| `--success`      | `#3fb950` — active / online status     |
| `--warning`      | `#d29922` — expiring / at-risk         |
| `--destructive`  | `#f85149` — failures                   |
| `--code-bg`      | `#010409` — code blocks                |
| `--font-mono`    | JetBrains Mono                         |

Custom utilities: `.pulse-dot`, `.cursor-blink`, `.grid-bg`, `.scan-line`.

---

## 🚀 Getting started

```bash
# install
bun install

# dev (http://localhost:3000)
bun run dev

# production build
bun run build

# preview build
bun run preview
```

---

## 📁 Project structure

```
src/
├── routes/
│   ├── __root.tsx           # html shell + global meta
│   └── index.tsx            # the manifest page (all data lives here)
├── components/
│   ├── dashboard/
│   │   ├── ServiceCard.tsx  # collapsible service panel
│   │   ├── StatCard.tsx     # top-row metric tile
│   │   ├── StatusBadge.tsx  # active / inactive pill
│   │   └── Section.tsx      # numbered section header
│   └── ui/                  # shadcn primitives
├── styles.css               # design tokens + utilities
└── router.tsx               # TanStack router config
```

To update the manifest data, edit the arrays at the top of `src/routes/index.tsx` (`systemdServices`, `pm2Services`, `nginxRoutes`, `filesystem`, etc.).

---

## 🔄 Wiring to live server data

Right now the manifest is **statically authored** in the route file. To make it live, you have two options:

1. **Server-side regenerate** — have your existing `regenerate-manifest.sh` write a JSON file, load it in a TanStack `loader`, and rebuild on cron.
2. **Server function** — add a `createServerFn` that shells out to `systemctl`, `pm2 jlist`, `df`, etc., and call it from the route loader.

Option 1 is simpler and cache-friendly; option 2 gives true live data.

---

## 🧑 Author

**Jed Blenkhorn** — Hawkes Bay, NZ
[github.com/jedbillyb](https://github.com/jedbillyb) · [jedbillyb.com](https://jedbillyb.com)

Built with [Lovable](https://lovable.dev).
