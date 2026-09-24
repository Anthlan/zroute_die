import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const siteDirectory = path.resolve(scriptDirectory, "..");
const repositoryDirectory = path.resolve(siteDirectory, "..");
const outputPath = path.join(siteDirectory, "src", "data", "docs.generated.json");
const galleryDataPath = path.join(siteDirectory, "src", "data", "gallery.generated.json");
const repositoryUrl = "https://github.com/Anthlan/zroute_die";

const baseDocuments = [
  {
    source: "README.md",
    slug: "projekt",
    title: "Über das Archiv",
    section: "Projekt",
    summary: "Zweck, Struktur und Grundidee des öffentlichen DIE-Allianzarchivs.",
  },
  {
    source: "ARCHIVREGELN.md",
    slug: "archivregeln",
    title: "Archivregeln",
    section: "Projekt",
    summary: "Verbindliche Regeln für Ablage, Benennung und Pflege der Inhalte.",
  },
  {
    source: "01_Tips/README.md",
    slug: "tipps",
    title: "Tipps",
    section: "Wissen",
    summary: "Kurze Hinweise, Tricks und Entscheidungshilfen für den Spielalltag.",
  },
  {
    source: "02_Anleitungen/README.md",
    slug: "anleitungen",
    title: "Anleitungen",
    section: "Wissen",
    summary: "Schritt-für-Schritt-Erklärungen für wiederkehrende Abläufe.",
  },
  {
    source: "08_Strategien/README.md",
    slug: "strategien",
    title: "Strategien",
    section: "Wissen",
    summary: "Taktiken und abgestimmte Vorgehensweisen der Allianz.",
  },
  {
    source: "09_Analysen/README.md",
    slug: "analysen",
    title: "Analysen",
    section: "Wissen",
    summary: "Auswertungen, Vergleiche und nachvollziehbare Erkenntnisse.",
  },
  {
    source: "07_Allianz/README.md",
    slug: "allianz",
    title: "Allianz",
    section: "Allianz",
    summary: "Regeln, Rollen und wiederverwendbare Texte der DIE-Allianz.",
  },
  {
    source: "06_Design-Guidelines/README.md",
    slug: "design-guidelines",
    title: "Design-Guidelines",
    section: "Gestaltung",
    summary: "Einstieg in die verbindliche Bildsprache und Textgestaltung.",
  },
  {
    source: "06_Design-Guidelines/DlE-Stil – Chibi-Chatbilder.md",
    slug: "stil-chibi-chatbilder",
    title: "Stil: Chibi-Chatbilder",
    section: "Gestaltung",
    summary: "Format, Aufbau und Wiedererkennungsmerkmale der Chibi-Motive.",
  },
  {
    source: "06_Design-Guidelines/DlE-Stil – Chat-Bilder.md",
    slug: "stil-chatbilder",
    title: "Stil: Chatbilder",
    section: "Gestaltung",
    summary: "Gestaltungsregeln für normale Chatbilder der Allianz.",
  },
  {
    source: "06_Design-Guidelines/DlE-Stil – Avatarbilder.md",
    slug: "stil-avatarbilder",
    title: "Stil: Avatarbilder",
    section: "Gestaltung",
    summary: "Vorgaben für konsistente Avatare und Porträts.",
  },
  {
    source: "06_Design-Guidelines/DlE-Stil – Allianz-Mitteilungen.md",
    slug: "stil-allianz-mitteilungen",
    title: "Stil: Allianz-Mitteilungen",
    section: "Gestaltung",
    summary: "Bildsprache und Aufbau offizieller Mitteilungen.",
  },
  {
    source: "06_Design-Guidelines/DlE – Textformatierung.md",
    slug: "textformatierung",
    title: "Textformatierung",
    section: "Gestaltung",
    summary: "Farben, Hierarchien und Formatierung für Texte im Spiel.",
  },
  {
    source: "03_Avatare/README.md",
    slug: "avatare",
    title: "Avatare",
    section: "Bildarchiv",
    summary: "Ablage und Benennung der persönlichen Avatarbilder.",
  },
  {
    source: "04_Charaktermodelle/README.md",
    slug: "charaktermodelle",
    title: "Charaktermodelle",
    section: "Bildarchiv",
    summary: "Referenzen für Figuren, Kleidung und wiederkehrende Merkmale.",
  },
  {
    source: "05_Chatbilder/README.md",
    slug: "chatbilder",
    title: "Chatbilder",
    section: "Bildarchiv",
    summary: "Regeln und Struktur für die Sammlung der Chatmotive.",
  },
  {
    source: "05_Chatbilder/Chibi/README.md",
    slug: "chibi",
    title: "Chibi-Chatbilder",
    section: "Bildarchiv",
    summary: "Eigener Bereich für kompakte Motive im Chibi-Stil.",
  },
  {
    source: "99_Archiv/README.md",
    slug: "historisches-archiv",
    title: "Historisches Archiv",
    section: "Projekt",
    summary: "Frühere Stände, ersetzte Dateien und historische Referenzen.",
  },
];

const slugify = (value) => value
  .normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "")
  .replaceAll("ß", "ss")
  .replace(/([a-z])([A-Z])/g, "$1-$2")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "")
  .slice(0, 72);

const plainText = (value) => value
  .replace(/[`*_~]/g, "")
  .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
  .replace(/<[^>]+>/g, "")
  .replace(/\s+/g, " ")
  .trim();

const tipDirectory = path.join(repositoryDirectory, "01_Tips");
const tipFileNames = (await readdir(tipDirectory, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".md") && entry.name.toLowerCase() !== "readme.md")
  .map((entry) => entry.name)
  .sort((left, right) => left.localeCompare(right, "de", { numeric: true }));

let galleryItems = [];
try {
  galleryItems = JSON.parse(await readFile(galleryDataPath, "utf8")).items;
} catch {
  console.warn("Gallery data is unavailable; documentation images will be omitted.");
}

const tipDocuments = [];

for (const fileName of tipFileNames) {
  const source = `01_Tips/${fileName}`;
  const sourcePath = path.join(tipDirectory, fileName);
  const markdown = await readFile(sourcePath, "utf8");
  const baseName = path.basename(fileName, path.extname(fileName));
  const heading = markdown.match(/^#\s+(.+)$/m)?.[1] ?? baseName;
  const title = plainText(heading).replace(/^💡\s*/u, "");
  const introduction = markdown.match(/##\s+Wofür[^\n]*\r?\n+([\s\S]*?)(?=\r?\n##\s|$)/i)?.[1] ?? "";
  const summary = plainText(introduction.split(/\r?\n\s*\r?\n/)[0]) || "Praktischer Tipp für den Spielalltag.";
  const image = galleryItems.find((item) => {
    const itemBaseName = path.posix.basename(item.sourcePath, path.posix.extname(item.sourcePath));
    return item.sourcePath.startsWith("01_Tips/") && itemBaseName === baseName;
  });

  tipDocuments.push({
    source,
    slug: slugify(baseName),
    title,
    section: "Wissen",
    summary,
    parentSlug: "tipps",
    kind: "tip",
    imageUrl: image?.webUrl ?? null,
    imageRepositoryUrl: image?.repositoryUrl ?? null,
  });
}

const documents = [...baseDocuments, ...tipDocuments];

const sectionDescriptions = {
  Projekt: "Orientierung, Regeln und Hintergrund zum Archiv.",
  Wissen: "Tipps, Anleitungen, Strategien und Analysen.",
  Allianz: "Gemeinsame Grundlagen, Rollen und Vorlagen.",
  Gestaltung: "Verbindliche Regeln für Bilder und Texte.",
  Bildarchiv: "Struktur und Pflege der visuellen Inhalte.",
};

const normalizeWebsiteSpelling = (markdown, source) => {
  let normalized = markdown;

  if (source === "ARCHIVREGELN.md") {
    normalized = normalized
      .replace(
        /- \*\*Allianz – verbindliche Ingame-Schreibweise:\*\* DlE/g,
        "- **Allianz – Schreibweise auf dieser Website:** DIE",
      )
      .replace(
        /- \*\*Technischer Hinweis:\*\*.*(?:\r?\n|$)/,
        "- **Technischer Hinweis:** Der Textfilter im Spiel kann bei Allianz- und Spielernamen eine abweichende Schreibweise erforderlich machen.\n",
      )
      .replace(
        /Die Schreibweise \*\*DlE\*\*[\s\S]*?erklärt wird\./,
        "Auf dieser Website wird die Allianz durchgängig als **DIE** bezeichnet. Im Spiel kann aus technischen Filtergründen eine abweichende Schreibweise erforderlich sein.",
      );
  }

  return normalized.replaceAll("DlE", "DIE").replaceAll("dle", "die");
};

marked.setOptions({
  gfm: true,
  breaks: false,
});

const splitLevelTwoSections = (markdown) => {
  const headings = [...markdown.matchAll(/^##\s+(.+)$/gm)];

  return headings.map((heading, index) => ({
    title: plainText(heading[1]).toLowerCase(),
    markdown: markdown.slice(heading.index, headings[index + 1]?.index ?? markdown.length).trim(),
  }));
};

const items = [];

for (const document of documents) {
  const sourcePath = path.join(repositoryDirectory, ...document.source.split("/"));
  const markdown = await readFile(sourcePath, "utf8");
  const normalizedMarkdown = normalizeWebsiteSpelling(markdown, document.source);
  const articleMarkdown = normalizedMarkdown.replace(/^#\s+.*?(?:\r?\n)+/, "");
  const html = await marked.parse(articleMarkdown);
  const tipSections = document.kind === "tip" ? splitLevelTwoSections(articleMarkdown) : [];
  const introSection = tipSections.find((section) => section.title.startsWith("wofür"));
  const mainSection = tipSections.find((section) => section.title === "tipp");
  const copySection = tipSections.find((section) => section.title.startsWith("html-block"));
  const encodedSource = document.source
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  items.push({
    ...document,
    html,
    introHtml: introSection ? await marked.parse(introSection.markdown) : null,
    tipHtml: mainSection ? await marked.parse(mainSection.markdown) : null,
    copyHtml: copySection ? await marked.parse(copySection.markdown) : null,
    url: `/zroute_die/docs/${document.slug}/`,
    repositoryUrl: `${repositoryUrl}/blob/main/${encodedSource}`,
  });
}

const sectionOrder = ["Projekt", "Wissen", "Allianz", "Gestaltung", "Bildarchiv"];
const sections = sectionOrder.map((name) => ({
  name,
  description: sectionDescriptions[name],
  items: items.filter((item) => item.section === name && !item.parentSlug).map((item) => item.slug),
}));

await writeFile(
  outputPath,
  `${JSON.stringify({ documentCount: items.length, sections, items }, null, 2)}\n`,
  "utf8",
);

console.log(`Generated ${items.length} documentation pages.`);
