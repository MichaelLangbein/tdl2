# Testing

- <https://stackoverflow.com/questions/47281710/difference-between-cypress-and-a-bdd-framework-like-cucumber>
- <https://trends.stackoverflow.co/?tags=selenium,playwright,cypress>
- <https://npmtrends.com/cypress-vs-playwright-vs-selenium-webdriver>
- <https://2023.stateofjs.com/en-US/libraries/>
- <https://entwickler.de/javascript/cypress-playwright-e2etesting>

# Tactics

- TDD
  - Write tests before coding
- BDD
  - Write user behavior, expect UI to respond correctly

# Selenium

# Cypress

# Playwright

<https://www.youtube.com/watch?v=Ea4aZB0Zlsw&list=PLhW3qG5bs-L9sJKoT1LC5grGT77sfW0Z8&index=6>

- Formerly puppeteer (back then by google, now microsoft)
- Start a project:
  - `npm init playwright@latest`
- Record a test:
  - `npx playwright codegen wikipedia.org`
  - <https://testingbot.com/support/playwright/recorder.html#introduction>
- Run a specific test:
  - `npx playwright test ./tests/ttg_bau.spec.ts --headed (--project chromium) (--trace on-first-retry)`
- Show trace-replay of failed test:
  - `npx playwright show-report`
  - or `npx playwright show-trace ./test-results/somepath/result.zip`

## Cucumber

- Implements a language called "Gherkin": "given that ... / when I do ... / then I should get ..."
- running a cucumber file returns the code snippets required to create the `given`, `when` and `then` implementations
- since this chops our scenarios into smaller parts, we can re-assemble some of those parts if we want, saving us some coding.
  - we can save even more coding by adding cucumber-variables to the cucumber file, which will take on all possible values that we provide.

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

- The UI component explorer. Develop, document, & test for React, Vue, Angular, Ember, Web Components, & more!

# JMeter

## Setup

- plugins
  - download
  - copy contained jar into jmeter/lib or jmeter/lib/ext

## components

- thread-group = users
  - request(s)
  - observer = display results once done. Ignored when called from the CLI.
  - timer
  - http-cookie-manager
- HTTPS test-script recorder
  - you can usually delete this once you have moved all your required requests from the recorder to the thread-group
  
## cli

- `jmeter.bat -n -t .\my_script.jmx -l .\my_log.jtl -e -o .\my_dashboard`

### Passing arguments from the cli

<https://stackoverflow.com/questions/63236382/configurable-number-of-threads-in-jmeter-threadgroup>

Modify your JMeter script to use a property for the thread count:

- Open your .jmx file in JMeter GUI.
- Set the number of threads to `${__P(threadCount,1)}` in the Thread Group. This tells JMeter to use the threadCount property, with a default value of 1 if the property is not set.

Run JMeter from the command line with the `-J` option to pass the thread count:

- Use the following command to run your test with a specified thread count: `jmeter -n -t your_script.jmx -JthreadCount=20`
- Replace 20 with the desired number of threads.
- Automate the process to run the test with different thread counts: You can use a simple shell script or batch file to loop through the desired thread counts and run the JMeter test for each count. Here's an example in a bash script:

  ```bash
  for i in {1..20}
  do
    jmeter -n -t your_script.jmx -JthreadCount=$i
  done
  ```

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
