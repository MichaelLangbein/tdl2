# Security

## General advise
- on average, attackers can stay in a net for ~200 days

- Phishing
  - Opening emails: save
  - Sender address: can be faked
  - Links: unsave
    - dont click http:// - your password will be unencrypted.
    - https://something-something.zieladresse.com/something.something <- ".zieladresse.com" muss korrekt sein (von erstem slash nach .dom zurück bis zum ersten Punkt von rechts)
  - Anhänge: nicht öffnen, unsicher.

- Email
  - **PKI**: Public key infrastructure
    - Muss am DLR mithilfe Perso einen eigenen Token bekommen.
  - **Anhänge verschlüsseln**
    - Wenn PKI overkill ist, dann kann man immer noch Anhänge verschlüsseln
    - 7zip erlaubt Passwörter
    - Passwort nicht per Email versenden, sondern per SMS, Telefon oder Fax.
  - **Elektronische Signatur**
    - Absender kann verifiziert werden

- Passwörter
  - Niemand braucht mein Passwort - nicht einmal mein Admin.

- Cloud services
  - Google, apple etc. are forced to cooperate with NSA.
  - They also have no legal obligation to not use your data.

- Sensible informationen 
  - Muss selbst entscheiden, ob sensibel
  - Wenn ja, muss als solche gekennzeichnet werden
  - Dürfen nur verschlüsselt gespeichtert werden
  - Dürfen nur verschlüsselt versendet werden
  - Müssen geschreddert werden
  - Need to know Prinzip

- Social media
  - Nicht posten:
    - Kundennamen
    - Projektdaten
    - Kontaktdaten für jeden
    - Interne Programm-Namen oder Abläufe
  - Nicht im Namen des Unternehmens sprechen

- Verdacht auf Virus
  - 1: Netzwerk ausstöpseln
  - 2: IT Sicherheit melden
  - Frühes Melden bedeutet dass der Schaden gering ist, denn Malware braucht Zeit um Unternehmensdaten zu sammeln.

- Ransomware
  - Kommt oft als office-Dokument mit Macro's im Anhang als html oder tar.
  - Nie Macro's o.ä. aktivieren

## Browser sandboxing
Pages like to request resources from other pages.
But they are not usually allowed to.

### Attack vectors

### CORS rules
There are two modes in which pages can request data from a server:
- sec-fetch-mode: cors
  - browser only downloads data if the fetching domain is white-listed on the queried server
- sec-fetch-mode: no-cors
  - browser will download data if this request came from non-javascript (=img or form)
  - contend will be displayed graphically (as image or html) but cannot be touched by js


Images:
- default behavior: `<img src="otherdomain.com/img">`
  - `sec-fetch-mode: no-cors`
  - downloads & displays image
  - prevents accessing the image data
- `<img src="otherdomain.com/img" crossorigin="anonymous">`
  -  downloads the image if the requesting page has been whitelisted on image-server
  -  does allow accessing image data, no tainted canvas


### CORB rules


## PCI (payment card industry) rules
### firewall
### se-linux
See linux.md

## nmap

## Metasploit

- 6 types of modules
    - exploits: takes advantage of a vulnerability; installs a payload on system
    - payloads: (aka. rootkit?)
        - reverse shell
        - meterpreter
    - auxillary
    - logs
    - encoders

- `msfconsole`
- `help`
- `search type:exploit platform:windows flash`
- `use exploit/windows/browser/adobe_flash_avm2`
    - `show`
        - `show info`: explains currently loaded module
        - `show options`
        - `show payloads`
        - `show targets`
    - `set`
        - `set SRVPORT 80`
        - `set SRVHOST 192.168.0.1`
    - `exploit`: executes the exploit