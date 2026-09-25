# Tipps

Dieser Ordner sammelt ausführliche Wissensartikel zu den Tipps der Allianz. Die Markdown-Datei darf und soll mehr Kontext liefern als die kompakte Allianz-Mitteilung oder die Grafik: Funktionsweise, Anwendung, Rechenbeispiele, Grenzen, offene Punkte und weiterführende Quellen.

Zusammengehörige Texte und Grafiken werden direkt hier abgelegt und erhalten denselben eindeutigen Basisnamen.

Für die Gestaltung der Grafiken gilt die verbindliche Richtlinie [`DIE-Stil – Tipps`](../../Styleguides/DlE-Stil%20%E2%80%93%20Tipps.md).

## Metadaten und Filter

Jede Tipp-Datei beginnt mit Frontmatter. Die beiden Merkmalsgruppen werden getrennt gepflegt und von der Website für Karten, Detailseiten und die kombinierte Filterung verwendet:

```yaml
---
arten:
  - Anleitung
  - Strategie
themen:
  - Kampf
  - Allianz
---
```

- Erlaubte Werte für **Art**: `Anleitung`, `Strategie`, `Optimierung`
- Erlaubte Werte für **Thema**: `Allianz`, `Events`, `Kampf`, `Truppen`, `Aufbau`, `Weltkarte`

Pro Tipp ist mindestens ein Wert aus jeder Gruppe erforderlich. Das Frontmatter dient ausschließlich als Metadaten und wird nicht als Artikelinhalt ausgegeben.

## Aufbau einer Tipp-Datei

Jede Markdown-Datei enthält die vollständige Wissensseite. Optional kann direkt vor der ausführlichen Einordnung eine Kurzfassung ergänzt werden:

```markdown
## Das Wichtigste in Kürze
```

Ist dieser Abschnitt vorhanden, bietet die Website automatisch die Ansichten **„Kurz & knapp“** und **„Ausführlich“** an. Die Kurzansicht enthält ausschließlich diesen Abschnitt und die zugehörige Tippgrafik. Die ausführliche Ansicht beginnt bei `## Wofür ist dieser Tipp?` und enthält alle nachfolgenden Bereiche einschließlich Quellen und kopierbarer Allianz-Mitteilung. Es bleibt bei genau einer Markdown-Datei pro Tipp.

Die ausführliche Wissensseite soll, soweit für den jeweiligen Tipp sinnvoll, diese Bereiche enthalten:

1. **Wofür ist dieser Tipp?** – Zweck, Nutzen und geeignete Situationen.
2. **Funktionsweise und Anleitung** – die Mechanik und ein nachvollziehbarer Ablauf.
3. **Beispiele und Einordnung** – Berechnungen, Varianten oder Entscheidungshilfen.
4. **Grenzen und offene Punkte** – Risiken, versionsabhängige Aussagen und noch zu prüfende Details.
5. **Quellen und Verlässlichkeit** – Ingame-Belege, seriöse externe Quellen und Stand der Prüfung.
6. **Allianz-Mitteilung zum Kopieren** – der vollständige Ingame-Text in einem `html`-Codeblock, ohne Escape-Zeichen und direkt kopierbar.

Der HTML-Block übernimmt den freigegebenen Ingame-Text inhaltlich unverändert. Zusatzinformationen gehören in den Wissensartikel und nicht ungeprüft in die Allianz-Mitteilung.

Externe Informationen werden nach Möglichkeit online gegengeprüft und direkt verlinkt. Community-Aussagen müssen als solche erkennbar sein. Bei widersprüchlichen Angaben gilt die aktuelle Ingame-Anzeige; Unklarheiten werden als offen beziehungsweise noch zu testen markiert.

## Benennungsregeln

- Schema: `Tipp_XX_Kurztitel.Dateiendung`, zum Beispiel `Tipp_01_Ueberfall.md` und `Tipp_01_Ueberfall.png`.
- Die zweistellige Nummer entspricht der Tippnummer im Inhalt und wird fortlaufend vergeben.
- Der Kurztitel beschreibt den Tipp knapp und eindeutig. Er steht ohne Leerzeichen in lesbarer Binnen-Großschreibung; Umlaute werden als `Ae`, `Oe`, `Ue` und `ss` geschrieben.
- Zusammengehörige Texte, HTML-Dateien und Grafiken müssen exakt denselben Basisnamen haben.
- Dateiendungen werden kleingeschrieben. `README.md` ist von diesem Inhaltsschema ausgenommen.
