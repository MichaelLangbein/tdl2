# Testing

-   https://stackoverflow.com/questions/47281710/difference-between-cypress-and-a-bdd-framework-like-cucumber
-   https://trends.stackoverflow.co/?tags=selenium,playwright,cypress
-   https://npmtrends.com/cypress-vs-playwright-vs-selenium-webdriver
-   https://2023.stateofjs.com/en-US/libraries/
-   https://entwickler.de/javascript/cypress-playwright-e2etesting

# Tactics

-   TDD
    -   Write tests before coding
-   BDD
    -   Write user behavior, expect UI to respond correctly

# Selenium

# Cypress

# Playwright

-   Formally puppeteer (back then by google, now microsoft)
-   playwright has a test-recorder: https://testingbot.com/support/playwright/recorder.html#introduction
-   `npx playwright codegen wikipedia.org`

## Cucumber

-   Implements a language called "Gherkin": "given that ... / when I do ... / then I should get ..."
-   running a cucumber file returns the code snippets required to create the `given`, `when` and `then` implementations
-   since this chops our scenarios into smaller parts, we can re-assemble some of those parts if we want, saving us some coding.
    -   we can save even more coding by adding cucumber-variables to the cucumber file, which will take on all possible values that we provide.

# Comparing selenium, cypress and playwright

|                                          | selenium                            | cypress                                                                                                                                                                                    | playwright                                                 |
| ---------------------------------------: | :---------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------- |
|                               technology | WebDriver (less versatile than CDP) | electron app with embedded browser, uses CDP only for starting browser, after that testcode directly injected into browser's js-loop (app-code in one iframe, test-code in another iframe) | your script runs in node, which talks to browser via CDP   |
|                       scripting language | python, java, js, ruby              | js, ts                                                                                                                                                                                     | python, java, js, ts                                       |
|                                 browsers | all                                 | all except IE and Safari                                                                                                                                                                   | all except IE, but also mobile                             |
| waiting, preventing "flakiness" in SPA's | waiting has a few caveats           | nice                                                                                                                                                                                       | nice                                                       |
|                                    login |                                     | Workaround: for oauth2 page must be changed, which is not allowed for browser-js, which means for that step cypress falls back to executing a part of the script in electron/node          | pretty good: reusable between tests                        |
|                                debugging |                                     | direct browser access and time-travel                                                                                                                                                      | decent                                                     |
|                              BDD library |                                     | supports cucumber partially                                                                                                                                                                | supports cucumber, root, gauge                             |
|                                Use in CI |                                     | kind of hard, needs docker                                                                                                                                                                 | easy, just npm install                                     |
|                       3rd party software |                                     | A bunch of 3rd party: testing=mocha, selecting=jquery, ...                                                                                                                                 | most code comes from playwrigth itself, batteries included |

# Storybook

-   The UI component explorer. Develop, document, & test for React, Vue, Angular, Ember, Web Components, & more!


# JMeter

## Setup

- plugins
  - download
  - copy contained jar into jmeter/lib or jmeter/lib/ext

## components
  - thread-group = users
    - request
      - observer
    - timer
    - http-cookie-manager
  - HTTPS test-script recorder
  

## cli
- `jmeter.bat -n -t .\my_script.jmx -l .\my_log.jtl -e -o .\my_dashboard`

## Recorder

HTTPS test-script recorder
    - target controller: HTTPS test-script recorder
    - browser: configure to use JMeter's proxy
    - browser: point it to JMeter's TLS-certificate

Alternative:
- Chrome BlazeMeter plugin -> exports recording straight to a jmx


After recording:
- at root request, click "retrieve all embedded resources". 
- copy-paste requests from recorder into thread-group