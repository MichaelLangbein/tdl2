# Auth

Standards:
- **Oauth**: authorization-protocol
  - Oauth2
- **OIDC** (Open-ID-Connect): authentication-protocol (built on top of Oauth)
- **JWT** (JSON-Web-Tokens): an alternative to cookies, commonly used in both Oauth and OIDC
- **LDAP** (Lightweight-Directory-Access-Protocol): authentication-protocol
- **CAS**: authentication-protocol for single-sign-on

Libraries:
- **passport**: authentication framework for OIDC, facebook, google, apple, ...
  - https://github.com/jwalton/passport-api-docs
  - https://www.passportjs.org/concepts/authentication/


Service-providers:
- **Auth0**: auth-service-provider
- **ActiveDirectory**: A microsoft auth-service-provider that uses LDAP or others
- **Keycloak**: Self-hostable, open-source alternative to auth0



# Payments

Service-providers:
- **Stripe**
- **PayPal**
