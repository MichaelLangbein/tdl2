# Electricty

# Safety

-   Current:

    -   Effect on the Human Body: The amount of current that flows through the body determines the severity of an electric shock.
    -   Even small currents (as low as 0.1 to 0.2 amperes) can be lethal.
    -   Physiological Impact: Currents as low as 10 milliamperes (mA) can cause painful shocks, while 100 mA can be fatal, potentially leading to heart fibrillation or stopping the heart.

-   Voltage:
    -   Potential for Danger: High voltage can cause severe burns and increase the likelihood of electric shock.
    -   However, it’s the current that passes through the body that poses the actual danger.
    -   High voltage meant that electrons really want to flow ... even through air.

# Trivia

-   EU grid:
    -   frequency 50 Hz
    -   230 V at consumer
    -   110.000 V in transmission

## Intro to wind power issues

https://www.youtube.com/watch?v=LklUVkMPl8g&t=60s

-   turning variable turbine speed into grid's 50 Hz
    -   AC to DC **rectifiers**
    -   DC to AC **inverter** with target frequency
-   strong demand for power can make grid-frequency drop

# Physics

-   Stanford lecture slides: https://web.stanford.edu/class/archive/engr/engr40m.1178/slides.html
-   Textbook: https://courses.minia.edu.eg/Attach/9850Fundamentals%20of%20Electric%20Circuits%20(Alexander%20and%20Sadiku),%204th%20Edition.pdf

## Basics

-   Current $I$ [Amp] = electrons per second
-   Voltage $V$ [Volt] = the pull that electrons feel
-   Power $P$ [Watt]
-   Resistence $R$ [Ohm]

Ohm's law:
$$V = I R$$

Power:
$$P = I V$$
Applying Ohm's law:
$$P = I^2 R$$

Transmission losses:
$$\Delta V \tilde l$$

## AC vs DC

-   Edison wanted DC, Tesla AC
-   AC makes it easy to step up or down voltage using transformers
-   DC is more lossy for long cables

## Frequency drops in grids under heavy load

## Three phase transmission has very low losses

## Components

### Fuses

Piece of wire that physically burns away when current exceeds a threshold

### Circuit breaker

A reusable fuse: instead of burning out, pushes away a connection by charging a capacitor or some such.

### Transformers

Increase voltage, reduce current ... or vice versa.

-   2 coils of different nr of loops
-   wrapped around opposite ends of an iron ring
-   (ring is optional, but makes induction stronger)
-   one coil induces current in other

Requires AC. DC doesn't change, so no magnetic field, so no induction.

### Rectifiers

Convert AC to DC

### Inverters

Convert DC to AC

### Antenna

# Hardware

## Power transmission lines

https://www.youtube.com/watch?v=qjY31x0m3d8

-   Losses in long cables
-   Because $\Delta P = I^2 R$, we decrease $I$ by boosting $V$
-   High voltage means electrons really want to flow ... even through air. Lines must prevent arcing.
    -   But insulating lines isn't cost efficient
    -   So lines are simply spaced very far apart: that's why they are on those big towers
-   Towers transmit electricity in **three phases**, with much space between the three lines
-   Additionally, there is a fourth line on top
    -   doesn't carry any current, but protects from lightning

# Südlink

-   Kabel ungefähr 15cm Durchmesser Kupfer (ohne Mantel gerechnet)
-   4.000.000 V (40fache einer normalen Leitung)
-   Versorgt ca 10 Mio Haushalte
-   Kostet wegen Eingraben 4-5 mal so viel wie oberirdische Leitungen
    -   10 Milliarden €
-   Wird im Kern 70 Grad C, um Mantel herum 50 C
-   1.5m tief
    -   Außer für Unterquerung von Hindernissen (Flüsse, Wohngebiete, ...) da tiefer
    -   Wo möglich durch Bergwerke
    -   https://www.youtube.com/watch?v=-hwuPgkGC04
-   700km lang
-   Scheint 3-phasen zu verwenden? Oder vielleicht nur 2?
    -   2 Kabelsysteme in parallel, bestehend aus jeweils:
        -   2x525V
        -   1x Notfallkabel
-   Norden: Tennet, Süden: EnBW?
-   Phasen: https://www.youtube.com/watch?v=6TEQFOr79IQ
    -   Baugrunduntersuchung
        -   Kontaktaufnahme Landwirt
        -   Bestandsaufnahme
        -   Baugrunduntersuchung
        -   Schadensaufnahme: Dokumentieren aller Schäden, Wirtschaftlichkeitsreduzierung
        -   Entschädigung
            -   Einmalzahlung auf Basis höchster Ertragszahlen
