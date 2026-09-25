import { execFile } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);
const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const siteDirectory = path.resolve(scriptDirectory, "..");
const repositoryDirectory = path.resolve(siteDirectory, "..");
const outputPath = path.join(siteDirectory, "src", "data", "changelog.generated.json");

const imageExtensions = new Set([".avif", ".gif", ".jpeg", ".jpg", ".png", ".webp"]);

const runGit = async (args) => {
  const { stdout } = await execFileAsync("git", args, {
    cwd: repositoryDirectory,
    encoding: "utf8",
    windowsHide: true,
    maxBuffer: 4 * 1024 * 1024,
  });
  return stdout.trim();
};

const prettifyName = (filePath) => path.basename(filePath, path.extname(filePath))
  .replace(/^\d{4}_\d{2}_\d{2}_\d{4}_/, "")
  .replace(/^Tipp_\d+_/, "Tipp: ")
  .replaceAll("_", " ")
  .replace(/([a-zäöüß])([A-ZÄÖÜ])/g, "$1 $2")
  .replaceAll("DlE", "DIE")
  .trim();

const readMarkdownTitle = async (filePath) => {
  try {
    const content = await readFile(path.join(repositoryDirectory, ...filePath.split("/")), "utf8");
    const frontmatterTitle = content.match(/^---[\s\S]*?^title:\s*["']?(.+?)["']?\s*$[\s\S]*?^---$/m)?.[1];
    const heading = content.match(/^#\s+(.+)$/m)?.[1];
    return (frontmatterTitle ?? heading ?? prettifyName(filePath)).replace(/[`*_~]/g, "").replaceAll("DlE", "DIE").trim();
  } catch {
    return prettifyName(filePath);
  }
};

const verbFor = (status) => {
  if (status.startsWith("A")) return "wurde neu hinzugefügt";
  if (status.startsWith("D")) return "wurde entfernt";
  if (status.startsWith("R")) return "wurde verschoben";
  return "wurde aktualisiert";
};

const classify = (filePath) => {
  if (/^(Archiv|99_Archiv)\//.test(filePath) || filePath.startsWith("tmp/")) return null;
  if (/^(Aktuelles|00_Neuigkeiten)\//.test(filePath)) return { key: "news", name: "Neuigkeiten" };
  if (filePath.startsWith("Termine/")) return { key: "events", name: "Termine" };
  if (filePath.startsWith("Nützliches/") || /^(01_Tips|02_Anleitungen|07_Allianz|08_Strategien|09_Analysen)\//.test(filePath)) {
    return { key: "information", name: "Informationen" };
  }
  if (/^(Styleguides|06_Design-Guidelines)\//.test(filePath)) return { key: "style", name: "Styleguides" };
  if (filePath.startsWith("Galerie/") || /^(03_Avatare|04_Charaktermodelle|05_Chatbilder)\//.test(filePath)) {
    return { key: "gallery", name: "Galerie" };
  }
  if (filePath.startsWith("site/")) return { key: "website", name: "Website" };
  if (filePath.startsWith(".github/")) return { key: "deployment", name: "Veröffentlichung" };
  return { key: "project", name: "Projekt" };
};

const result = {
  available: false,
  title: "Noch kein Changelog verfügbar",
  date: null,
  groups: [],
};

try {
  const metadata = await runGit(["log", "-1", "--format=%H%x1f%s%x1f%cI"]);
  const [hash, title, date] = metadata.split("\x1f");
  const changesText = await runGit(["-c", "core.quotepath=false", "diff-tree", "--no-commit-id", "--name-status", "-r", "-M", "--root", "HEAD"]);
  const changes = changesText.split(/\r?\n/).filter(Boolean).map((line) => {
    const [status, firstPath, secondPath] = line.split("\t");
    return { status, path: secondPath ?? firstPath };
  });
  const changedPaths = new Set(changes.map((change) => change.path));
  const groups = new Map();

  for (const change of changes) {
    const group = classify(change.path);
    if (!group) continue;
    if (!groups.has(group.key)) groups.set(group.key, { name: group.name, items: new Set() });
    const bucket = groups.get(group.key).items;
    const extension = path.extname(change.path).toLowerCase();

    if (group.key === "website") {
      bucket.add("Website und Navigation wurden aktualisiert.");
      continue;
    }
    if (group.key === "deployment") {
      bucket.add("Der Veröffentlichungsprozess wurde aktualisiert.");
      continue;
    }
    if (group.key === "project") {
      bucket.add("Projektinformationen wurden aktualisiert.");
      continue;
    }
    if (imageExtensions.has(extension)) {
      const matchingMarkdown = change.path.slice(0, -extension.length) + ".md";
      if (changedPaths.has(matchingMarkdown)) continue;
      bucket.add(`„${prettifyName(change.path)}“ ${verbFor(change.status)}.`);
      continue;
    }
    if (extension === ".md") {
      const titleText = await readMarkdownTitle(change.path);
      bucket.add(`„${titleText}“ ${verbFor(change.status)}.`);
    }
  }

  const groupOrder = ["news", "events", "information", "gallery", "style", "website", "deployment", "project"];
  result.available = true;
  result.title = title || "Website aktualisiert";
  result.date = date;
  result.groups = groupOrder.flatMap((key) => {
    const group = groups.get(key);
    if (!group) return [];
    const items = [...group.items];
    const visibleItems = items.slice(0, 6);
    if (items.length > visibleItems.length) visibleItems.push(`${items.length - visibleItems.length} weitere Änderungen.`);
    return visibleItems.length ? [{ name: group.name, items: visibleItems }] : [];
  });
  result.shortHash = hash.slice(0, 7);
} catch (error) {
  console.warn(`Changelog could not be generated: ${error.message}`);
}

await writeFile(outputPath, `${JSON.stringify(result, null, 2)}\n`, "utf8");
console.log(result.available ? `Changelog ready: ${result.title}` : "Changelog unavailable.");
