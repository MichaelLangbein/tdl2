# Windows ... know your enemy

## Network devices

`\\stslarcgisprod04.file.core.windows.net\path`

- `\\` indicates a UNC (universal naming convention), which is used by windows. It shows that this path is a network resource
  - likely accessed by either SMB or CIFS
- `stslarcgisprod04` : the azure storage account name
- `.file.core.windows.net`: public endpoint domain
  - proves that this is azure files technology. Means that this is a fully managed, remote service by azure, accessed over the internet via SMB

## Authentication & authorization

- Authentication = who are you?
  - OIDC (which, btw, uses OAuth2 for authorization under the hood)
  - SAML
  - CAS
- Authorization = what can you do?
  - OAuth

### OAuth stack: (authorization) allowing someone to act on your behalf

- **Oauth**: authorization-protocol
  - Oauth2: current version
- **OIDC** (Open-ID-Connect): authentication-protocol (built on top of Oauth)
- **JWT** (JSON-Web-Tokens): an alternative to cookies, commonly used in both Oauth and OIDC
- Service providers: Auth0, Keycloak

#### OAuth flow

- You want to go into the club, but you don't want the bouncer to know who you are ... but its ok if the club's owner knows you.
- The bouncer tells you to go to the owner.
- You walk across the street (the network) to the owner.
- The owner gives you a number (which you cant read)
  - How you communicate with the owner is a matter of the authentication-protocol (CAS, SAML, )
- You walk across the street (the network) with that unreadable number back to the club.
- The bouncer takes your number (which he can't read either), walks across the street (the network) and shows it to the owner.
- The owner confirms that that's the number he's given you; after which he burns your code (single usage).
- The bouncer lets you in.

Security aspects of this:

- At no point did either you or the bouncer walk across the street with readable credentials on you.
- At no point did the bouncer get your personal information.

### LDAP stack: directory access

- **LDAP** (Lightweight-Directory-Access-Protocol): authentication-protocol
- **ActiveDirectory**: A microsoft auth-service-provider that uses LDAP or others

### CAS stack: (SSO, authentication) share user-information. Also compatible with SAML stack

- **CAS**: authentication-protocol for single-sign-on

### SAML stack: (SSO, authentication) share user-information. Very close to CAS

- **SAML**: authentication and authorization protocol
- **OpenSAML**: implementation of SAML
- **Shibboleth**: Service built on top of OpenSAML
