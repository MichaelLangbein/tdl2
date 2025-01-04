# Electricty

# Safety

-   Current:

    -   Effect on the Human Body: The amount of current that flows through the body determines the severity of an electric shock.
    -   Even small currents (as low as 0.1 to 0.2 amperes) can be lethal.
    -   Physiological Impact: Currents as low as 10 milliamperes (mA) can cause painful shocks, while 100 mA can be fatal, potentially leading to heart fibrillation or stopping the heart.

-   Voltage:
    -   It's the current, not the voltage, that passes through the body that poses the actual danger.
    -   High voltage meant that electrons really want to flow ... even through air.

> Effects of current:
>
> -   1mA: tingling
> -   10mA: spasm, potentially hard to let go of wire
> -   50mA: potentially lethal through fibrillation
>
> AC is more likely to cause fibrilation than DC.
>
> Body resistance:
>
> -   dry skin: $500.000 - 1.000.000 \Omega$
> -   wet skin: $1.000 - 100.000 \Omega$
> -   tongue: $1.000 - 20.000 \Omega$
> -   **But**: [at > 500V, human skin resistance breaks down to $500 \Omega$](https://pmc.ncbi.nlm.nih.gov/articles/PMC2763825/#:~:text=At%20500%20V%20or%20more%2C%20high%20resistance%20in%20the%20outer,of%20the%20skin%20breaks%20down.&text=This%20lowers%20the%20body's%20resistance,that%20can%20be%20easily%20overlooked.)
>     -   at this voltage the skin ionizes and becomes conductive

> > Example: touching outlet with dry or wet skin
> >
> > -   dry skin: 0.23 mA ... barely noticable
> > -   wet skin: 230 mA ... **deadly**.
> >     -   **worse yet**: 230 mA will not yet trip your breaker!
> >     -   They start at 16 A. So the breaker will not save you.

## Why birds can sit on power lines

Ive seen a video of a worker working on a high power transmission line. He was wearing a faraday-suit.
He was dropped from a helicopter onto the wire. The worker touches two wires at the same time while working.

Lets say the worker has a 0 voltage relative to ground initially.
Upon touching the wire, his faraday suit takes on the several thousand volts of the cable ...
but since the voltage has no where to go, after the initial change in voltage no current flows through the worker.
If however the worker were to touch the metal towers holding the wires,
which are grounded and therefore have 0 voltage relative to ground, while still standing on the wires,
then current would flow through him.

# Physics

-   Stanford lecture slides: https://web.stanford.edu/class/archive/engr/engr40m.1178/slides.html
-   Textbook: https://courses.minia.edu.eg/Attach/9850Fundamentals%20of%20Electric%20Circuits%20(Alexander%20and%20Sadiku),%204th%20Edition.pdf

## Basics

-   **Resistance** $R$ [Ohm]. $R = \rho L[m] / A[m^2]$
    -   $rho$: resistivity: $\rho_{copper} \approx 1.77 \cdot 10^{-8} \Omega m$
-   **Charge** $Q$ [Coulomb]. $1 C \approx 6.2 \cdot 10^{18}$ electron charges
-   **Current** $I$ [Amp] = electrons per second $I = Q/t$
-   **Voltage** $V$ [Volt] = the pull that electrons feel
    -   Ohm's law: $V = I R$
-   **Power** $P$ [Watt]: $P = I V$
    -   $V$ here refers to the voltage drop over the consumer.
        -   Say for example there is a 10W lamp in a circuit that conducts 0.85A. This means that between the start and the end of the lamp's fitting, 11.76V of voltage will be dropped.
    -   Applying Ohm's law: $P = I^2 R$
    -   Power has the same unit as mechanical work on purpose. The work put into a system by me turning a dynamo must equal the work taken from the system through resistance-losses and consumer-appliances.
        -   Relation to mechanical terms:
            -   Energy $E [J] = F x$
            -   Power $P [W] = E/t$
-   **Technical (aka conventional) current** is the flow of positive charges. Physical current is the flow of electrons, and opposite to technical current.
    -   Arrows in diagrams (like for a diode) point in the direction of _technical_ current.

> **Example**: Südlink current
>
> Given:
>
> -   15cm diameter copper cable
> -   700km long
> -   525 kV voltage
>
> Resistence $R = \rho L / A \approx 0.7 \Omega$
>
> $I = V / R \approx 750 kA$
>
> > Note that Südlink voltage is very comparable to ordinary over-ground cables. The only difference is in the distance it needs to cover ... which is why it uses such a big diameter. Other than that its a perfectly ordinary cable.
>
> > Cables lose energy during transmission. The lost power is $P = I^2 R$.
> >
> > -   We've already reduced $R$ by increasing the diameter
> > -   We further reduce it by reducing $I$ (while using higher $V$) through a transformer. Power lines in general have relatively low current, but very high voltage.

Reason why power lines use very high voltage:
https://www.youtube.com/watch?v=jcY4QN7awEc

## Kirchoff laws

-   Consider the number 8 on a digital clock
    -   it has 2 nodes and 3 loops
-   **Node-law** (current): at every node, $\sum_{i \in In} A_i = \sum_{j \in Out} A_j$
-   **Loop-law** (voltage): for every node, $\sum_{i \in Loop} V_i = 0$

Exercises: https://raeng.org.uk/media/wlelusmo/8-kirchhoffs-laws.pdf

## Electro magnetism

Relevant for building antenna's etc.

Faraday's law:
$$\nabla E = - \frac{dB}{dt}$$
Ampere's law:
$$\nabla B = a - b \frac{dE}{dt}$$

## Active, apparent, reactive power

-   Apparent power $P = U I$
-   Some power is _stored_ in inductors and capacitors without causing work: https://www.youtube.com/watch?v=ZwkNTwWJP5k
    -   Active power / Wirkungsleistung [W]
    -   Reactive power / Bindungsleistung [VA]
        -   In AC circuits with inductors and capacitors, there is an ongoing loss of reactive power, while in DC systems there is only an initial loss while capacitors charge and inductors induct.
        -   Too much reactive power implies not only more power drawn, but also a voltage drop
    -   Power factor = active power / apparent power

# Components

## Grid base parameters

-   EU grid:
    -   frequency 50 Hz
    -   230 V at consumer
    -   about 110.000 V in transmission
-   US grid:
    -   frequency 60 Hz
    -   120 V

## Switch

There is not much to know about the humble switch ... except one thing: switches in DC circuits are _much_ more prone to arc-ing!
https://www.youtube.com/watch?v=Zez2r1RPpWY

## Fuses

Piece of wire that physically burns away when current exceeds a threshold

## Circuit breaker

A reusable fuse: instead of burning out, pushes away a connection by charging a capacitor or some such.

## Grounds

...

## Transformers

Increase voltage, reduce current ... or vice versa.

-   2 coils of different nr of loops
-   wrapped around opposite ends of an iron ring
-   (ring is optional, but makes induction stronger)
-   one coil induces current in other

Important to know:

-   Requires AC. DC doesn't change, so no magnetic field, so no induction.
-   Imagine a transformer, battery on left loop and load on right loop. The load on the right means that there is a voltage drop over the left (and right) side of the transformer.

$$\frac{V_1}{V_2} = \frac{N_1}{N_2}$$
$$\frac{I_1}{I_2} = \frac{N_2}{N_1}$$

Build your own: https://www.youtube.com/watch?v=2cxcP5lY7K4

-   Coils are magnets

## Capacitors and inductors

|          | capacitor                                                   | inductor                                                    |
| -------- | ----------------------------------------------------------- | ----------------------------------------------------------- |
| function | store and release energy                                    | store and release energy                                    |
| physics  | two separated plates, being charged up with load            | a coil building up a magnetic field                         |
| DC       | block current after a while                                 | allow current to pass after a while                         |
| AC       | cause phase shift where current leads voltage by 90 degrees | cause phase shift where voltage leads current by 90 degrees |

## Diodes

-   Allow power to pass in one direction but not the other.
-   LEDs are light emitting diodes.

<img src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/science/Diode.png">

## Transistors

### NPN

https://www.youtube.com/watch?v=-qRNJhU1OLM&t=18s

-   Like a switch, but not opened/closed manually, but based on whether or not current goes in through the control wire (base) to the emitter.
-   Basically: needs a tiny stream of current from the top (=base) to emitter ...
-   ... which then allows a large current from collector to emitter.

Two types:

-   PNP
-   NPN

<img width="50%" src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/science/circuit_npn_transistor.svg">

<img src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/science/circuit_transistor.png">

https://falstad.com/circuit/circuitjs.html?ctz=CQAgjCAMB0l3BWcMBMcUHYMGZIA4UA2ATmIxABZIQkLsaBTAWjDACgB3EPOS7FEITx4+AyJ0HDRkkQgyEoEobPkgMeCjVXiuGlQuIVNchTpCHNdAXn7TxAN0EYBKKmo0hX1ahDQ0oATAIbABOgggKmAKEESDYQgEIZjGRzk4ubmbqml7umvEi4mB4ENlaCnrlARTF0IRgxPwIFMSQKHgYFEhgvGB+MJoDbI4WVaNWgZTU-YHQwQAu3GAK2B4lChM+UNAYkNj7HUY9KD0I9DDyKAitFBjEhHRGmj3UACYMAGYAhgCuADbzCRlApLFYeZJSCYpOIJcQADyWxE88XAuHIKGwSOeIgAagwQgBPAA6AGcOAwvgBrUkAQQAwqSABQIHEASlJ0E5pIARj95qSSfMQgB7AB2AHNSQxRcKfuKABak+bC0lfADG8wAlvYvvMGEqQl9RSTNYLhSE2AjiDZKCVwPUsR5sSA8YSBUKxZKSdzdXq3STGWg2Ryud6+aS1UbSWK-sSSQAHH4kxVk+XSiOakJqn6a-kksCqjXa3UMEkGo0ms0Wq0dSgUEQ9DC0BAQHKaOmZ7O50koS3cPxoTStERochtkAdrM5vPsYXmQSDKakTw+OoBARI7BsIA

### MOSFET

-   Like a NPN ... but doesn't require _current_ to go through base, but only voltage to be felt at it
-   Much easier to make circuits from. Good for H-bridge inverters, for example.
-   Can be activated without being put in line of main-curcuit (contrary to NPN): attaching an arduino's output _without inlining_ is already enough to activate.
-   https://www.youtube.com/watch?v=AwRJsze_9m4
-

<img src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/science/circuit_mosfet.png">

https://falstad.com/circuit/circuitjs.html?ctz=CQAgjCAMB0l3BWcMBMcUHYMGZIA4UA2ATmIxABZykLsQEBTAWjDACgAzejQkbNEIQwo+A-uGhIYkFGwDug4X0gVFIlAl6R5akBt544ezVB1CRtEeb7YtbAE4hDkSuOuWo4NgDdKR-i4UxLwBnoEuUmGSbADOlMGiESh4iZ4QHACGADYxDDoIyakIPKnaCkEhAhWuItqO1R4URh4uYHA6TYHinaU+Ts3izsZank16LhNQ0QAeesQQRHS05ES8qiiqAMIA9gB2AC7221kAOjEAxgCW9ucArpf7bLPJxHp4r7S8KMQW4CkA6gwMgBrM7eY77DIAcwYZwAFAgAGoASiegmw63wIAweC+rEoelUAAV7JcALYZewATzOVxu90eswQ2DoGJchDEtAJYBS5z2uwY532lz2aMIGL0GmQhHWhVUPJAAGVDnsofC0CiADRnABGt32Zz2WRpMXst12MTOlw4ZwAsgB5RUAMQAogAVXUZXJnDJCy7eDL7BgAEzY208MtGkFI4ymtT0nmwbCAA

-   N channel MOSFET:
    -   power-supply on drain-side
    -   if voltage between gate and source ...
    -   ... then conventional current flows from drain to source
    -   Thus: conventional current goes in through drain, only if voltage between gate and drain
        -   opened by ingoing voltage
-   P channel MOSFET:
    -   power-supply on source-side
    -   if _no_ voltage between gate and source ...
    -   ... then conventional current flows from source to drain
    -   Thus: conventional current goes in through source, but is blocked if voltage between gate and source
        -   closed by ingoing voltage

<img src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/science/circuit-mosfets.png">

## 555-timer IC

https://www.youtube.com/watch?v=oZzjmAbyyIQ
(PS: exists in falstad)
https://www.youtube.com/watch?v=qfWIjb48mjE
https://www.youtube.com/watch?v=APghHcA-MOI

# Circuits

## Conventions

Many circuits require a secondary (usually very low) external power supply.
Very commonly these are drawn in a diagram with:

-   a single-pole voltage provided from the top
-   a ground at the bottom
-   This is understood to mean a secondary small power supply which isnt too interesting for this diagram.
-   On a breadboard, all those grounds would be connected on one end of the board, and all the sources on the other.
-

The [transistor inverter](#signal-inverter-aka-transistor-inverter) is a good example of this.

## Signal inverter aka transistor inverter

-   Takes a signal on one side and outputs the anti-signal on other side
    -   requires an external power supply
-   Not to be confused with DC-to-AC inverter
-   https://www.youtube.com/watch?v=8c8NLfAP4oY

## Rectifiers

Convert AC to DC

<img src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/science/circuit_rectifier.png">

https://falstad.com/circuit/circuitjs.html?ctz=CQAgjCAMB0l3BWcMBMcUHYMGZIA4UA2ATmIxAUgpABZsKBTAWjDACgA3WuW4w7qtjw0o4btSqToCNgBMQhGlTooQGNCGwbVshgDMAhgFcANgBc5IPDxVqNWqjv3HzljJBEIaIxcq0gnQ1MLeXdPbysbf0CXCwB3AU1hBSVaf0g2BKVlPki-VQywPAgwSAR+IRFS8t5+QTBsaAdsd2wwQiwML2QqMA0YEQG2AGMrRU1sfjxxhD7aKFgkRsxCOAw6FsgUBvoYOAgMhPVBDWmRbEmoTLUPCgizijnDsfPL6ork54fZ1Xfaq4A9moUqIlKQJNA8KJVORsGwgA

Capacitor is there only for smoothing out.

## Inverters

-   Convert DC to AC.

### H-bridge design

-   Ciruit below is known as **H-bridge** inverter
    -   https://www.youtube.com/watch?v=3N_4VpzmKY0&pp=ygURSCBicmlkZ2UgaW52ZXJ0ZXI%3D
    -   Personally, I like to think that current flows through the H first in the shape of a $S$, then in the shape of a $2$

<img src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/science/circuit_inverter.png">

https://falstad.com/circuit/circuitjs.html?ctz=CQAgjCAMB0l3BWcMBMcUHYMGZIA4UA2ATmIxAUgpABZsKBTAWjDACgA3EQmqvGvN14gMkGlAnCkVGdARsA7kKqjxpFCLFRFIdZrXENOQtqV68cXYZD9BkHeYFWNxMBvtnrevWEgITHs7I-srBATo8VL4hkTZO9gDOQcZBFjLgIABmAIYANgkMbEnebkF66Tn5hZ4atuA0wnWBeqrgYNgmrYGsHfptvSnd7Z38-SZ4YOFKPeOTY7qlQ70+w2Gm89EmPn5T8xMmbti1c90NfE5gZzYnOpeNc+0ogvvaSTMive8YoxV5BUXzVwad7lDKVf5gCbgFBHa4HI7PE4gbC4WCEbCsMgoM78ci+KJoKDQcQwGhsAD2IBQGh4kkgpGoMDsVKpGmwFNZQjpDOkxIyGmpyLYQA

-   Phase 1: open switches TL and BR, close switches TR and BL
-   Phase 2: open switches TR and BL, close switches TL and BR

The faster you do this, the higher the frequency.
Switching is usually done with electronically controlled switches (so called transistors), not manually.

Instructions:

-   using a single transistor: https://www.youtube.com/watch?v=XrJ_zLWFGFw&list=PLlBVuTSjOrclb0iCMSRpS_H1lSrlSVeEm&index=16&t=35s&pp=iAQB
-   controlling an h-bridge: https://www.youtube.com/watch?v=YU17L650k3s&list=PLlBVuTSjOrclb0iCMSRpS_H1lSrlSVeEm&index=17&t=3s&pp=iAQB

<br/>

Using resistors is pretty important to make sure mosfets are usually off.
<img src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/science/circuit_inverter_with_rhythm.png">
Note that this simple setup of mine seems to be highly sensitive to different voltages on rhythm circuit and power circuit.
https://falstad.com/circuit/circuitjs.html?ctz=CQAgjCAMB0l3BWcMBMcUHYMGZIA4UA2ATmIxAUgpABZsKBTAWjDACgA3W4wkbNbrzA0aUMTSpIq06AjYB3QeBFL+UBapS0wvNZA25RawyEKj9ik-yrZCePgIvbdWmjtPmDkUWGJaTKBLqim5Cfs4ggdJePuHYtuDhTth4sa7uvlr6YHgQ8WH+qYlZfJBgsAhgmEQ0eJCYQnDgjtDmrTEgPKVpwd2RGP7eDtEh7tUR1r2hnbzTmeoAZpEIvHV9a-HgslCwKGxLKaJr0xv05VK7+8u8KCt9ty5bF-VXtvYPER9q5zsvlkUbOwgNZOKLAqgfEEdNRfLIaSEQu5mdQAJ2uDnRyKoYHgySBGwQWihlnxNiBWIMQOMQz0bDRbwxDKxyHgBkJ4OUPgwvCc02MVLhijBa3cxImAhoXUm+jRHzld2lLLg8IVAisjkp9kmfI19KBXwF0iVePedxQeHsEmiaIyhGxqyNOLpnMiQWEXJ5yGdYzdLkdMpdVsiFtoTWxoLNd3c0s44BubpUYOxoeoRpgckUtvtrpGgaa7pz6gAHpFSIk+GAkChXK6QAAFNgliTESJUGi3SL0USBeuN4P+SWllvYdnd0QAOT7bjyNFm5r4g7HIEnJcoLbQLYQWEiVVotbrAHt5AwUX2WJVXWdXbNawAlAAWAE8AC73gC2AB0AM4AYwAliiP4AK5-s+bAHsgHjiJAZYoNsqBiFoOJ8GwQA

The rhythm circuit can be done several ways:

-   https://www.youtube.com/watch?v=UZzHGHWUAYs&list=PLI2e9uYepNRmrnZXpWdW5nd_fUnmAsvwD&index=5
-   https://www.youtube.com/watch?v=zASxHFxf6oY&t=618s

http://falstad.com/circuit/circuitjs.html?ctz=CQAgjCAMB0l3BWK0CcAWAHAdiwZgRrgGz4YIBMRIauIWICkDApgLRhgBQA7uGOeBQCOA8uTRQefUePBYqYiZE4BjaSEXryGDNRC429XNCJE04rOQSmsaMPKow4EZQHMtO9bkhLJAJ3UwIXUzKHB4eCkREFDxJlDlACUQiQx43yY0JjAmXOQETjAiJHsqFCoggXKY5HhiEh1IcpQEPFx5KTiYiW8JBKle7v0fcG1JXnxhIiZBotyBinBp-UXcAWUAyf0pmfXwyN457aXs4OVD-kEdq-GTm9Kbtw1LDWtn0Rf5gDM6cmzltL-XbgaBIJzkKRZIHUTB3c7UOB3LZHeGWaFooaov5DdA9dacH6444oYJrY5gUG1CG8QEgaoYWHVeG0+mIsnMxGs7JoJRSEkCRnBJl8oVlMbCmmIh60zTKMAYCAM3TVITKxzDLAmQgIIJEElYDAoSC0HLZbEwJTQNAiqZ04KsWEcpiafkaWTw10O3QcBkgL23H0Sf2B6i6eEhzQh6LKABufF90RDjrCWQYYVyoJtdLKwTAPNursj8oksqzLtz8gL9thtP9Tr9NcR814ZnR2JRnAALjDdOwqDqBH2whBWChUCSSKQ5uRiPQnHB6rgUAryq1yCS0BVEQATZhfACGAFcADadqQDhu6C+sdmQ2FHVtwqKXULROvPwewtZMd8-PAVKhaSKclKXBAk6TGI5XSOMkKTBWBqQYS5-SIWR33cC8mAvbQw1uXBfX9a9HU4TZsX9fCg2TU14R5XQyVov1gI2HtjgYlF9nhVDKN0f8lluLjLwg71lmUAAPcAyG2WhcFwPEqBLCQABUAEsAFtmD8AAdABnFRlL8FRD2Us9xJ5QcSBieU-WWBSQAAZWU1wADt92PHTlKcmMNM7DTOHEwheyIegcnzVhQlsgAJVgACE-GU7dXGYdzPO83yAHsNBQTEERJNMYD2UQstwTggA

### Alternative setup including a transformer

There is a somewhat simpler setup, which only requires two transistors.

#### Variant without clock:

This variant has no external clock ... but it seems to have an inconsistent frequency:

<img src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/science/circuit_inverter2.png">

https://falstad.com/circuit/circuitjs.html?ctz=CQAgjCAMB0l3BWEBmAHAJmgdgGzoRmACzICcpkORIRkISJ9ApgLRhgBQAbjUar-xyR+RPlHG1w6cXRgIOYHKRCpFNVHSEiNE8FGjIEWSGGSKwpLAmS0wWEC0xC4OPGhxHDw-ZGQmcaOh+vjhgqGb2MOQcAC4g6FjSyDj8yakp8XowcEQJYJBYprjCnsj6ZgiQfMlg6KGQ1jbgcCAAJkwAZgCGAK4ANjGx8Yn06On8CGMoeiww+KRaucj4JsSG+liWCKQIAWFERlio1Pl07d39gwDuIFrqmt541JAcN3dEandj-C9v3t8oDIA36A-gAtIoSZQV63R7oagQp7Qm6I+Gg+iiZHotAIjKiH4wiH49EIWpYoliYnEkEJJIZWoTTEvABOUkZJymSLopxBDNuaNRzxhtNG-HYdIJrPF6OlwOacBhstQ43iyuhYQgqhwNDUWvu4l2pGgRCONnQpGIBAI8qksmN+iIHAA9uBlFQJJByCpudBtXRpBYUBwgA

#### Variant with clock:

This variant does use a clock (an 555-IC).
This video is an excellent explanation and very practical: https://www.youtube.com/watch?v=kMU8xiGCpd0

## Example: wind turbine -> HVDC -> Lamp

### Variant 1: with H-bridge inverter

<img src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/science/circuit_windturbine_H.png">

http://falstad.com/circuit/circuitjs.html?ctz=CQAgjCAMB0l3BWcAOaAmA7MgnGB-kA2MAFgwTRAGYMRaFIQEBTAWjDACgB3cMSsNgH8QaNCSg8+lMRLAZCo8ZIDG0pXJFpkyEBMKx4R45DBtaBhNgzZCJEmkIYwySAkUw4ESJwDm67V0OSipICUYfACd1QWFKOyhwEylgkATxRgSfACV1BNc08MSSRjAIxJgETjBCJHlFW3AhEEaG6GxsSCoKFwRumiEpDMLqMJGfXlD9CSnwbUlJinBCRlmaiKlugRXqJapKKN2Q7dWDpPgUnf3l0uaJmOb1poPL24EFZ8l-TBl3UQwZACKpwAGZ0NClHauSGncDQJCeNBSEowvQkII7e4om5HHH3AGognjKREhLYezUF5g8kzSgdY6UuEI2BI3jQlqKZDojkLEDsxrs673fmcuDgCn3el6XRSxqS5qNIQyjxSdn1Pli2SSFwQLnKlrzOXUUiwGokBAKDphOxyMX8CLQcKOqRSmotZqsbnCzXKKVa+WUT1BFwSIO8jhcjR8SOpAM810Sl3NLURiT+pMyX2PD5xsPssPexh5sUbXh2QkQvGcAAuaN07EUCBEDcS3mgtXECjc2CbFpIVDbhGQ8gUA4YkGwyCoOHOIAAJswQQBDACuABtq1Im4HuduQKwhcjuU9y1XeKkEqkCylm9z9kWvaC6FRFG61YprmB4VAWU+lTjXSuARv0RLdb10QhlGvfw90YPdAmBSZIzDPdr2ie99zvZCvXOLE70oex6zdQ5CMZUinlKC4yyg7kMBfZZeUg0NuX-CjOAADxQJB9ioagqFpRQ0wkAAVABLABbZhIgAHQAZxUUTIhUFdRM3Tj7EDQheOIesdiEkAAGVRN8AA7Jc1zk0STIANyk6spI4vlp33JwkgpVgEn0gAJVgACFIlEudfGYSybLshzrIYz1j0UVgKF0Uo9Eoiofyqc9YviqM4vmHxhKyzKqHo6KEr0H80CQVhPEQIcBzAF8wkCGpeIPaBCrEXBkBsEh5B6Kg2Dqn8OmwTg5z0RpPTFfsdwKSgF2XddN1GqbMIKEhxvcRhZsXVcNxGpgdiDRg1oynYtvm3alvG7ENpWzb522hbkXWnZahO0sxti7FXswkspG+uKoTdAH3v+7Epx3X7JiKzKbsO3lCs+7llrhnxOKbIsrAgFZsH3BAdFK5RsmYFRq1EkFRIczi4tDfBeJIDKGAJiQABEAE8zPEgB7ThoiB0itWKxIGBvbDg0jR9zxDaVwH2XQJZlj5Ujqj4Jve1MYhoV8RHuOr5mPWXccxVUgZu3X6xu4VrlVhXPt+zjSGbNAB3FYd9zEOXRAkLyADVmYAYU4NRQbFf6bqdNx93kWBrGnQhrABGoMDGDYqYhWg4bi5qyFofSAHUrLnOTqxXSIACMrOYRzCEg3HsF4sooKsI7PZAFRObCyJSZM3wi85uT-bkkFOZk2Tq0iJcTNkgAHYe1PAchdn0bpdhzlu25MsfObXNcrJ72Tp+YZhC9kzmQTknzS4CoKQv37hVJUAALZhZMcg9IFoRwJCT0RXO84yH7kioJcU8lwKWrKzOSrAAB8ck1yc24IPSIzAACOK5mAmRUKzV+5ofpIH7BVEoBEW5+3brZTuu9e5yQfv-OS1kt7ViXMFQew8i7j0njPTunBOaiBxlkJKHQmA-iKDIHGVBOBAA

### Variant 2: with transformer inverter

<img src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/science/circuit_windturbine_T.png">

http://falstad.com/circuit/circuitjs.html?ctz=CQAgjCAMB0l3BWEAmaCDsBOSBmHnMx0xMdIA2ckBTEdayagUwFowwAoAd3DGXEz92-ZMgAsUbrxHjw6KqImQOAY2kpZwlAA5tICeVjxjJyGFb0x0MHBzl2YHOnQIxemHAjKA5uuS71MiVJACd1EiE+EHJgmxMpLRiUMUYk5QAldSTtVODGFPBGIqg0DjByJCIqTCoIkBrokvgUgkwEPhIYwUcpcVyQIOilKUGkwb53EYQhckZx2ckeHGnwBeX+HH5lMPWBmbmtwvgEtf2BLYSouvLGOuUeG-O5WsFJX2R0EQQFT5Rfoo4ADM6MhbgscmCDuA0E1kFIUpD9G5VgCeAiUQMVo97iAIfUqHjNotcXB8STbmJhjw8VVyRoqXSWMi8aihojPojlAAXJF6NhUdr8flQcAgFiYaCtBDaAjoMQYT7yJpwMRxSDTZBgBA4Nya5C1UkAEyYgIAhgBXAA2XKkgrFyLtLCJOMpekeMU5l34SS0TMmDyifr2jCDymB6Dsqzp5T20KQHjhPEdyPIslDHF8dsYdv87mJOG0EiDycmO1B9r0BaLyNuxzRyKJrrFMe2vNjTexRxxqeregjtSoygAHuBtEhNjgBjq9lQJLIACoASwAtkwQgAdADOKkXIRU5sXNpHlKF5En9j5CznEgAyovvAA7U2WreLh8ANzXXLXHHfUaZyIxiw0x5hABQ2CKRSlA8VDAf49JiiBkjzghcGVpGAF5ko0DIEgLAeGYgiEG4bjsGI5CFtqYoeEQRDTAQ7TkbMBBbJKBAcIa+gNEypJiESfqMPwxpmlaNqcXxQpuPk3HfIJIDCRa1ocdQCwCVxsGySg8kmopYnqfapKaWpQk6aJ8IyQsFQaQsLrceiVkGayDnAeCQGad23yObi-HojieAafBRlSfmGFNhJFYAiO7QhjQEDMYhATXiA6RMCoXKLoCi4-iOwFFggVHkYhCD5MkIAACIAJ5PsuAD2HBhEBTaKPaNYMFImCUmKPqbJeDKOEqTpCE4sG+VIMqwUS-UTRcDw9V1EiOPBLmstobkLItfLuWNPmklNXnDuAqpCsgOAQGApFiqIehJQAEgAamVADCqjRJ5PGpG9mnYeq1HQHYlIVJg2j4IIrjoNo9CRZdkD0GpwGTkyzj6KVADqb6GluXLmiEABGb5MBwI6UEKNCTjYaY0CVsgqDVH5fm+3iYzVW5PVugI1Rum5ciEpoPpuAAOHNHnI46uNEyyYpYpU0w+3M1ZaloM1uAtMEwGObjVgJbjdLA4yEi6Gt4TDK1wh4qAAFkwm6E2KZD0PqEjoIJ5BS7IN33ubW4qKa-OmjuXIVVuLAAHxbpaNVcGzIRMAAjuaTAPioFU20yeEpEgfFp5A-BJY9tOfiE6UPozXPM5u5se1u77y1yppG2zHOYzzfOC4XZTkLQ7CQAt8EdT3WElLhv1wMx2oQ9qZg2DQw9wJqWCUiQEyUkD51ND2+DFe0RBO+U7hsWNpJBoWfI1mNOQIXizU4n3Qy4si6Y8DfEy4ufV9lKtvDd7fXf9yKZA0adaKyAiJjiOOAcsMBsJiHap1FgSQb4NBxONMkeJEFjW4kSZBaCRxtCQKCMmuE9CglnKVAAknTQua4tymy5J7LmzdNzsxCKuEINsagQHEENSM4gM6lRSoac0O5i5VxrnXY2jDG7blppuc0LCOA1ToAYYILRaAwC1KmeMsA+Dxi0nKAY8jxa33yJAAgKAYSQNFN6ScOAOBAA

<img src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/science/circuit_windturbine_calculated.jpg">

## Effects of different sources and sinks

**Load** [W]: sum of all consumers' power-demands.

-   in a circuit, load should equal provided power
    -   (capacitors can dampen this a little bit)
    -   batteries provide power on demand,
    -   but wind-turbines provide power based on wind, not on demand.

|     | Battery or coal power | Wind turbine | Lamp (=consumer) |
| --- | --------------------- | ------------ | ---------------- |
| $V$ | fixed                 | fixed        |                  |
| $P$ |                       |              | fixed            |
| $I$ | $f(consumers)$        | $f(wind)$    |                  |

-   Battery:
    -   delivers fixed $V$
    -   delivers as much $I$ to satisfy the consumer's $P$
-   Wind
    -   delivers fixed $V$
    -   delivers variable $I$, but _not_ as function of consumers, but as function of wind strength
-   thus, to satisfy consumers:
    -   if much wind, much current
        -   thus reduce other power plants so that output doesn't exceed load
    -   if low wind, low current
        -   thus increase other power plants

### If too little power is provided:

-   capacitors unload
-   frequency can drop
    -   if that happens, electric devices can be damaged

### Antenna

# Infrastructures

## Power transmission lines

https://www.youtube.com/watch?v=qjY31x0m3d8

-   Losses in long cables
-   Because $\Delta P = I^2 R$, we decrease $I$ by boosting $V$
-   High voltage means electrons really want to flow ... even through air. Lines must prevent arcing.
    -   But insulating lines isn't cost efficient
    -   So lines are simply spaced very far apart: that's why they are on those big towers
-   Towers transmit electricity in **three phases**, with much space between the three lines
    -   which requires AC, of course
-   Additionally, there is a fourth line on top
    -   doesn't carry any current, but protects from lightning

Organisation:

-   Bundesnetzagentur
    -   Bundesnetzentwicklungspläne (NEPs)
-   four **TSO**'s (transmission system operators):
    -   Tennet (Hamburg bis München, früher E.on)
    -   TransnetBW (BaWü, früher EnBW)
    -   Amprion (Westen und bayerisch-Schwaben, früher RWE)
    -   50Herz (Osten, früher Vattenfall)

Grid data:

-   Transmission grid:
    -   Fully owned by the big 4 TSOs
    -   Extra high voltage: 275 kV - 765 kV
        -   About 36.000 km
        -   still mostly overhead AC, some few HVDC
    -   High voltage: 110 kV - 274 kV
        -   About 96.000 km
-   Distribution grid
    -   About 900 DSOs, but the big 4 TSO's also own large part of this
    -   This is where wind and solar feed in, not the transmission grid!
    -   Medium volrage:
        -   About 520.000 km
    -   Low voltage:
        -   About 1.120.000 km

## Wind power

https://www.youtube.com/watch?v=LklUVkMPl8g&t=60s

-   turning variable turbine speed into grid's 50 Hz
    -   AC to DC **rectifiers**
    -   DC to AC **inverter** with target frequency
-   strong demand for power can make grid-frequency drop

## Südlink

-   Unter Grund
    -   Darum muss DC sein (während die meisten Mittelstrecken-Türme AC verwenden)
    -   Sehr großer diameter: Kabel ungefähr 15cm Durchmesser Kupfer (mit Mantel gerechnet)
        -   So etwas nur sinnvoll mit DC (AC würde sich vom Kern wegdrücken (Corona effekt), damit wäre höherer Wiederstand)
        -   0.006 Ohm/km
    -   Weil DC: keine 3-phase transmission möglich
-   Versorgt ca 10 Mio Haushalte
-   Kostet wegen Eingraben 4-5 mal so viel wie oberirdische Leitungen
    -   10 Milliarden €
-   Wird im Kern 70 Grad C, um Mantel herum 50 C
-   1.5m tief
    -   Außer für Unterquerung von Hindernissen (Flüsse, Wohngebiete, ...) da tiefer
    -   Wo möglich durch Bergwerke
    -   https://www.youtube.com/watch?v=-hwuPgkGC04
-   700km lang
-   2 Kabelsysteme in parallel, bestehend aus jeweils:
    -   2x525 kV (ein postitives Kabel und ein negatives)
    -   1x Notfallkabel
-   Norden: Tennet, Süden: EnBW?
-   Bauphasen: https://www.youtube.com/watch?v=6TEQFOr79IQ
    -   Baugrunduntersuchung
        -   Kontaktaufnahme Landwirt
        -   Bestandsaufnahme
        -   Baugrunduntersuchung
        -   Schadensaufnahme: Dokumentieren aller Schäden, Wirtschaftlichkeitsreduzierung
        -   Entschädigung
            -   Einmalzahlung auf Basis höchster Ertragszahlen

# Interesting phenomena

## Frequency drops in grids under heavy load

Texas power outage: https://www.youtube.com/watch?v=08mwXICY4JM

-   Too much load on generators _bogs them down_, making them spin slower, reducing network frequency
-   every generator in the grid is magnetically coupled
-   if some generators get out of sync, they can take heavy damage
    -   to protect the equipment, their breakers fire, isolating them ...
    -   ... but that means even less power is provided to the grid

## Three phase transmission has very low losses
