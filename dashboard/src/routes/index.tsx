import { createFileRoute } from "@tanstack/react-router";
import { Activity, Cpu, HardDrive, MemoryStick, Server, Shield, Network, FolderTree, Terminal, GitBranch } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { ServiceCard } from "@/components/dashboard/ServiceCard";
import { Section } from "@/components/dashboard/Section";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "server.jedbillyb.com — Absolute Server Manifest" },
      {
        name: "description",
        content:
          "Full-stack audit of server.jedbillyb.com — services, processes, nginx routing, SSL, firewall and filesystem.",
      },
      { property: "og:title", content: "server.jedbillyb.com — Absolute Server Manifest" },
      {
        property: "og:description",
        content: "Live manifest of every systemd service, PM2 process, tmux session and nginx route.",
      },
    ],
  }),
  component: Index,
});

const systemdServices = [
  {
    name: "ticker-svg",
    status: "active" as const,
    port: 3002,
    meta: [
      { label: "Working Dir", value: "/home/ubuntu/ticker-svg/" },
      { label: "Git Source", value: "github.com/jedbillyb/stock-banner-svg-generator" },
    ],
    details: [
      {
        summary: "Unit File & Environment",
        code: `[Unit]
Description=ticker-svg

[Service]
WorkingDirectory=/home/ubuntu/ticker-svg
ExecStart=/usr/bin/node server.js
EnvironmentFile=/home/ubuntu/ticker-svg/.env`,
        envKeys: "PORT, TWELVE_DATA_API_KEY, NODE_ENV",
      },
    ],
  },
  {
    name: "gateway",
    status: "active" as const,
    port: 8080,
    meta: [
      { label: "Working Dir", value: "/home/ubuntu/gateway" },
      { label: "Visibility", value: "Local Only" },
    ],
    details: [
      {
        summary: "Unit File Content",
        code: `[Unit]
Description=Node.js API Gateway

[Service]
User=root
WorkingDirectory=/home/ubuntu/gateway
ExecStart=/usr/bin/node index.js`,
      },
    ],
  },
  {
    name: "github-discord-bot",
    status: "active" as const,
    port: 3000,
    meta: [{ label: "Working Dir", value: "/home/ubuntu/github-discord-bot" }],
    details: [
      {
        summary: "Unit File & Env Keys",
        code: `[Unit]
Description=GitHub → Discord Notification Bot

[Service]
WorkingDirectory=/home/ubuntu/github-discord-bot
ExecStart=/usr/bin/node src/server.js
EnvironmentFile=/home/ubuntu/github-discord-bot/.env`,
        envKeys: "DISCORD_WEBHOOK_URL, GITHUB_WEBHOOK_SECRET, PORT",
      },
    ],
  },
  {
    name: "profile-server",
    status: "active" as const,
    port: 3003,
    meta: [{ label: "Git Source", value: "github.com/jedbillyb/jedbillyb" }],
    details: [
      {
        summary: "Unit File Content",
        code: `[Unit]
Description=Personal Profile Table Server

[Service]
WorkingDirectory=/home/ubuntu/profile-server
ExecStart=/usr/bin/node server.js
EnvironmentFile=/home/ubuntu/profile-server/.env`,
      },
    ],
  },
  {
    name: "minecraft",
    status: "active" as const,
    statusLabel: "ACTIVE · TMUX",
    port: 25565,
    meta: [{ label: "Launch Script", value: "/home/ubuntu/start-minecraft.sh" }],
    details: [
      {
        summary: "Launch Script",
        code: `java -Xms10G -Xmx10G -XX:+UseG1GC ... -jar paper-1.21.11.jar nogui`,
      },
    ],
  },
];

const pm2Services = [
  {
    name: "discord-vc-bot",
    status: "active" as const,
    statusLabel: "ACTIVE · PM2",
    meta: [
      { label: "PM2 ID", value: "0" },
      { label: "Working Dir", value: "/home/ubuntu/discord-vc-bot" },
      { label: "Start Cmd", value: "node bot.js" },
    ],
    details: [
      {
        summary: "Live Process Metrics",
        code: `status   : online
cpu      : 0.1%
memory   : 80.9 MB`,
      },
    ],
  },
  {
    name: "vehicle-api",
    status: "active" as const,
    statusLabel: "ACTIVE · PM2",
    meta: [
      { label: "PM2 ID", value: "1" },
      { label: "Working Dir", value: "/home/ubuntu/nz-vehicle-finder" },
      { label: "Start Cmd", value: "npx tsx server/index.ts" },
      { label: "Git Source", value: "github.com/jedbillyb/nz-vehicle-finder" },
    ],
    details: [
      {
        summary: "Live Process Metrics",
        code: `status   : online
cpu      : 0%
memory   : 59.0 MB`,
      },
    ],
  },
];

const nginxRoutes = [
  { domain: "vehiclefinder.co.nz", path: "/", target: "root ~/nz-vehicle-finder/dist/", kind: "static" },
  { domain: "vehiclefinder.co.nz", path: "/api/", target: "proxy → :3001", kind: "proxy" },
  { domain: "server.jedbillyb.com", path: "/setup", target: "proxy → :3003", kind: "proxy" },
  { domain: "server.jedbillyb.com", path: "/projects", target: "proxy → :3003", kind: "proxy" },
  { domain: "server.jedbillyb.com", path: "/banner", target: "proxy → :3002", kind: "proxy" },
];

const filesystem = [
  { path: "minecraft/", size: "4.7G", bar: 100 },
  { path: "nz-vehicle-finder/", size: "5.5G", bar: 100 },
  { path: "discord-vc-bot/", size: "27M", bar: 12 },
  { path: "ticker-svg/", size: "16M", bar: 8 },
  { path: "gateway/", size: "8.2M", bar: 5 },
  { path: "github-discord-bot/", size: "4.7M", bar: 3 },
  { path: "profile-server/", size: "4.8M", bar: 3 },
];

function Index() {
  return (
    <main className="relative min-h-screen">
      {/* Faint grid background */}
      <div className="pointer-events-none fixed inset-0 grid-bg opacity-[0.15]" />

      <div className="relative mx-auto max-w-6xl px-6 py-12 lg:px-10 lg:py-16">
        {/* Top bar */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-success text-success" />
            <span>connection: <span className="text-success">stable</span></span>
            <span className="text-border">·</span>
            <span>region: ap-southeast-2</span>
          </div>
          <div>manifest updated: <span className="text-foreground">Sat 18 Apr 2026 02:23 UTC</span></div>
        </div>

        {/* Hero */}
        <header className="relative overflow-hidden rounded-xl border border-border bg-card/50 p-8 lg:p-12">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative">
            <div className="mb-4 flex items-center gap-2 font-mono text-xs text-primary">
              <Terminal className="h-3.5 w-3.5" />
              <span>~/manifest --verbose</span>
            </div>
            <h1 className="font-mono text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
              Absolute Server <span className="text-primary">Manifest</span>
            </h1>
            <p className="mt-4 max-w-2xl font-mono text-sm text-muted-foreground lg:text-base">
              Full-stack audit of{" "}
              <code className="rounded border border-border bg-code px-2 py-0.5 text-foreground">
                server.jedbillyb.com
              </code>
              {" "}— hardware, security &amp; services.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2 font-mono text-xs">
              <span className="rounded-full border border-border bg-card px-3 py-1 text-muted-foreground">
                Ubuntu 22.04 LTS
              </span>
              <span className="rounded-full border border-border bg-card px-3 py-1 text-muted-foreground">
                kernel 6.5.0
              </span>
              <span className="rounded-full border border-border bg-card px-3 py-1 text-muted-foreground">
                AMD EPYC · 4 vCPU
              </span>
              <span className="rounded-full border border-success/30 bg-success/5 px-3 py-1 text-success">
                ● all systems operational
              </span>
            </div>

            {/* Quick links */}
            <div className="mt-6 flex flex-wrap gap-2 font-mono text-xs">
              <a href="https://github.com/jedbillyb" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary">
                <GitBranch className="h-3 w-3" /> github.com/jedbillyb
              </a>
              <a href="https://server.jedbillyb.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary">
                <Network className="h-3 w-3" /> server.jedbillyb.com
              </a>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-muted-foreground">
                <Terminal className="h-3 w-3" />
                <span>ssh ubuntu@server.jedbillyb.com</span>
              </span>
            </div>
          </div>
        </header>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
          <StatCard label="Uptime" value="1d 21h 58m" hint="last reboot · Apr 16" accent="primary" />
          <StatCard label="RAM Used / Total" value="11.8 / 24.7 GB" hint="48% utilised" accent="success" />
          <StatCard label="Disk Usage" value="21 / 45 GB" hint="45% · root volume" accent="warning" />
          <StatCard label="Network I/O" value="↓ 142 MB/s" hint="↑ 38 MB/s · eth0" accent="primary" />
        </div>

        {/* I. Systemd */}
        <Section index="01" title="Systemd Service Catalog" description="Long-running services managed by systemd.">
          <div className="grid gap-5 lg:grid-cols-2">
            {systemdServices.map((s) => (
              <ServiceCard key={s.name} {...s} />
            ))}
          </div>
        </Section>

        {/* II. PM2 */}
        <Section index="02" title="PM2 & Process Details" description="Node processes supervised by PM2.">
          <div className="grid gap-5 lg:grid-cols-2">
            {pm2Services.map((s) => (
              <ServiceCard key={s.name} {...s} />
            ))}
          </div>
        </Section>

        {/* III. Tmux */}
        <Section index="03" title="Tmux Sessions" description="Detached terminal sessions held in memory.">
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="mb-3 flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <Terminal className="h-3.5 w-3.5 text-primary" />
              tmux ls
            </div>
            <pre className="overflow-x-auto rounded-md border border-border bg-code p-4 font-mono text-sm leading-relaxed">
              <span className="text-success">discordbot</span>
              <span className="text-muted-foreground">: 1 windows  (created Wed Apr 16 09:14:22 2026)</span>
              {"\n"}
              <span className="text-success">minecraft</span>
              <span className="text-muted-foreground">:  1 windows  (created Wed Apr 16 09:18:01 2026)</span>
            </pre>
          </div>
        </Section>

        {/* IV. Nginx */}
        <Section index="04" title="Nginx Routing Map" description="Reverse proxy &amp; static asset routes.">
          <div className="overflow-hidden rounded-lg border border-border bg-card">
            <div className="grid grid-cols-[1.5fr_1fr_2fr] gap-4 border-b border-border bg-card px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              <div>Domain</div>
              <div>Path</div>
              <div>Target</div>
            </div>
            {nginxRoutes.map((r, i) => (
              <div
                key={i}
                className="grid grid-cols-[1.5fr_1fr_2fr] gap-4 border-b border-border/60 px-5 py-3 font-mono text-xs transition-colors last:border-0 hover:bg-accent/30"
              >
                <div className="flex items-center gap-2">
                  <Network className="h-3 w-3 text-primary" />
                  <span className="text-foreground">{r.domain}</span>
                </div>
                <div className="text-muted-foreground">{r.path}</div>
                <div className={r.kind === "static" ? "text-warning" : "text-success"}>
                  {r.target}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* V. Security */}
        <Section index="05" title="Security, SSL & Cron" description="Certificates, firewall rules &amp; scheduled jobs.">
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="mb-4 flex items-center gap-2">
                <Shield className="h-4 w-4 text-success" />
                <h3 className="font-mono text-sm font-semibold">SSL Certificate</h3>
                <StatusBadge status="active" label="VALID" />
              </div>
              <dl className="space-y-2 font-mono text-xs">
                <div className="flex justify-between gap-4 border-b border-border/60 pb-2">
                  <dt className="text-muted-foreground">Domains</dt>
                  <dd className="text-right text-foreground">vehiclefinder.co.nz<br />server.jedbillyb.com</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-border/60 pb-2">
                  <dt className="text-muted-foreground">Expires</dt>
                  <dd className="text-warning">July 2026</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Issuer</dt>
                  <dd className="text-foreground">Let's Encrypt</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-lg border border-border bg-card p-5">
              <div className="mb-4 flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                <h3 className="font-mono text-sm font-semibold">IPTables Firewall</h3>
              </div>
              <pre className="overflow-x-auto rounded-md border border-border bg-code p-3 font-mono text-xs leading-relaxed">
{`  1  ACCEPT  tcp  dpt:3000
  3  ACCEPT  tcp  dpt:443
  7  ACCEPT  tcp  dpt:80
  8  ACCEPT  udp  dpt:25565
 17  ACCEPT  tcp  dpt:22`}
              </pre>
            </div>

            <div className="rounded-lg border border-border bg-card p-5 lg:col-span-2">
              <div className="mb-4 flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-primary" />
                <h3 className="font-mono text-sm font-semibold">Cron Jobs</h3>
              </div>
              <dl className="grid gap-3 font-mono text-xs sm:grid-cols-2">
                <div className="rounded-md border border-border bg-code p-3">
                  <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">/etc/cron.d/</dt>
                  <dd className="mt-1 text-foreground">certbot, e2scrub_all</dd>
                </div>
                <div className="rounded-md border border-border bg-code p-3">
                  <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">Ubuntu Crontab</dt>
                  <dd className="mt-1 text-foreground">Hourly · regenerate-manifest.sh</dd>
                </div>
              </dl>
            </div>
          </div>
        </Section>

        {/* VI. Filesystem */}
        <Section index="06" title="Filesystem Map" description="/home/ubuntu — sorted by footprint.">
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="mb-4 flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <FolderTree className="h-3.5 w-3.5 text-primary" />
              du -sh /home/ubuntu/*
            </div>
            <ul className="space-y-2">
              {filesystem.map((f) => (
                <li key={f.path} className="grid grid-cols-[200px_1fr_60px] items-center gap-4 font-mono text-xs">
                  <span className="text-foreground">├── {f.path}</span>
                  <span className="relative h-2 overflow-hidden rounded-full bg-code">
                    <span
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-success"
                      style={{ width: `${f.bar}%` }}
                    />
                  </span>
                  <span className="text-right text-muted-foreground">{f.size}</span>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        {/* VII. Recent Deploys */}
        <Section index="07" title="Recent Deploys" description="Latest pushes from connected GitHub repos.">
          <div className="overflow-hidden rounded-lg border border-border bg-card">
            {[
              { repo: "nz-vehicle-finder", sha: "a3f1c92", msg: "fix: handle null odometer values", time: "14m ago", branch: "main", ok: true },
              { repo: "ticker-svg", sha: "8b2e4d1", msg: "feat: add AAPL gradient banner preset", time: "2h ago", branch: "main", ok: true },
              { repo: "github-discord-bot", sha: "1f9c0aa", msg: "chore: bump discord.js to 14.16", time: "1d ago", branch: "main", ok: true },
              { repo: "jedbillyb", sha: "5e7b3c8", msg: "wip: refactor profile table queries", time: "3d ago", branch: "dev", ok: true },
            ].map((d, i) => (
              <div key={i} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-border/60 px-5 py-3 font-mono text-xs transition-colors last:border-0 hover:bg-accent/30">
                <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-success text-success" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-foreground">{d.repo}</span>
                    <span className="rounded border border-border bg-code px-1.5 py-0.5 text-[10px] text-primary">{d.sha}</span>
                    <span className="text-[10px] text-muted-foreground">{d.branch}</span>
                  </div>
                  <div className="mt-0.5 truncate text-muted-foreground">{d.msg}</div>
                </div>
                <span className="text-right text-muted-foreground">{d.time}</span>
              </div>
            ))}
          </div>
        </Section>

        <footer className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6 font-mono text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Server className="h-3.5 w-3.5 text-primary" />
            <span>generated by <span className="text-foreground">regenerate-manifest.sh</span></span>
          </div>
          <div className="cursor-blink">end_of_manifest</div>
        </footer>
      </div>
    </main>
  );
}
