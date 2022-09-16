# Auth

Standards:
- Oauth: authorization-protocol
  - Oauth2
- OIDC: authentication-protocol (built on top of Oauth)
- JWT: an alternative to cookies, commonly used in both Oauth and OIDC
- LDAP: authentication-protocol
- CAS: authentication-protocol for single-sign-on

Libraries:
- passport: authentication framework for OIDC, facebook, google, apple, ...
  - https://github.com/jwalton/passport-api-docs
  - https://www.passportjs.org/concepts/authentication/


Service-providers:
- Auth0: auth-service-provider
- ActiveDirectory: A microsoft auth-service-provider that uses LDAP or others
- 