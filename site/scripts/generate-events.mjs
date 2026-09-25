import { mkdir, readFile, readdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const siteDirectory = path.resolve(scriptDirectory, "..");
const repositoryDirectory = path.resolve(siteDirectory, "..");
const eventsDirectory = path.join(repositoryDirectory, "Termine");
const outputPath = path.join(siteDirectory, "src", "data", "events.generated.json");
const calendarDirectory = path.join(siteDirectory, "public", "generated", "events");
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
  return trimmed;
};

const parseDocument = (source, fileName) => {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) throw new Error(`${fileName}: Der Metadatenblock am Dateianfang fehlt.`);

  const metadata = {};
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    const separator = line.indexOf(":");
    if (separator === -1) continue;
    metadata[line.slice(0, separator).trim()] = parseValue(line.slice(separator + 1));
  }

  return { metadata, markdown: match[2].trim() };
};

const validateTime = (value, label, fileName) => {
  if (!value) return null;
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) throw new Error(`${fileName}: ${label} muss HH:MM entsprechen.`);
  return value;
};

const escapeCalendarText = (value) => String(value ?? "")
  .replaceAll("\\", "\\\\")
  .replaceAll("\n", "\\n")
  .replaceAll(",", "\\,")
  .replaceAll(";", "\\;");

const compactDate = (value) => value.replaceAll("-", "");
const compactTime = (value) => value.replace(":", "") + "00";

const nextDate = (value) => {
  const date = new Date(`${value}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
};

const createCalendar = ({ title, date, time, end, endDate, location, summary, slug }) => {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//DIE Drachenhalle//Termine//DE",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${slug}-${compactDate(date)}@zroute-die`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`,
  ];

  if (time) {
    lines.push(`DTSTART;TZID=Europe/Berlin:${compactDate(date)}T${compactTime(time)}`);
    if (end) lines.push(`DTEND;TZID=Europe/Berlin:${compactDate(endDate ?? date)}T${compactTime(end)}`);
  } else {
    lines.push(`DTSTART;VALUE=DATE:${compactDate(date)}`);
    lines.push(`DTEND;VALUE=DATE:${compactDate(nextDate(date))}`);
  }

  lines.push(`SUMMARY:${escapeCalendarText(title)}`);
  if (location) lines.push(`LOCATION:${escapeCalendarText(location)}`);
  if (summary) lines.push(`DESCRIPTION:${escapeCalendarText(summary)}`);
  lines.push("END:VEVENT", "END:VCALENDAR", "");
  return lines.join("\r\n");
};

await mkdir(path.dirname(outputPath), { recursive: true });
await mkdir(calendarDirectory, { recursive: true });

const fileNames = (await readdir(eventsDirectory, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".md") && entry.name.toLowerCase() !== "readme.md")
  .map((entry) => entry.name);

const items = [];
const expectedCalendars = new Set();

for (const fileName of fileNames) {
  const source = await readFile(path.join(eventsDirectory, fileName), "utf8");
  const { metadata, markdown } = parseDocument(source, fileName);
  const title = String(metadata.title ?? "").trim();
  const date = String(metadata.date ?? "").trim();
  const time = validateTime(String(metadata.time ?? "").trim(), "time", fileName);
  const end = validateTime(String(metadata.end ?? "").trim(), "end", fileName);
  const endDate = String(metadata.endDate ?? "").trim() || null;

  if (!title) throw new Error(`${fileName}: title fehlt.`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`${fileName}: date muss YYYY-MM-DD entsprechen.`);
  if (end && !time) throw new Error(`${fileName}: end darf nur zusammen mit time verwendet werden.`);
  if (endDate && !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) throw new Error(`${fileName}: endDate muss YYYY-MM-DD entsprechen.`);
  if (endDate && !end) throw new Error(`${fileName}: endDate darf nur zusammen mit end verwendet werden.`);
  if (endDate && endDate < date) throw new Error(`${fileName}: endDate darf nicht vor date liegen.`);
  if (time && end && (endDate ?? date) === date && end <= time) throw new Error(`${fileName}: end muss nach time liegen.`);

  const slug = slugify(fileName.replace(/\.md$/i, ""));
  const firstParagraph = markdown.split(/\r?\n\s*\r?\n/).find((block) => !block.startsWith("#")) ?? "";
  const summary = plainText(String(metadata.summary ?? firstParagraph));
  const calendarName = `${slug}.ics`;
  const sourceRelativePath = `Termine/${fileName}`;

  await writeFile(
    path.join(calendarDirectory, calendarName),
    createCalendar({ title, date, time, end, endDate, location: metadata.location, summary, slug }),
    "utf8",
  );
  expectedCalendars.add(calendarName);

  items.push({
    slug,
    title,
    date,
    time,
    end,
    endDate,
    category: String(metadata.category ?? "Allianz-Event"),
    location: String(metadata.location ?? "").trim() || null,
    summary,
    html: await marked.parse(markdown.replaceAll("DlE", "DIE").replaceAll("dle", "die")),
    calendarUrl: `/zroute_die/generated/events/${calendarName}`,
    repositoryUrl: `${repositoryUrl}/blob/main/${sourceRelativePath.split("/").map(encodeURIComponent).join("/")}`,
  });
}

for (const file of await readdir(calendarDirectory)) {
  if (file.endsWith(".ics") && !expectedCalendars.has(file)) await unlink(path.join(calendarDirectory, file));
}

items.sort((left, right) => `${left.date}T${left.time ?? "00:00"}`.localeCompare(`${right.date}T${right.time ?? "00:00"}`));

await writeFile(outputPath, `${JSON.stringify({ items }, null, 2)}\n`, "utf8");
console.log(`Generated ${items.length} event${items.length === 1 ? "" : "s"}.`);
