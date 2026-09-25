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
    summary: "Zweck, Struktur und Grundidee der öffentlichen DIE Drachenhalle.",
  },
  {
    source: "ARCHIVREGELN.md",
    slug: "archivregeln",
    title: "Archivregeln",
    section: "Projekt",
    summary: "Verbindliche Regeln für Ablage, Benennung und Pflege der Inhalte.",
  },
  {
    source: "Nützliches/Tipps/README.md",
    slug: "tipps",
    title: "Tipps",
    section: "Informationen",
    summary: "Kurze Hinweise, Tricks und Entscheidungshilfen für den Spielalltag.",
  },
  {
    source: "Nützliches/Anleitungen/README.md",
    slug: "anleitungen",
    title: "Anleitungen",
    section: "Informationen",
    summary: "Schritt-für-Schritt-Erklärungen für wiederkehrende Abläufe.",
  },
  {
    source: "Nützliches/Strategien/README.md",
    slug: "strategien",
    title: "Strategien",
    section: "Informationen",
    summary: "Taktiken und abgestimmte Vorgehensweisen der Allianz.",
  },
  {
    source: "Nützliches/Analysen/README.md",
    slug: "analysen",
    title: "Analysen",
    section: "Informationen",
    summary: "Auswertungen, Vergleiche und nachvollziehbare Erkenntnisse.",
  },
  {
    source: "Nützliches/Allianz/README.md",
    slug: "allianz",
    title: "Allianz",
    section: "Informationen",
    summary: "Regeln, Rollen und wiederverwendbare Texte der DIE-Allianz.",
  },
  {
    source: "Styleguides/README.md",
    slug: "design-guidelines",
    title: "Design-Guidelines",
    section: "Gestaltung",
    summary: "Einstieg in die verbindliche Bildsprache und Textgestaltung.",
  },
  {
    source: "Styleguides/DlE-Stil – Chibi-Chatbilder.md",
    slug: "stil-chibi-chatbilder",
    title: "Stil: Chibi-Chatbilder",
    section: "Gestaltung",
    summary: "Format, Aufbau und Wiedererkennungsmerkmale der Chibi-Motive.",
  },
  {
    source: "Styleguides/DlE-Stil – Chat-Bilder.md",
    slug: "stil-chatbilder",
    title: "Stil: Chatbilder",
    section: "Gestaltung",
    summary: "Gestaltungsregeln für normale Chatbilder der Allianz.",
  },
  {
    source: "Styleguides/DlE-Stil – Avatarbilder.md",
    slug: "stil-avatarbilder",
    title: "Stil: Avatarbilder",
    section: "Gestaltung",
    summary: "Vorgaben für konsistente Avatare und Porträts.",
  },
  {
    source: "Styleguides/DlE-Stil – Charaktermodelle.md",
    slug: "stil-charaktermodelle",
    title: "Stil: Charaktermodelle",
    section: "Gestaltung",
    summary: "Verbindliches Seitenraster und Referenzumfang für neue Figuren.",
  },
  {
    source: "Styleguides/DlE-Stil – Allianz-Mitteilungen.md",
    slug: "stil-allianz-mitteilungen",
    title: "Stil: Allianz-Mitteilungen",
    section: "Gestaltung",
    summary: "Bildsprache und Aufbau offizieller Mitteilungen.",
  },
  {
    source: "Styleguides/DlE – Textformatierung.md",
    slug: "textformatierung",
    title: "Textformatierung",
    section: "Gestaltung",
    summary: "Farben, Hierarchien und Formatierung für Texte im Spiel.",
  },
  {
    source: "Galerie/Avatare/README.md",
    slug: "avatare",
    title: "Avatare",
    section: "Bildarchiv",
    summary: "Ablage und Benennung der persönlichen Avatarbilder.",
  },
  {
    source: "Galerie/Charaktermodelle/README.md",
    slug: "charaktermodelle",
    title: "Charaktermodelle",
    section: "Bildarchiv",
    summary: "Referenzen für Figuren, Kleidung und wiederkehrende Merkmale.",
  },
  {
    source: "Galerie/Chatbilder/README.md",
    slug: "chatbilder",
    title: "Chatbilder",
    section: "Bildarchiv",
    summary: "Regeln und Struktur für die Sammlung der Chatmotive.",
  },
  {
    source: "Galerie/Chatbilder/Chibi/README.md",
    slug: "chibi",
    title: "Chibi-Chatbilder",
    section: "Bildarchiv",
    summary: "Eigener Bereich für kompakte Motive im Chibi-Stil.",
  },
  {
    source: "Archiv/README.md",
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

const tipDirectory = path.join(repositoryDirectory, "Nützliches", "Tipps");
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
  const source = `Nützliches/Tipps/${fileName}`;
  const sourcePath = path.join(tipDirectory, fileName);
  const markdown = await readFile(sourcePath, "utf8");
  const baseName = path.basename(fileName, path.extname(fileName));
  const heading = markdown.match(/^#\s+(.+)$/m)?.[1] ?? baseName;
  const title = plainText(heading).replace(/^💡\s*/u, "");
  const introduction = markdown.match(/##\s+Wofür[^\n]*\r?\n+([\s\S]*?)(?=\r?\n##\s|$)/i)?.[1] ?? "";
  const summary = plainText(introduction.split(/\r?\n\s*\r?\n/)[0]) || "Praktischer Tipp für den Spielalltag.";
  const image = galleryItems.find((item) => {
    const itemBaseName = path.posix.basename(item.sourcePath, path.posix.extname(item.sourcePath));
    return item.sourcePath.startsWith("Nützliches/Tipps/") && itemBaseName === baseName;
  });

  tipDocuments.push({
    source,
    slug: slugify(baseName),
    title,
    section: "Informationen",
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
  Informationen: "Tipps, Anleitungen, Strategien, Analysen und Allianzinformationen.",
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

const resolveLocalMarkdownImages = (markdown, source) => {
  const sourceDirectory = path.posix.dirname(source);

  return markdown.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (match, alt, imageTarget) => {
    if (/^(?:[a-z]+:|\/|#)/i.test(imageTarget)) return match;

    let decodedTarget;
    try {
      decodedTarget = decodeURIComponent(imageTarget);
    } catch {
      return match;
    }

    const sourcePath = path.posix.normalize(
      path.posix.join(sourceDirectory, decodedTarget.replaceAll("\\", "/")),
    );
    const image = galleryItems.find((item) => item.sourcePath === sourcePath);

    return image ? `![${alt}](${image.webUrl})` : match;
  });
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

const removeTipMainImage = (markdown, imageUrl) => {
  if (!imageUrl) return markdown;

  return markdown.replace(/!\[([^\]]*)\]\(([^)\s]+)\)\s*/g, (match, _alt, imageTarget) =>
    imageTarget === imageUrl ? "" : match,
  );
};

const addHeadingIds = (html) => {
  const usedIds = new Map();

  return html.replace(/<h([2-6])>([\s\S]*?)<\/h\1>/g, (_match, level, content) => {
    const baseId = slugify(plainText(content)) || "abschnitt";
    const count = usedIds.get(baseId) ?? 0;
    usedIds.set(baseId, count + 1);
    const id = count === 0 ? baseId : `${baseId}-${count + 1}`;
    return `<h${level} id="${id}">${content}</h${level}>`;
  });
};

const items = [];

for (const document of documents) {
  const sourcePath = path.join(repositoryDirectory, ...document.source.split("/"));
  const markdown = await readFile(sourcePath, "utf8");
  const normalizedMarkdown = resolveLocalMarkdownImages(
    normalizeWebsiteSpelling(markdown, document.source),
    document.source,
  );
  const articleMarkdown = normalizedMarkdown.replace(/^#\s+.*?(?:\r?\n)+/, "");
  const html = await marked.parse(articleMarkdown);
  const tipSections = document.kind === "tip" ? splitLevelTwoSections(articleMarkdown) : [];
  const briefSection = tipSections.find((section) => section.title === "das wichtigste in kürze");
  const detailStartIndex = tipSections.findIndex((section) => section.title.startsWith("wofür ist dieser tipp"));
  const detailMarkdown = detailStartIndex >= 0
    ? tipSections.slice(detailStartIndex).map((section) => section.markdown).join("\n\n")
    : null;
  const detailIntroMarkdown = detailStartIndex >= 0
    ? tipSections[detailStartIndex].markdown
    : null;
  const detailBodyMarkdown = detailStartIndex >= 0
    ? tipSections.slice(detailStartIndex + 1).map((section) => section.markdown).join("\n\n")
    : null;
  const hasBriefView = Boolean(briefSection && detailMarkdown);
  const briefMarkdown = hasBriefView
    ? removeTipMainImage(briefSection.markdown, document.imageUrl)
    : null;
  const cleanedDetailMarkdown = hasBriefView
    ? removeTipMainImage(detailMarkdown, document.imageUrl)
    : null;
  const cleanedDetailIntroMarkdown = hasBriefView
    ? removeTipMainImage(detailIntroMarkdown, document.imageUrl)
    : null;
  const cleanedDetailBodyMarkdown = hasBriefView
    ? removeTipMainImage(detailBodyMarkdown, document.imageUrl)
    : null;
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
    briefHtml: briefMarkdown ? addHeadingIds(await marked.parse(briefMarkdown)) : null,
    detailHtml: cleanedDetailMarkdown ? addHeadingIds(await marked.parse(cleanedDetailMarkdown)) : null,
    detailIntroHtml: cleanedDetailIntroMarkdown ? addHeadingIds(await marked.parse(cleanedDetailIntroMarkdown)) : null,
    detailBodyHtml: cleanedDetailBodyMarkdown ? addHeadingIds(await marked.parse(cleanedDetailBodyMarkdown)) : null,
    hasBriefView,
    introHtml: introSection ? await marked.parse(introSection.markdown) : null,
    tipHtml: mainSection ? await marked.parse(mainSection.markdown) : null,
    copyHtml: copySection ? await marked.parse(copySection.markdown) : null,
    url: `/zroute_die/docs/${document.slug}/`,
    repositoryUrl: `${repositoryUrl}/blob/main/${encodedSource}`,
  });
}

const sectionOrder = ["Projekt", "Informationen", "Gestaltung", "Bildarchiv"];
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
