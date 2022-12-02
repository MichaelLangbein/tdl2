# Security


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