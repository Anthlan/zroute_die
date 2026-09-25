# Archivregeln und Rahmenparameter

## Projekt

- **Spiel:** Z:Route: Redemption
- **Allianz – Schreibweise auf dieser Website:** DIE
- **Frühere Bezeichnungen:** DRR / Drachenritter
- **Technischer Hinweis:** Die Schreibweise `DIE` wird vom Filter des Spiels blockiert. Deshalb muss innerhalb des Spiels `DlE` verwendet werden.
- **Spielername:** Anthlan
- **Zweck der Ablage:** Wiederverwendbare Texte, Bilder, Regeln, Anleitungen, Strategien und Auswertungen für das Spiel und die Allianz zentral sichern.

Auf dieser Website und im Repository wird die Allianz durchgängig als **DIE** bezeichnet. Im Spiel kann aus technischen Filtergründen eine abweichende Schreibweise erforderlich sein. Die früheren Bezeichnungen **DRR** und **Drachenritter** werden nur verwendet, wenn ein historischer Stand dokumentiert wird.

## Inhaltlicher Rahmen

- Inhalte beziehen sich ausschließlich auf **Z:Route: Redemption**, die Allianz **DIE** und den zugehörigen Spielkontext.
- Persönliche oder berufliche Informationen gehören nicht in Allianztexte, Grafiken oder Charakterbeschreibungen.
- Pandora-Inhalte werden getrennt von allgemeinen Tipps behandelt.
- Nicht bestätigte Spielmechaniken werden deutlich als **unbestätigt**, **zu testen** oder **Community-Hinweis** gekennzeichnet.
- Zahlen, Boni und Spielmechaniken sollen nach Möglichkeit mit Screenshot, Spielanzeige oder belastbarer Quelle dokumentiert werden.

## Ordnerstruktur

- `Aktuelles`: manuell gepflegte Neuigkeiten für die Startseite
- `Termine`: Allianz-Events mit Datum, Uhrzeit und optionalem Kalender-Download
- `Galerie`: Avatare, Charaktermodelle und Chatbilder
- `Nützliches`: Tipps und Spielwissen mit Art-/Thema-Tags sowie Allianzmaterial
- `Styleguides`: verbindliche Regeln für Gestaltung und Textformatierung
- `Archiv`: ersetzte, veraltete oder nur noch historisch relevante Fassungen
- `site`: technische Quellen und Build-Skripte der Website

## Ablageregeln

1. Die Ablage bleibt möglichst flach. Für einzelne Tipps, Anleitungen oder Bilder werden keine zusätzlichen Unterordner erstellt.
2. Zusammengehöriger Text und zugehörige Grafik erhalten exakt denselben Basisnamen.
3. Veraltete Fassungen werden nach `Archiv` verschoben. Dateinamen wie `final`, `final2` oder `neu_neu` werden vermieden.
4. Dateinamen sollen den Inhalt ohne Öffnen der Datei erkennen lassen.
5. Groß- und Kleinschreibung von Spielernamen wird aus dem Spiel beziehungsweise aus dem dargestellten Bild übernommen.
6. Strukturänderungen und neue verbindliche Regeln werden über aussagekräftige Git-Commits nachvollziehbar dokumentiert.

## Dateinamensregeln

### Tipps und Anleitungen

Tipps verwenden eine zweistellige laufende Nummer und einen kurzen, beschreibenden Namen:

```text
Tipp_XX_Kurztitel.Dateiendung
```

Text und Bild verwenden denselben Basisnamen:

```text
Tipp_01_Ueberfall.md
Tipp_01_Ueberfall.png
```

Für Anleitungen wird vorläufig das Thema vorangestellt:

```text
Thema_Kurztitel.Dateiendung
AllianzShop_SchrittFuerSchritt.md
AllianzShop_SchrittFuerSchritt.png
```

Falls ein Text als formatiertes HTML gespeichert wird, bleibt der Basisname ebenfalls unverändert. Die Regeln für noch leere Bereiche werden mit den ersten tatsächlichen Inhalten bei Bedarf präzisiert.

### Avatare

Schema:

```text
Spielername_YYYY_MM_DD_HHMM.Dateiendung
```

Beispiele:

```text
mysteryZ_2026_08_07_1817.png
DRACHENHERZ_2026_08_24_1257.png
```

Der Spielername steht zuerst, damit alle Varianten eines Spielers zusammen angezeigt werden. Die Schreibweise entspricht exakt dem Namen auf dem Bild.

### Charaktermodelle und charakterbezogene Szenen

Für ein allgemeines Referenzbild gilt:

```text
Spielername_Referenzmodell.Dateiendung
```

Beispiele:

```text
Anthlan_Referenzmodell.png
Drachenherz_Referenzmodell.png
```

Der Zeitstempel entfällt bei Charaktermodellen. Wenn mehrere Referenzbilder eines Spielers benötigt werden, wird die Ansicht oder der Schwerpunkt ergänzt:

```text
Spielername_Referenzmodell_Front.Dateiendung
Spielername_Referenzmodell_Ganzkoerper.Dateiendung
Spielername_Referenzmodell_Seite.Dateiendung
Spielername_Referenzmodell_Gesicht.Dateiendung
Spielername_Referenzmodell_Ausruestung.Dateiendung
```

Der Spielername wird in der im Spiel beziehungsweise auf dem Referenzbild verwendeten Groß- und Kleinschreibung übernommen.

### Allgemeine Chatbilder

Schema:

```text
YYYY_MM_DD_HHMM_Kurztitel_[Hauptfiguren].Dateiendung
```

Hier steht der Zeitstempel zuerst, weil die chronologische Einordnung wichtiger ist als die Gruppierung nach einem einzelnen Charakter. Die Hauptfiguren werden nur ergänzt, wenn sie eindeutig zuzuordnen sind; mehrere Namen werden jeweils mit einem Unterstrich getrennt. Der Kurztitel und die Hauptfiguren enthalten keine Leerzeichen.

Chibi-Chatbilder verwenden dasselbe Schema und liegen im Unterordner `Galerie/Chatbilder/Chibi`.

Beispiele:

```text
2026_09_17_2043_KaffeeOderSomea_Anthlan_Somea.png
2026_09_18_0718_Kaffeepause.png
```

## Umgang mit historischen Inhalten

- Inhalte mit DRR, alten Rollen oder überholten Regeln werden nicht stillschweigend überschrieben.
- Wenn sie weiterhin dokumentationswürdig sind, werden sie eindeutig gekennzeichnet und nach `Archiv` verschoben.
- Die aktuelle Fassung verwendet immer **DIE** und den zuletzt bestätigten Rollen- und Regelstand.
