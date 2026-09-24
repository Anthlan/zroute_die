import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const siteDirectory = path.resolve(scriptDirectory, "..");
const repositoryDirectory = path.resolve(siteDirectory, "..");
const newsDirectory = path.join(repositoryDirectory, "Aktuelles");
const outputPath = path.join(siteDirectory, "src", "data", "news.generated.json");
const repositoryUrl = "https://github.com/Anthlan/zroute_die";

const slugify = (value) => value
  .normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "")
  .replaceAll("ß", "ss")
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

const parseValue = (value) => {
  const trimmed = value.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  return trimmed;
};

const parseDocument = (source, fileName) => {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    throw new Error(`${fileName}: Der Metadatenblock am Dateianfang fehlt.`);
  }

  const metadata = {};
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    const separator = line.indexOf(":");
    if (separator === -1) continue;
    metadata[line.slice(0, separator).trim()] = parseValue(line.slice(separator + 1));
  }

  return { metadata, markdown: match[2].trim() };
};

await mkdir(path.dirname(outputPath), { recursive: true });

let fileNames = [];
try {
  fileNames = (await readdir(newsDirectory, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".md") && entry.name.toLowerCase() !== "readme.md")
    .map((entry) => entry.name);
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

const items = [];

for (const fileName of fileNames) {
  const sourcePath = path.join(newsDirectory, fileName);
  const source = await readFile(sourcePath, "utf8");
  const { metadata, markdown } = parseDocument(source, fileName);
  const title = String(metadata.title ?? "").trim();
  const date = String(metadata.date ?? "").trim();

  if (!title) throw new Error(`${fileName}: title fehlt.`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`${fileName}: date muss YYYY-MM-DD entsprechen.`);

  const normalizedMarkdown = markdown.replaceAll("DlE", "DIE").replaceAll("dle", "die");
  const firstParagraph = normalizedMarkdown.split(/\r?\n\s*\r?\n/).find((block) => !block.startsWith("#")) ?? "";
  const summary = plainText(String(metadata.summary ?? firstParagraph));
  const sourceRelativePath = `Aktuelles/${fileName}`;

  items.push({
    slug: slugify(fileName.replace(/\.md$/i, "").replace(/^\d{4}_\d{2}_\d{2}_/, "")),
    title,
    date,
    category: String(metadata.category ?? "Allgemein"),
    summary,
    featured: metadata.featured === true,
    html: await marked.parse(normalizedMarkdown),
    url: `/zroute_die/neuigkeiten/${slugify(fileName.replace(/\.md$/i, "").replace(/^\d{4}_\d{2}_\d{2}_/, ""))}/`,
    repositoryUrl: `${repositoryUrl}/blob/main/${sourceRelativePath.split("/").map(encodeURIComponent).join("/")}`,
  });
}

items.sort((left, right) => {
  const featuredDifference = Number(right.featured) - Number(left.featured);
  if (featuredDifference) return featuredDifference;
  const dateDifference = right.date.localeCompare(left.date);
  return dateDifference || left.title.localeCompare(right.title, "de");
});

await writeFile(outputPath, `${JSON.stringify({ items }, null, 2)}\n`, "utf8");
console.log(`Generated ${items.length} news article${items.length === 1 ? "" : "s"}.`);
