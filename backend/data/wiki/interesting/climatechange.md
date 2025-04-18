# Klimawandel

## Basics

-   Kraft $F [N]$
-   Arbeit $W [J] = Fx [Nm]$ . Auch gegeben in 1 kWh = 3.600.000 J
-   Leistung $P [W] = \frac{W}{t} [\frac{J}{s}]$

## Kleinste

1 Fahrradfahrer trampelt mit ~ 100W.
10h fahren kosten 1kWh Energie.

Energie-Preis Deutschland: ~ 30Ct/kWh
= ~ 100 ml Benzin
= 3 min Dusche
= Eine Mahlzeit kochen
= 60 h LED

Ein Deutscher verbraucht etwa 120 kWh Strom am Tag (_nicht_ Primärenergie, die ist höher; mit Heizen sicherlich noch höher).
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

-   Costs:
    -   construction: price/MW \* rating
    -   operation & maintenance:
-   Gains:
    -   rating \* capacity-factor \* market-price

### 2. Accounting for discount/inflation/risk

## Verbraucher

(Quellen: - https://de.wikipedia.org/wiki/Bedarf_an_elektrischer_Energie - https://de.wikipedia.org/wiki/Endenergie
)

Beispiel 2014

-   Primärenergie: (Öl, Kohle, Uran etc.) --------------------------------------------------------------- 3661 TWh (13.180 PJ)
    -   Verluste (KKW hat ca. 50% Wirkungsgrad, AKW ca. 30%) ----------------------------------------------
    -   Endenergie ----------------------------------------------------------------------------------------
        -   Kraftstoffverbrauch Verkehr ---------------------------------------------------------------------
        -   Brennstoffverbrauch Heizung ---------------------------------------------------------------------
        -   Bruttostromverbrauch ---------------------------------------------------------------------------- 592 TWh
            -   Export ---------------------------------------------------------------------------------------- 68 TWh
            -   Nettostromverbrauch --------------------------------------------------------------------------- 524 TWh

Nettostromverbrauch nach Abnehmer:
(Beachte insbesondere Verkehr. Hier geht es um _Strom_, nicht Energie.)
| Abnehmer | Rel | Abs |
|----------------------------|--------|---------|
| Industrie: | 46,6 % | 244 TWh |
| Haushalte: | 24,8 % | 130 TWh |
| Handel & Gewerbe: | 14,7 % | 77 TWh |
| Öffentliche Einrichtungen: | 9,9 % | 52 TWh |
| Verkehr: | 2,2 % | 12 TWh |
| Landwirtschaft: | 1,8 % | 10 TWh |

Endenergieverbrauch nach Abnehmer: (2018)
| Sektor | absolut [PJ] | [TWh] | relativ |
|---------------------------------------------|--------------|-------|---------|
| Verkehr | 2.743 | 9.874 | 30,6 % |
| Bergbau, Verarbeitendes Gewerbe (Industrie) | 2.601 | 9.363 | 29,0 % |
| Private Haushalte | 2.320 | 8.352 | 25,8 % |
| Gewerbe, Handel, Dienstleistungen | 1.299 | 4.676 | 14,5 % |

Endenergie nach Energieträger (2018)
| Energieträger | absolut [PJ] | [TWh] | relativ |
|--------------------------------------------|--------------|--------|---------|
| Kraftstoffe und übrige Mineralölprodukte | 2.693 | 9.694 | 30,0 % |
| Gase | 2.294 | 8.258 | 25,6 % |
| Strom | 1.848 | 6.652 | 20,6 % |
| Brennholz, Brenntorf, Klärschlamm und Müll | 735 | 2646 | 8,2 % |
| Heizöl leicht | 542 | 1951 | 6,0 % |
| Fernwärme | 394 | 1418 | 4,4 % |
| Steinkohle | 360 | 1296 | 4,0 % |
| Braunkohle | 86 | 309 | 1,0 % |
| Heizöl schwer | 11 | 39 | 0,1 % |
| Insgesamt | 8.963 | 32.266 | 100,0 % |

<img src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/science/endenergie_nach_sektor.png" />

Endenergie pro Konsument:

-   Verkehr: 2743 PJ / 80 Mio / 365 d = 26 kWh / d
-   Haushalt: 2320 PJ / 80 Mio / 365 d = 22 kWh / d

## Gesetze

-   Bundesregierung: [CO2-neutral bis 2045](https://www.bundesregierung.de/breg-de/schwerpunkte/klimaschutz/klimaschutzgesetz-2021-1913672)
-   EU: [CO2-neutral bis 2050](https://www.europarl.europa.eu/news/de/press-room/20210419IPR02302/eu-klimaneutralitat-bis-2050-europaisches-parlament-erzielt-einigung-mit-rat)
-   USA: [CO2-neutral bis 2050](https://www.handelsblatt.com/unternehmen/nachhaltigkeit/erderwaermung-zehn-laender-und-noch-mehr-probleme-welche-staaten-bis-wann-klimaneutral-sein-wollen/27739372.html)
-   Russland, China: [CO2-neutral bis 2060](https://www.handelsblatt.com/unternehmen/nachhaltigkeit/erderwaermung-zehn-laender-und-noch-mehr-probleme-welche-staaten-bis-wann-klimaneutral-sein-wollen/27739372.html)
-   Paris:

### Primärenergieverbrauch

(Quelle: https://www.umweltbundesamt.de/daten/umweltindikatoren/indikator-primaerenergieverbrauch#wie-ist-die-entwicklung-zu-bewerten )

21 wurde in Deutschland 18 % weniger Primärenergie verbraucht als 1990.
Noch 2006 lag der Verbrauch fast so hoch wie 1990. Seitdem ist er deutlich gesunken.
Im Jahr 2021 stieg der Verbrauch gegenüber dem Jahr 2020 wieder um 2,6 %. Dies ist der zweitniedrigste Wert seit 1990.

Der bisherige ⁠Trend⁠ reicht wahrscheinlich nicht aus, um die Ziele der Bundesregierung zu erreichen.
Diese hat sich 2010 in ihrem Energiekonzept auf eine **Senkung des Primärenergieverbrauchs um 20 % bis 2020 und 50 % bis 2050 gegenüber 2008** geeinigt (BMWi, ⁠BMU⁠ 2010).
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

## Power2Gas

The only good storage for renewable energy is gas.
But even if we use Germany's full capacity for solar power, we're still not going to produce enough CH4 to service all needs locally.

Proof:

```python
# %%
# %%


# All values in TWh
# = 1e12 Wh

## variables
solarAktuell = 50
windAktuell = 120
solarMaxAusbau = 2_923 # https://www.youtube.com/watch?v=UO1YwnseAR8&t=395s
windMaxAusbau = 750 # https://www.youtube.com/watch?v=UO1YwnseAR8&t=395s


"""
    TODO:
        variable: fraction of houses/business using wärmepumpe, gas, geothermie
"""

#%%
## sources
solar       = {"name": "solar",      "quantity": solarMaxAusbau}
wind        = {"name": "wind",       "quantity": windMaxAusbau}
geothermie  = {"name": "geothermie", "quantity": 10}    # https://www.youtube.com/watch?v=UO1YwnseAR8&t=395s
wasser      = {"name": "wasser",     "quantity": 10}
biomass     = {"name": "biomass",    "quantity": 20}
kohle       = {"name": "kohle",      "quantity": 124}  # https://de.wikipedia.org/wiki/Endenergie
oil         = {"name": "oil",        "quantity": 748}  # https://de.wikipedia.org/wiki/Endenergie


## media
strom   = {"name": "strom",     "required": 0, "produced": 0}
ch4     = {"name": "ch4",       "required": 0, "produced": 0}
waerme  = {"name": "waerme",    "required": 0, "produced": 0}

## sinks
speicher            = {"name": "speicher",              "requirement": 629}  # https://www.youtube.com/watch?v=UO1YwnseAR8&t=395s
verkehrElectro      = {"name": "verkehrElectro",        "requirement": 12}   # https://de.wikipedia.org/wiki/Bedarf_an_elektrischer_Energie
verkehrConv         = {"name": "verkehrConv",           "requirement": 762}  # https://de.wikipedia.org/wiki/Endenergie
industrieStrom      = {"name": "industrieStrom",        "requirement": 244}  # https://de.wikipedia.org/wiki/Bedarf_an_elektrischer_Energie
industrieFuel       = {"name": "industrieFuel",         "requirement": 479}  # https://de.wikipedia.org/wiki/Endenergie + https://de.wikipedia.org/wiki/Bedarf_an_elektrischer_Energie
haushaltStrom       = {"name": "haushaltStrom",         "requirement": 130}  # https://de.wikipedia.org/wiki/Bedarf_an_elektrischer_Energie
haushaltWaermepumpe = {"name": "haushaltWaermepumpe",   "requirement": 1}
haushaltGas         = {"name": "haushaltGas",           "requirement": 1}
haushaltGeo         = {"name": "haushaltGeo",           "requirement": 1}
gewerbeStrom        = {"name": "gewerbeStrom",          "requirement": 77}   # https://de.wikipedia.org/wiki/Bedarf_an_elektrischer_Energie
gewerbeWaermepumpe  = {"name": "gewerbeWaermepumpe",    "requirement": 1}
gewerbeGas          = {"name": "gewerbeGas",            "requirement": 1}
gewerbeGeo          = {"name": "gewerbeGeo",            "requirement": 1}

## graph
productions = [
    {"from": solar,     "to": strom,    "wirkGrad": 1.0},
    {"from": wind,      "to": strom,    "wirkGrad": 1.0},
    {"from": geothermie,"to": waerme,   "wirkGrad": 1.0},
    {"from": wasser,    "to": strom,    "wirkGrad": 1.0},
    {"from": biomass,   "to": strom,    "wirkGrad": 1.0},
    {"from": kohle,     "to": strom,    "wirkGrad": 1.0},
    {"from": oil,       "to": strom,    "wirkGrad": 1.0}
]
conversions = [
    {"from": strom,     "to": ch4,      "wirkGrad": 0.6},
]
consumptions = [
    {"from": ch4,       "to": speicher,             "wirkGrad": 0.6},
    {"from": strom,     "to": verkehrElectro,       "wirkGrad": 0.65},
    {"from": ch4,       "to": verkehrConv,          "wirkGrad": 0.4},
    {"from": strom,     "to": industrieStrom,       "wirkGrad": 0.9},   # actual value unknown
    {"from": ch4,       "to": industrieFuel,        "wirkGrad": 0.5},   # actual value unknown
    {"from": strom,     "to": haushaltStrom,        "wirkGrad": 0.9},
    {"from": strom,     "to": haushaltWaermepumpe,  "wirkGrad": 3.0},
    {"from": ch4,       "to": haushaltGas,          "wirkGrad": 0.9},
    {"from": waerme,    "to": haushaltGeo,          "wirkGrad": 0.9},   # actual value unknown
    {"from": strom,     "to": gewerbeStrom,         "wirkGrad": 0.9},
    {"from": strom,     "to": gewerbeWaermepumpe,   "wirkGrad": 3.0},
    {"from": ch4,       "to": gewerbeGas,           "wirkGrad": 0.9},
    {"from": waerme,    "to": gewerbeGeo,           "wirkGrad": 0.9},   # actual value unknown
]


for consumption in consumptions:
    consumer = consumption["to"]
    medium = consumption["from"]
    wirkGrad = consumption["wirkGrad"]
    requirement = consumer["requirement"] / wirkGrad
    medium["required"] += requirement

for production in productions:
    producer = production["from"]
    medium = production["to"]
    wirkGrad = production["wirkGrad"]
    medium["produced"] += producer["quantity"] * wirkGrad

for conversion in conversions:
    source = conversion["from"]
    sink = conversion["to"]
    deficit = sink["required"] - sink["produced"]
    if deficit > 0:
        overproduction = source["produced"] - source["required"]
        if overproduction > 0:
            transfer = min(deficit, overproduction * conversion["wirkGrad"])
            source["required"] += transfer / conversion["wirkGrad"]
            sink["produced"] += transfer

for medium in [strom, ch4, waerme]:
    if medium["produced"] < medium["required"]:
        print(f"Not enough: ", medium)




# %%


# %%

```

# Stammtisch

## Windkraft

### Baumaterialien starke GHGs

### Fledermäuse und Vögel

### Wirtschaftlichkeit

-   Förderung:

## Elektromobilität

-   Elektro bei aktuellem EU-Strom-Mix 20% weniger GHG https://onlinelibrary.wiley.com/doi/full/10.1111/j.1530-9290.2012.00532.x
    -   Beinhaltet auch Bau und Wrack
-   Batterie zwischen 50 - 150 kWh, d.h. ein Auto kann einen 1-Personen-Haushalt einen halben bis ganzen Tag lang versorgen

## Solar

-   LCA: https://www.mdpi.com/2071-1050/11/9/2539

## Plastik

-   Plastics:
    -   2 - 6 kg CO2_eq / kg
        -   2 kg CO2_eq / kg Plastik (https://www.sciencemediacenter.de/alle-angebote/research-in-context/details/news/plastikproduktion-verursacht-enorme-treibhausgas-emissionen)
        -   6: https://timeforchange.org/plastic-bags-and-plastic-bottles-co2-emissions-during-their-lifetime/
    -   Amount: 410 Mio Ton / a, world (https://www.statista.com/statistics/282732/global-production-of-plastics-since-1950/)
        -   thus about 1_000 Mio Ton CO2_eq / a
        -   Compare to aviation: 280 Mio Ton CO2_eq / a (https://www.bing.com/search?q=global+air+traffic+CO2+equivalent+annual+production&toWww=1&redig=115191D6D7A74AEE82600863521A9782)
    -   Ends up as ... (https://www.oecd.org/en/about/news/press-releases/2022/02/plastic-pollution-is-growing-relentlessly-as-waste-management-and-recycling-fall-short.html)
        -   recycled: 10%
        -   incinerated: 20%
        -   landfills: 50%
        -   lost to environment: 20%
