import express from 'express';
const app = express();
const PORT = process.env.PORT || 3002;

// Global — change these to resize the whole card
const W        = 990; // was 480
const HEADER_H = 36;
const ROW_H    = 36;

const MY_PROJECTS = [
  {
    name: 'nz-vehicle-finder',
    stack: 'TypeScript',
    desc: 'A powerful, high-performance search application for the New Zealand Motor Vehicle Register, featuring a clean terminal-inspired UI.'
  },
  {
    name: 'ghook',
    stack: 'JavaScript',
    desc: 'Bridge your GitHub repos to Discord! Get instant notifications for pushes, stars, issues, PRs, and more via rich embeds.'
  },
  {
    name: 'desmos-text-input-output-tool',
    stack: 'JavaScript',
    desc: 'Import/export Desmos graphs as JSON - Chrome & Firefox extension'
  },
  {
    name: 'jedbillyb.com',
    stack: 'TypeScript',
    desc: 'My personal website'
  },
  {
    name: 'vc-discord-notification-bot',
    stack: 'JavaScript',
    desc: 'Discord bot that sends notifications when someone joins, leaves, or switches voice channels'
  },
  {
    name: 'ticker-svg-generator',
    stack: 'JavaScript',
    desc: 'Self-hosted stock ticker banner for GitHub READMEs'
  }
];

const FONT = `-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif`;
const PAD  = 12;

function escapeXml(s) {
  return s.replace(/[<>&"']/g, c =>
    ({ '<':'&lt;', '>':'&gt;', '&':'&amp;', '"':'&quot;', "'":'&apos;' }[c])
  );
}

app.get('/projects', (req, res) => {
  const H       = HEADER_H + MY_PROJECTS.length * ROW_H;

  const COLS = [
    { label: 'Project',      x: 0,   w: 120, fill: '#FF0000', weight: '600' },
    { label: 'Stack',        x: 197, w: 144, fill: '#c9d1d9', weight: '400' },
    { label: 'What it does', x: 285, w: 336, fill: '#c9d1d9', weight: '400' }, // 480→600, extra 120 all goes here
  ];

  // Per-column clip paths — tall enough to cover any y-translate during animation
  const clipPaths = COLS.map((c, i) => `
    <clipPath id="c${i}">
      <rect x="${c.x + PAD}" y="-${H}" width="${c.w - PAD * 2}" height="${H * 4}"/>
    </clipPath>`
  ).join('');

  // Header row
  const headerCells = COLS.map((c, i) => `
    <text clip-path="url(#c${i})"
      x="${c.x + PAD}" y="${HEADER_H / 2 + 4}"
      font-family="${FONT}" font-size="10" font-weight="600"
      fill="#8b949e" text-anchor="start">
      ${escapeXml(c.label.toUpperCase())}
    </text>`
  ).join('');

  // Data rows — each in a <g> with SMIL slideUp + fade
  const rows = MY_PROJECTS.map((p, i) => {
    const rowY  = HEADER_H + i * ROW_H;
    const textY = rowY + ROW_H / 2 + 4;
    const begin = `${(0.05 + i * 0.04).toFixed(2)}s`; // was 0.08
    const vals  = [p.name, p.stack, p.desc];

    const texts = COLS.map((c, ci) => `
      <text clip-path="url(#c${ci})"
        x="${c.x + PAD}" y="${textY}"
        font-family="${FONT}" font-size="12" font-weight="${c.weight}"
        fill="${c.fill}" text-anchor="start">
        ${escapeXml(vals[ci])}
      </text>`
    ).join('');

    return `
    <g opacity="0">
      <rect x="0" y="${rowY}" width="${W}" height="${ROW_H}" fill="#151515"/>
      <line x1="0" y1="${rowY + ROW_H}" x2="${W}" y2="${rowY + ROW_H}"
            stroke="#21262d" stroke-width="1"/>
      ${texts}

      <animate attributeName="opacity"
        from="0" to="1"
        begin="${begin}" dur="0.4s" fill="freeze"
        calcMode="spline" keyTimes="0;1" keySplines="0.4 0 0.2 1"/>

      <animateTransform attributeName="transform" type="translate"
        from="0 6" to="0 0" additive="sum"
        begin="${begin}" dur="0.3s" fill="freeze"
        calcMode="spline" keyTimes="0;1" keySplines="0.22 1 0.36 1"/>
    </g>`;
  }).join('');

  const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"
  fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <mask id="card">
      <rect width="${W}" height="${H}" rx="6" ry="6" fill="white"/>
    </mask>
  </defs>

  <g mask="url(#card)">
    <!-- Base background -->
    <rect width="${W}" height="${H}" fill="#151515"/>

    <!-- Header -->
    <rect width="${W}" height="${HEADER_H}" fill="#1c1c1c"/>
    <line x1="0" y1="${HEADER_H}" x2="${W}" y2="${HEADER_H}"
          stroke="#30363d" stroke-width="1"/>
    ${headerCells}

    <!-- Rows -->
    ${rows}
  </g>
</svg>`;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'no-cache, must-revalidate'); // fresh on each README load
  res.send(svg);
});

app.listen(PORT, () => console.log(`running on :${PORT}`));