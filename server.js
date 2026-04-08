import express from 'express';

const app = express();
const PORT = process.env.PORT || 3002;

const MY_PROJECTS = [
  { name: 'ticker-svg', stack: 'Node.js · Express', desc: 'live animated market ticker for github profiles', link: 'https://github.com/jedbillyb/ticker-svg-generator' },
  { name: 'ghook', stack: 'JavaScript · Express', desc: 'github → discord webhook bridge', link: 'https://github.com/jedbillyb/ghook' },
  { name: 'nz-vehicle-finder', stack: 'React · TS · SQLite', desc: 'search & filter NZ vehicle listings', link: 'https://github.com/jedbillyb/nz-vehicle-finder' },
  { name: 'Desmos-Tool', stack: 'JavaScript', desc: 'chrome/firefox extension for Desmos graphs', link: 'https://github.com/jedbillyb/Desmos-Text-Input-Output-Tool' },
  { name: 'vc-notif-bot', stack: 'JS · Discord.js', desc: 'voice channel join/leave notifications', link: 'https://github.com/jedbillyb/vc-discord-notification-bot' },
  { name: 'faultline mc', stack: 'PaperMC · Shell', desc: 'minecraft smp community server', link: 'https://discord.jedbillyb.com' }
];

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&"']/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '"': return '&quot;';
      case "'": return '&apos;';
    }
  });
}

app.get('/projects', (req, res) => {
  const width = 480;
  const rowHeight = 40;
  const headerHeight = 35;
  const height = headerHeight + (MY_PROJECTS.length * rowHeight) + 15;

  let rows = MY_PROJECTS.map((p, i) => `
    <tr class="project-row" style="animation-delay: ${0.1 + (i * 0.1)}s;">
      <td style="padding: 8px 12px; color: #58a6ff; font-weight: 600; font-size: 12px;">${escapeXml(p.name)}</td>
      <td style="padding: 8px 12px; color: #8b949e; font-size: 11px;">${escapeXml(p.stack)}</td>
      <td style="padding: 8px 12px; color: #c9d1d9; font-size: 13px;">${escapeXml(p.desc)}</td>
    </tr>
  `).join('');

  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml">
          <style>
            @keyframes slideUp {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .container {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
              background: #151515;
              border: 1px solid #30363d;
              border-radius: 6px;
              overflow: hidden;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              text-align: left;
            }
            th {
              background: #1c1c1c;
              color: #8b949e;
              font-size: 10px;
              font-weight: 600;
              text-transform: uppercase;
              padding: 10px 12px;
              border-bottom: 1px solid #30363d;
            }
            .project-row {
              border-bottom: 1px solid #21262d;
              animation: slideUp 0.5s ease-out both;
            }
            .project-row:last-child {
              border-bottom: none;
            }
          </style>
          <div class="container">
            <table>
              <thead>
                <tr>
                  <th style="width: 25%;">Project</th>
                  <th style="width: 25%;">Stack</th>
                  <th style="width: 50%;">What it does</th>
                </tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
            </table>
          </div>
        </div>
      </foreignObject>
    </svg>
  `;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.send(svg);
});

app.listen(PORT, () => {
  console.log(\`Project Table Server running on :\${PORT}\`);
});
