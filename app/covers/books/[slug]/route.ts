type DisplayCover = {
  title: string;
  author: string;
  palette: {
    base: string;
    accent: string;
    light: string;
  };
};

const DISPLAY_COVERS: Record<string, DisplayCover> = {
  "subtle-art": {
    title: "The Subtle Art of Not Giving a F*ck",
    author: "Mark Manson",
    palette: { base: "#f97316", accent: "#111827", light: "#fff7ed" },
  },
  "and-then-there-were-none": {
    title: "And Then There Were None",
    author: "Agatha Christie",
    palette: { base: "#1f2937", accent: "#f59e0b", light: "#f8fafc" },
  },
  "none-of-this-is-true": {
    title: "None of This Is True",
    author: "Lisa Jewell",
    palette: { base: "#7c2d12", accent: "#0f172a", light: "#fff7ed" },
  },
  "gone-girl": {
    title: "Gone Girl",
    author: "Gillian Flynn",
    palette: { base: "#334155", accent: "#e11d48", light: "#f8fafc" },
  },
  "pride-and-prejudice": {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    palette: { base: "#0f766e", accent: "#f8fafc", light: "#f0fdfa" },
  },
  "jane-eyre": {
    title: "Jane Eyre",
    author: "Charlotte Bronte",
    palette: { base: "#7f1d1d", accent: "#fbbf24", light: "#fff7ed" },
  },
  "wuthering-heights": {
    title: "Wuthering Heights",
    author: "Emily Bronte",
    palette: { base: "#14532d", accent: "#fde68a", light: "#f7fee7" },
  },
  frankenstein: {
    title: "Frankenstein",
    author: "Mary Shelley",
    palette: { base: "#374151", accent: "#22c55e", light: "#f0fdf4" },
  },
  dracula: {
    title: "Dracula",
    author: "Bram Stoker",
    palette: { base: "#111827", accent: "#dc2626", light: "#fee2e2" },
  },
  "the-picture-of-dorian-gray": {
    title: "The Picture of Dorian Gray",
    author: "Oscar Wilde",
    palette: { base: "#312e81", accent: "#a7f3d0", light: "#eef2ff" },
  },
  "midnights-children": {
    title: "Midnight's Children",
    author: "Salman Rushdie",
    palette: { base: "#0f172a", accent: "#38bdf8", light: "#e0f2fe" },
  },
  "the-god-of-small-things": {
    title: "The God of Small Things",
    author: "Arundhati Roy",
    palette: { base: "#065f46", accent: "#f59e0b", light: "#ecfdf5" },
  },
  "the-white-tiger": {
    title: "The White Tiger",
    author: "Aravind Adiga",
    palette: { base: "#78350f", accent: "#f8fafc", light: "#fffbeb" },
  },
  shame: {
    title: "Shame",
    author: "J. M. Coetzee",
    palette: { base: "#4c1d95", accent: "#f9a8d4", light: "#faf5ff" },
  },
  gitanjali: {
    title: "Gitanjali",
    author: "Rabindranath Tagore",
    palette: { base: "#92400e", accent: "#fef3c7", light: "#fffbeb" },
  },
  "the-ministry-of-utmost-happiness": {
    title: "The Ministry of Utmost Happiness",
    author: "Arundhati Roy",
    palette: { base: "#164e63", accent: "#f0abfc", light: "#ecfeff" },
  },
  "the-satanic-verses": {
    title: "The Satanic Verses",
    author: "Salman Rushdie",
    palette: { base: "#581c87", accent: "#fb7185", light: "#faf5ff" },
  },
  "the-moor-s-last-sigh": {
    title: "The Moor's Last Sigh",
    author: "Salman Rushdie",
    palette: { base: "#1e3a8a", accent: "#fdba74", light: "#eff6ff" },
  },
};

export function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  return params.then(({ slug }) => {
    const cover = DISPLAY_COVERS[slug];

    if (!cover) {
      return new Response("Cover not found", { status: 404 });
    }

    return new Response(renderDisplayCover(cover), {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Type": "image/svg+xml; charset=utf-8",
      },
    });
  });
}

function renderDisplayCover({ title, author, palette }: DisplayCover) {
  const titleLines = wrapText(title, 18, 4);
  const titleTspans = titleLines
    .map(
      (line, index) =>
        `<tspan x="70" dy="${index === 0 ? 0 : 72}">${escapeXml(line)}</tspan>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="900" viewBox="0 0 600 900" role="img" aria-labelledby="title desc">
  <title id="title">${escapeXml(title)} display cover</title>
  <desc id="desc">Books2Buy generated display cover for ${escapeXml(title)} by ${escapeXml(author)}.</desc>
  <defs>
    <linearGradient id="paper" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="${palette.light}"/>
      <stop offset="58%" stop-color="${palette.base}"/>
      <stop offset="100%" stop-color="${palette.accent}"/>
    </linearGradient>
    <radialGradient id="glow" cx="78%" cy="16%" r="45%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#020617" flood-opacity="0.22"/>
    </filter>
  </defs>
  <rect width="600" height="900" rx="34" fill="url(#paper)"/>
  <rect width="600" height="900" rx="34" fill="url(#glow)"/>
  <path d="M54 72h492v756H54z" fill="none" stroke="#ffffff" stroke-opacity="0.44" stroke-width="3"/>
  <path d="M90 116h116M90 142h72" stroke="#ffffff" stroke-opacity="0.75" stroke-width="10" stroke-linecap="round"/>
  <g filter="url(#shadow)">
    <circle cx="454" cy="178" r="54" fill="#ffffff" fill-opacity="0.18"/>
    <circle cx="454" cy="178" r="24" fill="${palette.accent}" fill-opacity="0.72"/>
  </g>
  <text x="70" y="342" fill="#ffffff" font-family="Georgia, 'Times New Roman', serif" font-size="64" font-weight="700" letter-spacing="0">
    ${titleTspans}
  </text>
  <text x="70" y="678" fill="#ffffff" fill-opacity="0.9" font-family="Arial, sans-serif" font-size="30" font-weight="700" letter-spacing="1.5">
    ${escapeXml(author).toUpperCase()}
  </text>
  <path d="M70 744h250" stroke="#ffffff" stroke-opacity="0.55" stroke-width="6" stroke-linecap="round"/>
  <text x="70" y="804" fill="#ffffff" fill-opacity="0.8" font-family="Arial, sans-serif" font-size="22" font-weight="700" letter-spacing="1.8">
    BOOKS2BUY DISPLAY COVER
  </text>
</svg>`;
}

function wrapText(value: string, maxLineLength: number, maxLines: number) {
  const words = value.split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (nextLine.length > maxLineLength && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = nextLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.slice(0, maxLines);
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
