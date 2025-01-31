# Auth

Standards:

OAuth stack: allowing someone to act on your behalf

-   **Oauth**: authorization-protocol
    -   Oauth2: current version
-   **OIDC** (Open-ID-Connect): authentication-protocol (built on top of Oauth)
-   **JWT** (JSON-Web-Tokens): an alternative to cookies, commonly used in both Oauth and OIDC
-   Service providers: Auth0, Keycloak

LDAP stack: directory access

-   **LDAP** (Lightweight-Directory-Access-Protocol): authentication-protocol
-   **ActiveDirectory**: A microsoft auth-service-provider that uses LDAP or others

CAS stack: share user-information. Also compatible with SAML stack.

-   **CAS**: authentication-protocol for single-sign-on

SAML stack: share user-information. Very close to CAS.

-   **SAML**: authentication and authorization protocol
-   **OpenSAML**: implementation of SAML
-   **Shibboleth**: Service built on top of OpenSAML

Libraries:

-   **passport**: authentication framework for OIDC, facebook, google, apple, ...
    -   https://github.com/jwalton/passport-api-docs
    -   https://www.passportjs.org/concepts/authentication/

Service-providers:

-   **Auth0**: auth-service-provider
-   **Keycloak**: Self-hostable, open-source alternative to auth0
-   **ActiveDirectory**: A microsoft auth-service-provider that uses LDAP or others
-   **Shibboleth**: Service built on top of OpenSAML

## Oauth flow

<img src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/programming/oauth_flow.png" />

# Payments

Service-providers:

-   **Stripe**
-   **PayPal**
