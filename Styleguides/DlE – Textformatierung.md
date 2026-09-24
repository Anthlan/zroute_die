# DlE – Textformatierung

## Zweck

Dieses Dokument beschreibt die Formatierungsregeln für Texte in Z:Route: Redemption. Es unterscheidet zwischen **Allianz-Mitteilungen** und **normalen Nachrichten**, da beide Bereiche unterschiedliche technische Grenzen haben.

## Allgemeine Regeln

- Texte werden auf Deutsch oder Englisch passend zum Empfängerkreis erstellt.
- Der Allianz-Tag wird als **DlE** geschrieben.
- HTML-Tags müssen korrekt geöffnet und geschlossen werden.
- Formatierung wird gezielt eingesetzt: wenige Farben, kurze Hervorhebungen und klare Abschnitte.
- Vor dem Versenden wird der vollständige Quelltext einschließlich HTML-Tags und Emojis auf die Zeichengrenze geprüft.
- Neue oder unsichere Tags sollten zunächst mit einem kurzen Testtext geprüft werden.

## Allianz-Mitteilungen

### Technische Rahmenbedingungen

- Maximal **1.000 Zeichen**.
- HTML-Formatierung kann verwendet werden.
- Normale Zeilenumbrüche können für Abschnitte verwendet werden.
- Zu einer Mitteilung kann eine Grafik angehängt werden.
- Auch HTML-Tags und Emojis sollten bei der Zeichenplanung mitgerechnet werden.

### Bewährte Tags

```html
<b>Fetter Text</b>
<color=#FFD700>Goldener Text</color>
<size=40>Größerer Text</size>
```

Tags können kombiniert werden:

```html
<color=#FFD700><b>Wichtige Überschrift</b></color>
```

Die Tags werden in umgekehrter Reihenfolge geschlossen. Verschachtelungen müssen vollständig sein.

### Vorsicht bei Größe und Ausrichtung

- Größenangaben sind relativ zur Spieloberfläche und sollten vor der endgültigen Verwendung getestet werden.
- Ein Wert wie `34` kann kleiner als der Standardtext erscheinen.
- `<align=center>` wurde nicht zuverlässig akzeptiert und sollte vermieden werden.
- Für Überschriften sind Farbe und Fettdruck meist robuster als eine aufwendige Ausrichtung.

### Beispiel: Allianz-Mitteilung

```html
<color=#FFD700><b>DlE – ALLIANZINFO</b></color>
<color=#FF4040><b>WICHTIG:</b></color> Bitte vor dem Event die aktuellen Markierungen prüfen.
<b>Aufgabe:</b> WEST halten und bedrohte Spieler verstärken.
<color=#7FFF00><b>Danke für eure Unterstützung!</b></color>
```

### Beispiel: Rollenankündigung

```html
<color=#FFD700><b>NEUE AUFGABENVERTEILUNG</b></color>
<b>Drachenherz</b> übernimmt den Kriegsherrn, <b>Helltrain</b> kümmert sich um den Hinterhalt und <b>DaVinci1986</b> übernimmt die Rekrutierung. Vielen Dank an <b>Lordmirko</b>, der die Rolle des Kriegsherrn bisher mit Leben gefüllt hat.
```

### Kürzungsreihenfolge bei mehr als 1.000 Zeichen

1. Wiederholungen entfernen.
2. Einleitung und Schluss verkürzen.
3. Emojis reduzieren.
4. Weniger wichtige Formatierungs-Tags entfernen.
5. Details in eine angehängte Grafik oder eine zweite Nachricht auslagern.

## Normale Nachrichten

### Technische Rahmenbedingungen

- Es steht mehr Text als bei Allianz-Mitteilungen zur Verfügung.
- Zeilenumbrüche funktionieren nicht zuverlässig.
- `<br>` wird nicht als verlässlicher Zeilenumbruch eingeplant.
- Inhalte werden deshalb möglichst als kompakte Ein-Zeilen-Nachricht strukturiert.

### Geeignete Trenner

```text
• Punkt
| senkrechter Strich
– Gedankenstrich
▶ Abschnittsmarker
```

### Beispiel: kompakte Einsatznachricht

```html
<color=#FFD700><b>WEST:</b></color> Position früh besetzen | <color=#FF4040><b>ANGRIFF:</b></color> nur nach Markierung | <color=#7FFF00><b>SUPPORT:</b></color> bedrohte Spieler sofort verstärken
```

### Beispiel: sachliche Erinnerung

```html
<b>Kurze Erinnerung:</b> Bitte vor dem Start prüfen, ob Forschung, Bau oder Ausbildung wirklich während des passenden Bonus läuft. | Bereits laufende Vorgänge erhalten den Bonus nicht nachträglich.
```

## Farbempfehlungen

Die Farben sollen funktional eingesetzt werden und zur dunklen DlE-Gestaltung passen:

- `#FFD700` – Gold: Überschriften, Allianzname, wichtige positive Begriffe
- `#FF4040` – Rot: Warnungen, Verbote, dringende Hinweise
- `#7FFF00` – Grün: Vorteile, Freigaben, positive Handlungsaufforderungen
- Weiß beziehungsweise Standardfarbe: normaler Fließtext

Zu viele Farben machen kurze Texte unruhig. Pro Nachricht reichen meistens zwei Akzentfarben plus Standardtext.

## Stil der Texte

- Kurz, klar und spielnah formulieren.
- Erst die Handlung, danach die Begründung.
- Keine unnötigen Fachbegriffe oder langen Einleitungen.
- Bei Strategien klare Rollen und Ziele nennen.
- Bei sensibler Allianzkommunikation subtil und sachlich bleiben: Fragen, kurze Hinweise und kleine Spitzen statt persönlicher Angriffe.
- Spieler korrekt benennen; insbesondere Groß- und Kleinschreibung beachten.

## Zusammenspiel mit Grafiken

- Eine Grafik ergänzt die Mitteilung, ersetzt aber keine entscheidende Handlungsanweisung.
- Text und Grafik dürfen sich nicht widersprechen.
- Das wichtigste Ziel muss auch ohne Öffnen der Grafik verständlich sein.
- Wiederverwendbare Tipps erhalten für Text und Bild denselben Basisnamen.

Beispiel:

```text
Ueberfall.md
Ueberfall.png
```
