# Ausschreibung


# Projektstrukturplan
Basisdokument in der Projektplanung.
- Projekt
    - Teilprojekt
        - Teilaufgabe
            - Arbeitspaket: geschlossene, delegierbare Aufgaben




# Lastenheft aka. Anforderungskatalog

- Forderungen von Auftraggeber an Auftragnehmer

## Inhalt (grob)

 - Zieldefinition
 - Funktionen
 - Zeitplan
 - Q&A
 - Ressourcen beim Auftraggeber
 - IT-Sicherheit

Alle Ziele sollten sein:
    - Specific
    - Measurable
    - Achievable
    - Relevant
    - Time-bound


### Tipps
- Klar hinzuschreiben, was streng erforderlich ist, wo spielraum herrscht
- Vergleichsprojekte
- zu jedem feature: 
    - warum
    - welcher Nutzern
- zu jedem feature spielraum für lösung/umsetzung lassen, aber auch grenzen nennen
- Mockups, Videos von Nutzerführung 

## Wird zu Pflichtenheft 

- Auftragnehmer liest Lastenheft, und macht daraus Pflichtenheft
- Beschreibt, wie Lastenheft umgesetzt wird
- Konkreter als Lastenheft
- 

## Inhalt (Beispielausarbeitung)
- Einleitung
- Allgemeines
    - Ziel
    - Zweck dieses Dokuments
    - Ausgangssituation
    - Projektbezug
    - Abkürzungen
    - Verteilung und Freigabe
- Konzept
    - Ziel des Anbieters
    - Ziele/Nutzen der Anwender
    - Zielgruppen
- Funktionale Anforderungen
    - ... Liste
- Nichtfunktionale Anforderungen
    - Allgemein
    - Gesetzlich
    - Technisch
- Lieferumfang
    - Umfang
    - Kosten
    - Termin
    - Ansprechpartner
- Eignungskriterien
- Abnahmevoraussetzung


## Verhätltniss zu AGILE
- Lastenhefte stehen nicht in Wiederspruch zu AGILE
- Agile Verträge sind auch Werkverträge (https://github.com/MichaelLangbein/engine3/blob/c5bdbdba7a5eec3762b9369e50f40c2c09b68cd9/scrumTemplate/2_Vertrag.md?plain=1#L357)
- Lastenheft ist in scrum das backlog
- Lastenheft versichert aber budget-, zeit- und ziel-Rahmen für agile.


### Mein Fall
--- Meine Fragen an meinen Arbeitgeber dazu:
        - Was?
            - Zielstellung?
            - Nutzen für Arbeitgeber
            - Nutzen für Nutzer
            - Definition of Done
        - Rahmen
            - wie lange?
            - zu lange als projekt-anforderungen sicher bleiben? -> AGILE?
            - Kann in mehreren kleinen Schritten ausgerollt werden?
        - technisches
            - bevorzugter stack (lang, db, messages, distribution)
                - proprietäres? ArcGIS?
            - bestehende Hardware
            - Installation auf eigener Hardware?
            - Integration, APIs, CI, ...
            - Eigene Formate, versteckte DBs, ...
            - verteilt?
                - Haben sicherlich mindestens Redundanz
            - performance
            - Wachstumspläne, Skalierbarkeit
            - Branchenspezifisches?
        - unbekannte?
            - gemeinsam anteasern
        - AGILE erlaubt? 
            - mein ziel dabei: 
                - *nicht* ändern der ziele
                - sondern feedback bei details ausarbeiten & erkennen von problemen
            - Finanz- und Zeitpuffer für Change-Requests
                - außerdem planen, wie mit Änderungen vorgegangen werden soll
                - das garantiert auch, dass bei Änderungen nicht ein neuer Vertrag aufgesetzt werden muss
            - vertrag dafür: 
                - Werkvertrag: definiert durch Endprodukt
                - Dienstleistungsvertag: definiert durch Arbeitsablauf
                    - Ist eher ein Werkvertrag
                - sollte klausel für "early stopping" enthalten: wenn ich mit anbieter nicht zufrieden bin, kann ich nach einem sprint mit einem anderen weiter machen
                - Schon scrum software da? Gitlab, Jira, ...?
        - Auswahl:
            - Bewertungsmartrix
        - Abnahme:
            - Pentesting erforderlich?
            - Tester zu haben?
        - Alte Erfahrung:
            - Anbieter, mit denen in Vergangenheit gearbeitet?
            - Vergangene Projekte, die gut oder schlecht gelaufen sind?



## Rechtliches

- Vergaberecht:  stellt sicher, dass Aufträge fair und transparent vergeben werden
- Gilt nicht nur für Staat, sondern auch für private Unternehmen in Verkehr, Trinkwasser, Energie
- Grundätze:
    - Wettbewerbsgrundsatz
    - Transparenzgebot
    - Wirtschaftlichkeit
    - Verhältnismäßigkeit
    - Gleichbehandlung
    - Förderung mittelständischer Interessen
- Gesetzliche Grundlagen:
    - Kein einheitliches Gesetz
    - Über EU-Schwellenwert:
        - GWB, 4er Teil
        - VGV (EU-Richtlinie 2014/24-EU)
        - VOB (nur Bauleistungen)
    - Unter EU-Schwellenwert:
        - UVGO
        - Haushaltsrecht bund/länder

- Ist in diesem Fall eine Dienstleistung, kein Bau oder Liefer.
- Ausschreibung muss weit veröffentlicht sein
- Schwellenwert 221.000€, 443.000€ für Energie: National vs EU
- Darüber: EU Ausschreibungs/Kartellrecht
- Darunter: "beschränktes" Ausschreiben erlaubt, unter 10.000 sogar Freihändig
- Nationale Verfahrensarten:
  - öffentliche Ausschreibung:
    - jeder kann teilnehmen
    - veröffentlichen in ausschreibungsdatenbank und/oder zeitung
  - Beschränkt mit Teilnahemwetbewerb
    - auch hier veröffentlicht
    - dann filtern nacht fachkunde, zuverlässigkeit
    - erst dann angebot durch ausgewählte verbleibende
 - Beschränkt ohne Wettbewerb
    - nicht veröffentlicht, unternehmen direkt angeschrieben
    - nur bei unterschreitung, großer dringlichkeit, oder vorher fehlgeschlagener öffentlicher Vergabe
 - Freihändig
    - mit oder ohne Teilnahmewettbewerb
    - falls mit: veröffentlicht
    - bieter können auch direkt kontaktieren

Geeignet:
- 3 kriterien:
    - fachkundig
    - leistungsfähig
    - keine Auschhlussgründe
        - zwingen
            - keine Steuern gezahlt oder betrogen
        - fakulattiv
            - zahlungsunfähig
            - vergangen gegen Umweltpflichten o.ä. verstoßen
- Unternehmen müssen bereits aus ausschreibung erkennen können, ob sie Anforderungen erfüllen
- Darum Eignungskriterien schon in Auftragsbekanntmachung/bzw in Aufforderung zur Interessensbestätigung
- Nachweiß von Eignung:
    - öffentliche Ausschreibung: gleich zum Anfang mit abgeben
    - Teilnahmewettbewerb: schon beim Teilnahmewettbewerb mit abgeben 
- Inhalt:
    - Eigenerklärung: 


Ablauf:
- offenes Verfahren = öffentliche Ausschreibung
    - Vorbereitung:
        - gegenstand genau definieren
        - in teillose/fachlose aufteilbar?
        - kriterien?
            - eignungen,
            - nachweise
            - kriterien
            - <- alle in doukmentation des verfahrens
        - Vergabeunterlagen:
            - leistungsbeschreibung
            - vertragsbedingungen
            - weiteres
    - Bekanntgebung
        - print
        - online
    - Angebote durch unternehmen
        - eventuell Rückfragen an Bieter, dann Frist verlängern
        - wenn hier die Unterlagen und Kriterien des Vergebers nicht stichhaltig sind, muss das Verfahren neu begonnen werden!
    - Öffnungsphase
        - müssen unter vier Augen erst am Stichtag gelesen werden
        - Ausschluss von Angeboten mit Formfehlern
    - Wertungsphase
        - Bieter müssen Eignungsprüfung bestehen:
            - technisch, personell und wirtschaftlich für Auftrag geeignet sein
            - alle geforderten Qualifikationen, Genehmigungen und Referenzen müssen eingereicht worden sein <- können nachgereicht werden
            - Kommunikation ist erlaubt; verhandeln aber nicht
    - wenn zu wenige Angebote, oder zu teuer:
        - dann Verfahren aufheben
    - Absagen versenden
    - Zuschlag vergeben
    - Eventuelle Beschwerden von Abgesagten