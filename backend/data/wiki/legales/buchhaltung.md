# Buchhaltung

## Einfache Buchhaltung
Jeder Geschäftsvorfall wird nur einmal verbucht.
Beispieltemplate hier: https://sevdesk.de/eur-vorlage/?utm_source=awin&utm_medium=affiliate&utm_campaign=awin-de&partner=380121&affmt=2458887&affmn=2458887&awc=15944_1638964381_08d2dc4516a0cb237c749ac464af9f59 

Erlaubt für:
     - Freiberufler und Partnergesellschaften (= GBR für Freiberufler)
     - Gewerbetreibende falls:
        - Umsatz < 600.000€
        - *und* Gewinn < 60.000€
Nicht erlaubt für Kapitalgesellschaften (GmbH, UG, ...)

Einnahmenüberschussrechnung (EÜR) als Jahresabschluss. 
Aka. Einnahmen-Ausgaben-Rechnung.
Ist ein Bogen den man vom Finanzamt bekommt
Daraus errechnen sich Steuern


### Rechnung
1. Liste alle Einnahmen
2. Liste alle Ausgaben
3. Liste alle Abschreibungen
4. Gewinn = 1 - 2 - 3

Jede Einnahme und jede Ausgabe ist gekennzeichnet mit:
 - Belegnummer
 - Datum
 - Transaktionsbeschreibung
 - Wert Netto
 - Ust. Betrag
 - Summe

Zu den Ausgaben hinzu kommen Ust.-Vorauszahlungen
Alles wird erst gezählt wenn es von meinem Konto abgeflossen bzw eingegangen ist.

### Abschreibungen
= Langlebige Wirtschaftsgüter (Drucker, Tische, ...): Kaufpreis wird nicht nur im Jahr des Kaufs als Ausgaben angegeben,
sondern Anteilweise über mehrere Jahre hinweg.

### Finanzierungen
Tilgungsanteil ist keine Ausgabe, sondern Steuerneutral. 

### Privateinlagen & -entnahmen
Egal wie viel ich meiner Firma überweise, das ist nicht gewinnwirksam.

### Anlagenverzeichnis: Abnutzbare Wirtschaftsgüter
Für alle abnutzbaren Wirtschaftsgüter (Auto, Maschinen, ...)
Alles unter 800€ kann man sofort absetzen - wird nicht gestreckt.
Alles darüber wird auf den gesetzlich vorgeschriebenen Nutzungszeitraum verteilt (AFA-Tabelle)

### Anlagenverzeichnis: Nicht-Abnutzbare Wirtschaftsgüter
Dinge die nicht kaputt gehen. 

### Anlagenverzeichnis: Immaterielle Vermögenswerte

### Anlagenverzeichnis: Beschränkt absetzbare Ausgaben
Bewirtungskosten: 70% absetzbar
Fahrtenbücher


## Doppelte Buchhaltung
Jeder Vorfall kommt zwei mal vor: einmal auf der Soll- und einmal auf der Haben-Seite.

Kleinunternehmen und Freiberufler sind ausgenommen von dieser Pflicht.
Jeder eingetragene Kaufmann - dh jeder im Handelsregister eingetragene - muss doppelte Buchhaltung führen. Jede Körperschaft ebenfalls.

<img src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/doppelte_buchführung.png">


Summe der Aktiva muss gleich der Summe der Passiva sein.


Tabelle 0: Vorgänge aka Vorfälle aka Buchungen
 - Buchungs-ID
 - Von X an Y
 - Belegnummer
 - Datum
 - Transaktionsbeschreibung
 - Wert Netto
 - Ust. Betrag
 - Summe
 - Buchungssatz: <T-Verringert> <Wert> an <T-Erhöht> <Wert>, an <T-Erhöht-2> <Wert-2>, an ...
        - Gibt an, auf welche T-Tabellen der Betrag der Buchung verteilt wird
        - Beispiel: Bank 30.000€ an Eigenkapital 30.000€
                - Habe aus Eigenkapital 30.000€ an Betriebs-Bankkonto überwiesen
                - In meinem Eigenkapital-T-Tabelle jetzt ein Haben von 30.000
                - In Betriebs-Bankkonto jetzt ein Soll von 30.000

Tabelle 1: Bilanz = Aktiva und Passiva
- Begriffe:
        - Vermögen = Verwendung für Kapital = Aktiva
        - Kapital = Quelle des Kapitals = Passiva
- Bilanz ist immer nur ein Zeit-freeze
- Aktiva: Verwendung von Kapital.
        - Betriebs-Bankkonto-Stand
        - Wertgegenstände (Computer, Autos, Gebäude, ...)
        - Schulden von Kunden (aka. Forderungen)
        <!-- - Erhaltene Dienstleistungen (Steuerberater, Kontoführungsgebühren) <-- vielleicht doch nicht? Welche Einträge müssen in Bilanz stehen? -->
- Passiva: Quellen von Kapital.
        - Eigenkapital
        - Bankdarlehen
        - Schulden an Lieferanten (aka. Verbindlichkeiten)
        - Laufender Gewinn/Verlust
                - Berechnet aus Tabelle 2
 - Jeder Wert in Bilanz: 
        - aktiva:
                - w = Summe(T-Tabelle.haben) - Summe(T-Tabelle.soll)
        - passiva: 
                - w = Summe(T-Tabelle.soll) - Summe(T-Tabelle.haben)
 - Summe Aktiva muss == Summe Passiva


Tabelle 2: Gewinn- und Verlustrechnung
- Im Gegensatz zu Bilanz für einen Zeit*raum*
- Am Ende steht Quartalsgewinn oder -verlust
- Einträge
        - Umsatzerlöse
        - Personalaufwand
        - sonstige Betriebs-Aufwendungen (Steuerberater, Kontoführungsgebühren, ...)
- Jeder Wert in Gewinn- und Verlustrechnung:
        - w = Summe(T-Tabelle.haben) - Summe(T-Tabelle.soll)

Tabllen 3: T-Konten
- Eine T-Konto-Tabelle pro Position in Bilanz (Tabelle 1)
  sowie pro Eintrag in der Gewinn- und Verlustrechnung (Tabelle 2)
- Begriffe:
        - Soll = Erhöhender Faktor
        - Haben = Verringernder Faktor
- Jede Buchung aus Tabelle 0 muss in einer T-Tabelle als Soll und in einer als Haben eingetragen werden
- T-Tabellen enthalten
        - Soll
                - n mal:
                        - Buchungs-ID
                        - Buchungs-Wert [€]
                - summe soll
        - Haben 
                - m mal:
                        - Buchungs-ID
                        - Buchungs-Wert [€]
                - summe haben


Beispiele:

- Wenn ich Geld an die Sparkasse für Kontoführungsgebühren bezahle, vermehrt dieses Geld das Kapital der Sparkasse; darum kommt es unter Soll in der T-Tabelle Sparkasse. Es verringert aber meinen Betriebskontostand, deswegen kommt es als Haben in die T-Tabelle Betriebskontostand.
- Ein Kunde bezahlt für eine Dienstleistung 500€ auf Betriebskonto.
        - T-Betriebskonto: Soll: 500€
        - T-Umsatzerlöse: Haben: 500€
        - Satz: Betriebskonto 500 an Umsatzerlöse 500€
- Umsatzsteuer: auf vorherige Dienstleistung fragt Unternehmen für den Staat noch 19% Ust = Mwst = 95€
        - Satz: Betriebskonto 595€ an Umsatzerlöse 500€, an Verbindlichkeit 95€
        - T-Betriebskonto: Soll: 595
        - T-Umsatzerlöse: Haben: 500
        - T-Verbindlichkeit: Haben: 95