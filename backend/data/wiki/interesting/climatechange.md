# Klimawandel

## Basics

Kraft F [N]
Arbeit W [J] = F*x [N*m] . Auch gegeben in 1 kWh = 3.600.000 J
Leistung P [W] = W / t [J/s]

## Kleinste

1 Fahrradfahrer trampelt mit ~ 100W.
10h fahren kosten 1kWh Energie.

Energie-Preis Deutschland: ~ 30Ct/kWh
= ~ 100 ml Benzin
= 3 min Dusche
= Eine Mahlzeit kochen
= 60 h LED

Ein Deutscher verbraucht etwa 120 kWh Energie am Tag.
(Indien: 20kWh, China: 75kWh, US: )
Der durchschnittliche Stromverbrauch eines 1-Personen-Haushalts in Deutschland liegt bei 1.300 kWh im Jahr [Quelle](https://www.stromauskunft.de/stromverbrauch/wie-viel-strom-verbraucht-eine-person/).

## Größte

| Source  | Rating | Capacity factor |
| ------- | ------ | --------------- |
| nuclear | 1GW    | 85%             |
| wind    | 1-3 MW | 30%             |
| solar   | 1kw/m² | 30%             |

1 household ~ 1000 kWh / month = 1.5 kW

## Levelized cost analysis

### 1. Naive

- Costs:
  - construction: price/MW \* rating
  - operation & maintenance:
- Gains:
  - rating \* capacity-factor \* market-price

### 2. Accounting for discount/inflation/risk

## Verbraucher

(Quellen: - https://de.wikipedia.org/wiki/Bedarf_an_elektrischer_Energie - https://de.wikipedia.org/wiki/Endenergie
)

Beispiel 2014

- Primärenergie: (Öl, Kohle, Uran etc.) --------------------------------------------------------------- 3661 TWh (13.180 PJ)
  - Verluste (KKW hat ca. 50% Wirkungsgrad, AKW ca. 30%) ----------------------------------------------
  - Endenergie ----------------------------------------------------------------------------------------
    - Kraftstoffverbrauch Verkehr ---------------------------------------------------------------------
    - Brennstoffverbrauch Heizung ---------------------------------------------------------------------
    - Bruttostromverbrauch ---------------------------------------------------------------------------- 592 TWh
      - Export ---------------------------------------------------------------------------------------- 68 TWh
      - Nettostromverbrauch --------------------------------------------------------------------------- 524 TWh

Nettostromverbrauch nach Abnehmer:
(Beachte insbesondere Verkehr. Hier geht es um _Strom_, nicht Energie.)
| Abnehmer | Rel | Abs |
|-------------------------------|-----------|---------|
| Industrie: | 46,6 % | 244 TWh |
| Haushalte: | 24,8 % | 130 TWh |
| Handel & Gewerbe: | 14,7 % | 77 TWh |
| Öffentliche Einrichtungen: | 9,9 % | 52 TWh |
| Verkehr: | 2,2 % | 12 TWh |
| Landwirtschaft: | 1,8 % | 10 TWh |

Endenergieverbrauch nach Abnehmer: (2018)
| Sektor | absolut [PJ] | relativ |
|------------------------------------------------|----------------|----------|
| Verkehr | 2.743 | 30,6 % |
| Bergbau, Verarbeitendes Gewerbe (Industrie) | 2.601 | 29,0 % |
| Private Haushalte | 2.320 | 25,8 % |
| Gewerbe, Handel, Dienstleistungen | 1.299 | 14,5 % |

Endenergie nach Energieträger (2018)
|Energieträger | absolut [PJ] | relativ |
|----------------------------------------------|----------------|-----------|
|Kraftstoffe und übrige Mineralölprodukte | 2.693 | 30,0 % |
|Gase | 2.294 | 25,6 % |
|Strom | 1.848 | 20,6 % |
|Brennholz, Brenntorf, Klärschlamm und Müll | 735 | 8,2 % |
|Heizöl leicht | 542 | 6,0 % |
|Fernwärme | 394 | 4,4 % |
|Steinkohle | 360 | 4,0 % |
|Braunkohle | 86 | 1,0 % |
|Heizöl schwer | 11 | 0,1 % |
|Insgesamt | 8.963 | 100,0 % |

<img src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/science/endenergie_nach_sektor.png" />

Endenergie pro Konsument:

- Verkehr: 2743 PJ / 80 Mio / 365 d = 26 kWh / d
- Haushalt: 2320 PJ / 80 Mio / 365 d = 22 kWh / d

## Gesetze

### Primärenergieverbrauch

(Quelle: https://www.umweltbundesamt.de/daten/umweltindikatoren/indikator-primaerenergieverbrauch#wie-ist-die-entwicklung-zu-bewerten )

21 wurde in Deutschland 18 % weniger Primärenergie verbraucht als 1990.
Noch 2006 lag der Verbrauch fast so hoch wie 1990. Seitdem ist er deutlich gesunken.
Im Jahr 2021 stieg der Verbrauch gegenüber dem Jahr 2020 wieder um 2,6 %. Dies ist der zweitniedrigste Wert seit 1990.

Der bisherige ⁠Trend⁠ reicht wahrscheinlich nicht aus, um die Ziele der Bundesregierung zu erreichen.
Diese hat sich 2010 in ihrem Energiekonzept auf eine Senkung des Primärenergieverbrauchs um 20 % bis 2020 und 50 % bis 2050 gegenüber 2008 geeinigt (BMWi, ⁠BMU⁠ 2010).
Der Integrierte Nationale Energie- und Klimaplan (NECP) Deutschlands sieht eine Senkung des Primärenergieverbrauchs um 30 % im Jahre 2030 und um 50 % im Jahre 2050 gegenüber 2008 vor (BReg 2020, Energieeffizienzstrategie 2050).
Das Ziel des Energiekonzeptes für das Jahr 2020 (- 20 % gegenüber 2008) wurde mit einem Rückgang von 17,3 % verfehlt.

### Bruttoendenergieverbrauch

(Quelle: https://www.umweltbundesamt.de/daten/energie/energieverbrauch-nach-energietraegern-sektoren )

Ziel der Bundesregierung war es, den Anteil des Bruttoendenergieverbrauchs bis zum Jahr 2020 auf 18 % und bis zum Jahr 2030 auf 30 % zu steigern.
Der Zielwert von 18 % wurde im Jahr 2020 mit einem Anteil von 19,3 % deutlich übertroffen.

## Paris

Um das 2.0°C Ziel zu erreichen,

### Gebäude

https://www.umweltbundesamt.de/daten/umweltindikatoren/indikator-energieverbrauch-fuer-gebaeude#welche-bedeutung-hat-der-indikator

# Stammtisch

## Windkraft

### Baumaterialien starke GHGs

### Fledermäuse und Vögel

### Wirtschaftlichkeit

- Förderung:

## Elektromobilität

- Elektro bei aktuellem EU-Strom-Mix 20% weniger GHG https://onlinelibrary.wiley.com/doi/full/10.1111/j.1530-9290.2012.00532.x
  - Beinhaltet auch Bau und Wrack

## Solar

- LCA: https://www.mdpi.com/2071-1050/11/9/2539
