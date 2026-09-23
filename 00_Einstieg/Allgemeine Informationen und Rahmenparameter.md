# Allgemeine Informationen und Rahmenparameter

## Projekt

- **Spiel:** Z:Route: Redemption
- **Allianz – verbindliche Ingame-Schreibweise:** DlE
- **Frühere Bezeichnungen:** DRR / Drachenritter
- **Technischer Hinweis:** Die Schreibweise `DIE` wird vom Filter des Spiels blockiert. Deshalb muss innerhalb des Spiels `DlE` verwendet werden.
- **Spielername:** Anthlan
- **Zweck der Ablage:** Wiederverwendbare Texte, Bilder, Regeln, Anleitungen, Strategien und Auswertungen für das Spiel und die Allianz zentral sichern.

Die Schreibweise **DlE** ist für alle spielbezogenen Inhalte verbindlich. **DIE** darf nur genannt werden, wenn die vom Filter blockierte Schreibweise erklärt wird. Die früheren Bezeichnungen **DRR** und **Drachenritter** werden nur verwendet, wenn ein historischer Stand dokumentiert wird.

## Inhaltlicher Rahmen

- Inhalte beziehen sich ausschließlich auf **Z:Route: Redemption**, die Allianz **DlE** und den zugehörigen Spielkontext.
- Persönliche oder berufliche Informationen gehören nicht in Allianztexte, Grafiken oder Charakterbeschreibungen.
- Pandora-Inhalte werden getrennt von allgemeinen Tipps behandelt.
- Nicht bestätigte Spielmechaniken werden deutlich als **unbestätigt**, **zu testen** oder **Community-Hinweis** gekennzeichnet.
- Zahlen, Boni und Spielmechaniken sollen nach Möglichkeit mit Screenshot, Spielanzeige oder belastbarer Quelle dokumentiert werden.

## Ordnerstruktur

- `00_Einstieg`: Einstieg, Projektregeln und Änderungsübersicht
- `01_Tips`: kurze, direkt teilbare Allianz-Tipps mit Text und Grafik
- `02_Anleitungen`: ausführlichere Schritt-für-Schritt-Anleitungen
- `03_Avatare`: fertige Profil- und Avatarbilder
- `04_Charaktermodelle`: Charakterreferenzen, Modelle, Details und charakterbezogene Szenen
- `05_Chatbilder`: allgemeine Bilder für Chatnachrichten und humorvolle Szenen; Chibi-Reaktionsbilder werden im Unterordner `Chibi` abgelegt
- `06_Design-Guidelines`: verbindliche Regeln für Gestaltung und Textformatierung
- `07_Allianz`: Regeln, Rollen, Kommunikationsstrategie und wiederverwendbare Allianztexte
- `08_Strategien`: taktische Planungen und Kampfkonzepte
- `09_Analysen`: Event-, Kampf-, Account- und Serverauswertungen
- `99_Archiv`: ersetzte, veraltete oder nur noch historisch relevante Fassungen

## Ablageregeln

1. Die Ablage bleibt möglichst flach. Für einzelne Tipps, Anleitungen oder Bilder werden keine zusätzlichen Unterordner erstellt.
2. Zusammengehöriger Text und zugehörige Grafik erhalten exakt denselben Basisnamen.
3. Veraltete Fassungen werden nach `99_Archiv` verschoben. Dateinamen wie `final`, `final2` oder `neu_neu` werden vermieden.
4. Dateinamen sollen den Inhalt ohne Öffnen der Datei erkennen lassen.
5. Groß- und Kleinschreibung von Spielernamen wird aus dem Spiel beziehungsweise aus dem dargestellten Bild übernommen.
6. Strukturänderungen und neue verbindliche Regeln werden im Changelog dokumentiert.

## Dateinamensregeln

### Tipps und Anleitungen

Schema:

```text
Nummer_Kurztitel.Dateiendung
```

Text und Bild verwenden denselben Basisnamen:

```text
07_Ueberfall.md
07_Ueberfall.png
```

Falls der Text direkt als formatiertes HTML gespeichert wird:

```text
07_Ueberfall.html
07_Ueberfall.png
```

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

Für charakterbezogene Szenen gilt:

```text
Spielername_Szene_Kurzbeschreibung.Dateiendung
```

Beispiel:

```text
Drachenherz_Szene_Trinkhalle.png
```

Der Spielername wird in der im Spiel beziehungsweise auf dem Referenzbild verwendeten Groß- und Kleinschreibung übernommen.

### Allgemeine Chatbilder

Schema:

```text
YYYY_MM_DD_HHMM_Kurztitel_[Hauptfiguren].Dateiendung
```

Hier steht der Zeitstempel zuerst, weil die chronologische Einordnung wichtiger ist als die Gruppierung nach einem einzelnen Charakter. Die Hauptfiguren werden nur ergänzt, wenn sie eindeutig zuzuordnen sind; mehrere Namen werden jeweils mit einem Unterstrich getrennt. Der Kurztitel und die Hauptfiguren enthalten keine Leerzeichen.

Chibi-Chatbilder verwenden dasselbe Schema und liegen im Unterordner `05_Chatbilder/Chibi`.

Beispiele:

```text
2026_09_17_2043_KaffeeOderSomea_Anthlan_Somea.png
2026_09_18_0718_Kaffeepause.png
```

## Umgang mit historischen Inhalten

- Inhalte mit DRR, alten Rollen oder überholten Regeln werden nicht stillschweigend überschrieben.
- Wenn sie weiterhin dokumentationswürdig sind, werden sie eindeutig gekennzeichnet und nach `99_Archiv` verschoben.
- Die aktuelle Fassung verwendet immer **DlE** und den zuletzt bestätigten Rollen- und Regelstand.
