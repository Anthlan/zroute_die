import crypto from "node:crypto";
import { mkdir, readFile, readdir, stat, unlink, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repositoryRoot = path.resolve(siteRoot, "..");
const outputDirectory = path.join(siteRoot, "public", "generated", "gallery");
const dataFile = path.join(siteRoot, "src", "data", "gallery.generated.json");
const imageExtensions = new Set([".png", ".jpg", ".jpeg", ".webp"]);

const contentAreas = [
  ["01_Tips", "Tipp"],
  ["02_Anleitungen", "Anleitung"],
  ["03_Avatare", "Avatar"],
  ["04_Charaktermodelle", "Charaktermodell"],
  ["05_Chatbilder", "Chatbild"],
  ["06_Design-Guidelines", "Stilguide"],
  ["07_Allianz", "Allianz"],
  ["08_Strategien", "Strategie"],
  ["09_Analysen", "Analyse"],
];

const knownPeople = [
  "Anthlan",
  "Bertpfanne",
  "Boshos",
  "DaVinci1986",
  "Drachenherz",
  "Helltrain",
  "Hulkster666",
  "Kaylani",
  "Killergruppe",
  "Lordmirko",
  "RuhrpottBlach",
  "Skibbi",
  "Somea",
  "Streetjudge",
  "mysteryZ",
];
const canonicalPeople = new Map(knownPeople.map((person) => [person.toLowerCase(), person]));

const transliterations = new Map([
  ["Raubzugkaempfe", "Raubzugkämpfe"],
  ["Zuendeln", "Zündeln"],
  ["Zurueck", "Zurück"],
  ["Allianzgespraech", "Allianzgespräch"],
  ["Koelsch", "Kölsch"],
  ["Krokodiltraenen", "Krokodiltränen"],
  ["Buero", "Büro"],
  ["Gaertner", "Gärtner"],
  ["Waechter", "Wächter"],
  ["Jaeger", "Jäger"],
  ["Aerger", "Ärger"],
  ["Faehigkeiten", "Fähigkeiten"],
  ["Erklaeren", "Erklären"],
  ["Verbuendete", "Verbündete"],
]);

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(entryPath)));
    if (entry.isFile() && imageExtensions.has(path.extname(entry.name).toLowerCase())) files.push(entryPath);
  }

  return files;
}

function humanize(value) {
  let normalized = value;
  for (const [source, replacement] of transliterations) normalized = normalized.replaceAll(source, replacement);

  return normalized
    .replaceAll("_", " ")
    .replace(/([A-ZÄÖÜ]+)([A-ZÄÖÜ][a-zäöüß])/g, "$1 $2")
    .replace(/([a-zäöüß])([A-ZÄÖÜ0-9])/g, "$1 $2")
    .replace(/([0-9])([A-Za-zÄÖÜäöüß])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 52);
}

function parseMetadata(sourcePath, defaultCategory) {
  const normalizedPath = sourcePath.split(path.sep).join("/");
  const category = normalizedPath.startsWith("05_Chatbilder/Chibi/") ? "Chibi" : defaultCategory;
  const baseName = path.basename(sourcePath, path.extname(sourcePath));
  const tokens = baseName.split("_").filter(Boolean);
  const dateIndex = tokens.findIndex((token, index) =>
    /^20\d{2}$/.test(token)
      && /^(0[1-9]|1[0-2])$/.test(tokens[index + 1] ?? "")
      && /^(0[1-9]|[12]\d|3[01])$/.test(tokens[index + 2] ?? "")
      && /^\d{4}$/.test(tokens[index + 3] ?? ""),
  );

  let date = null;
  let time = null;
  if (dateIndex >= 0) {
    const [year, month, day, clock] = tokens.splice(dateIndex, 4);
    date = `${year}-${month}-${day}`;
    time = `${clock.slice(0, 2)}:${clock.slice(2)}`;
  }

  const versionIndex = tokens.findIndex((token) => /^v\d+$/i.test(token));
  const version = versionIndex >= 0 ? Number(tokens.splice(versionIndex, 1)[0].slice(1)) : null;
  const people = [];

  if ((category === "Avatar" || category === "Charaktermodell") && canonicalPeople.has(tokens[0]?.toLowerCase())) {
    people.push(canonicalPeople.get(tokens.shift().toLowerCase()));
  }

  while (tokens.length && canonicalPeople.has(tokens.at(-1).toLowerCase())) {
    people.unshift(canonicalPeople.get(tokens.pop().toLowerCase()));
  }

  let title;
  if (category === "Avatar") {
    title = `${people[0] ?? humanize(tokens[0] ?? "Unbekannt")} – Avatar`;
  } else if (category === "Charaktermodell" && people.length) {
    title = `${people[0]} – ${humanize(tokens.join(" ") || "Referenzmodell")}`;
  } else {
    title = humanize(tokens.join(" ") || baseName);
  }

  if (version) title += ` · Version ${version}`;

  return { category, date, people, time, title, version };
}

async function loadPreviousItems() {
  try {
    const data = JSON.parse(await readFile(dataFile, "utf8"));
    return new Map(data.items.map((item) => [item.sourcePath, item]));
  } catch {
    return new Map();
  }
}

async function mapWithConcurrency(values, concurrency, worker) {
  const results = new Array(values.length);
  let nextIndex = 0;

  async function run() {
    while (nextIndex < values.length) {
      const index = nextIndex++;
      results[index] = await worker(values[index], index);
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, values.length) }, run));
  return results;
}

await mkdir(outputDirectory, { recursive: true });
await mkdir(path.dirname(dataFile), { recursive: true });

const previousItems = await loadPreviousItems();
const sources = [];

for (const [directory, category] of contentAreas) {
  const absoluteDirectory = path.join(repositoryRoot, directory);
  for (const absolutePath of await walk(absoluteDirectory)) {
    sources.push({ absolutePath, category });
  }
}

const items = await mapWithConcurrency(sources, 3, async ({ absolutePath, category }) => {
  const relativePath = path.relative(repositoryRoot, absolutePath).split(path.sep).join("/");
  const fileStats = await stat(absolutePath);
  const fingerprint = `${fileStats.size}-${Math.trunc(fileStats.mtimeMs)}`;
  const metadata = parseMetadata(relativePath, category);
  const hash = crypto.createHash("sha1").update(relativePath).digest("hex").slice(0, 8);
  const id = `${slugify(metadata.title) || "bild"}-${hash}`;
  const thumbnailName = `${id}-thumb.webp`;
  const webName = `${id}-web.webp`;
  const thumbnailPath = path.join(outputDirectory, thumbnailName);
  const webPath = path.join(outputDirectory, webName);
  const previous = previousItems.get(relativePath);
  let width = previous?.width ?? null;
  let height = previous?.height ?? null;

  let outputsExist = true;
  try {
    await Promise.all([stat(thumbnailPath), stat(webPath)]);
  } catch {
    outputsExist = false;
  }

  if (previous?.fingerprint !== fingerprint || !outputsExist) {
    const image = sharp(absolutePath, { failOn: "warning" }).rotate();
    const sourceMetadata = await image.metadata();
    width = sourceMetadata.width ?? null;
    height = sourceMetadata.height ?? null;

    await Promise.all([
      image.clone().resize({ width: 480, withoutEnlargement: true }).webp({ quality: 68, effort: 5 }).toFile(thumbnailPath),
      image.clone().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 80, effort: 5 }).toFile(webPath),
    ]);
  }

  const encodedSourcePath = relativePath.split("/").map(encodeURIComponent).join("/");

  return {
    id,
    ...metadata,
    width,
    height,
    fingerprint,
    originalBytes: fileStats.size,
    sourcePath: relativePath,
    repositoryUrl: `https://github.com/Anthlan/zroute_die/blob/main/${encodedSourcePath}`,
    thumbnailUrl: `/zroute_die/generated/gallery/${thumbnailName}`,
    webUrl: `/zroute_die/generated/gallery/${webName}`,
  };
});

items.sort((left, right) => {
  const leftDate = `${left.date ?? "0000-00-00"}T${left.time ?? "00:00"}`;
  const rightDate = `${right.date ?? "0000-00-00"}T${right.time ?? "00:00"}`;
  return rightDate.localeCompare(leftDate) || left.title.localeCompare(right.title, "de");
});

const expectedOutputs = new Set(items.flatMap((item) => [path.basename(item.thumbnailUrl), path.basename(item.webUrl)]));
for (const output of await readdir(outputDirectory)) {
  if (!expectedOutputs.has(output)) await unlink(path.join(outputDirectory, output));
}

const generatedBytes = (
  await Promise.all([...expectedOutputs].map(async (file) => (await stat(path.join(outputDirectory, file))).size))
).reduce((sum, size) => sum + size, 0);

const galleryData = {
  generatedAt: new Date().toISOString(),
  imageCount: items.length,
  originalBytes: items.reduce((sum, item) => sum + item.originalBytes, 0),
  generatedBytes,
  items,
};

await writeFile(dataFile, `${JSON.stringify(galleryData, null, 2)}\n`, "utf8");

const megabytes = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;
console.log(
  `Gallery ready: ${items.length} originals (${megabytes(galleryData.originalBytes)}) → ${items.length * 2} web assets (${megabytes(generatedBytes)})`,
);
