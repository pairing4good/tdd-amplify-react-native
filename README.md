# TDD React Native App
This is the second part of a two part tutorial.  In the [first tutorial](https://github.com/pairing4good/tdd-amplify-react) we created a React Notes App that uses an AWS Amplify backend to secure and store notes.  In this tutorial we will hook up a [native](https://en.wikipedia.org/wiki/Mobile_app#Native_app) mobile app that will use the same backend service that we built in the first tutorial.

## Prerequisites
- Complete the [first tutorial](https://github.com/pairing4good/tdd-amplify-react) before you start this tutorial.

<details>
  <summary>Set Up</summary>

## Set Up
- Run `npm install --global expo-cli`
- `cd` to the directory where you store your git repositories
- Run `expo init tdd-amplify-react-native` and select the `blank` template when prompted.
- Run `cd tdd-amplify-react-native`
- Run `npm start`
- In the `Metro Bundler` window found at http://localhost:19002/ click the `Run in web browser` option on the left navigation
- You should see the following message in your browser `Open up App.js to start working on your app!`

- Commit

[Code for this section](https://github.com/pairing4good/tdd-amplify-react-native/commit/e394249d96eba901075e26b1832ea54fec24ca41)

</details>

<details>
  <summary>First Test</summary>

## First Test
- In a new terminal window run `npm install cypress --save-dev` to install Cypress via [npm](https://www.npmjs.com):
- Run `npx cypress open`
- Configure the base url in the `cypress.json` file

```js
{
    "baseUrl": "http://localhost:19006"
}
```
- One of the benefits of using Expo is that it provides multiple ways to access your application.  For this test we are using the web browser version to quickly verify the apps behavior.

- Run one or two of the Cypress `examples` to make sure everything is set up correctly.
- **Once you have verified that Cypress is running correctly, delete the `cypress/integration/examples/` directory so that your tests will run faster on your [Continuous Integration (CI) Server](https://en.wikipedia.org/wiki/Continuous_integration).**
- Create a new test called `note.spec.js` under the `cypress\integration\` directory in your project
- Add the following tests to drive the same UI that you created in the first tutorial.
```js
describe('Note Capture', () => {
    before(() => {
        cy.visit('/');
    });

    it('should have header', () => {
        cy.get('[data-testid=note-header]').should('have.text', 'My Notes App')
    })

    it('should create a note when name and description provided', () => {
        //cy.get('[data-testid=test-name-0]').should('not.exist');
        //cy.get('[data-testid=test-description-0]').should('not.exist');
        
        cy.get('[data-testid=note-name-field]').type('test note');
        cy.get('[data-testid=note-description-field]').type('test note description');
        cy.get('[data-testid=note-form-submit]').click();

        // cy.get('[data-testid=note-name-field]').should('have.value', '');
        // cy.get('[data-testid=note-description-field]').should('have.value', '');

        cy.get('[data-testid=test-name-0]').should('have.text', 'test note');
        cy.get('[data-testid=test-description-0]').should('have.text', 'test note description');
    });

    it('should delete note', () => {
        cy.get('[data-testid=test-button-0]').click();

        // cy.get('[data-testid=test-name-0]').should('not.exist')
        // cy.get('[data-testid=test-description-0]').should('not.exist')
    })

    it('should have an option to sign out', () => {
        cy.get('[data-testid=aws-amplify__auth--sign-out-button]').click()
        cy.get('[data-testid=aws-amplify__auth--sign-in-to-your-account-text]').should('exist')
    })
});
```
- The commented out lines (`//`) will not work until we hook up the backend API

- Run `expo start --web`

Before we proceed let's add a script to run cypress into the `package.json` file in the `scripts` section.

```js
"scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "cypress:open": "cypress open"
  }
```

- Now you can run `npm run cypress:open` to open cypress
- Select the `note.spec.js` test

- The tests are Red

Our objective will be to get to Green as quickly as we can in the simplest way possible.  Since the backend already exists we will use it as is and build out just enough UI to make it turn Green.  Once it is Green then we will Refactor.

[Code for this section](https://github.com/pairing4good/tdd-amplify-react-native/commit/a891634380beff0c0b68a89b7024b2636b36d531)

</details>

<details>
  <summary>Build The UI</summary>

## Build The UI
Build out the simplest UI that will cause the Cypress test to go Green.  Once we have green then we will refactor and expand the UI's functionality.

```js
import React from 'react';
import { Text, View, TextInput, Button } from 'react-native';

export default function App() {
  return (
    <View>
      <Text testID="note-header">My Notes App</Text>
      <TextInput testID="note-name-field" />
      <TextInput testID="note-description-field" />
      <Button testID="note-form-submit" title="Create Note" />

      <Text testID="test-name-0">test note</Text>
      <Text testID="test-description-0">test note description</Text>
      <Button testID="test-button-0" title="Delete note" />
    </View>
  );
}
```

- Run the Cypress test
- Green
- Commit

[Code for this section](https://github.com/pairing4good/tdd-amplify-react-native/commit/8841993a22da1eb4fdb146870df0c049aa1cdcfe)
</details>

<details>
  <summary>Connect Backend Auth</summary>

## Connect Backend Auth
We want to reuse the same Amplify backend that we created in the first tutorial.

- Go to http://console.aws.amazon.com/
- Select `AWS Amplify`
- Select the application you created in the first tutorial
- Select the `Backend environments` tab
- Select the `Local setup instructions` section
- Copy the provided command (ie: `amplify pull --appId xxxxxxxxxxx --envName xxx`)
- Run the command you copied at the root of your project
```
? Choose your default editor: Visual Studio Code
? Choose the type of app that you're building: javascript
Please tell us about your project
? What javascript framework are you using: react-native
? Source Directory Path:  /
? Distribution Directory Path: /
? Build Command:  npm run-script build
? Start Command: npm run-script start
? Do you plan on modifying this backend?: No
```
- This created the `aws-export.js` and added it to `.gitignore` so that your user credentials are not committed
- Run `npm install aws-amplify-react-native`

- Add authentication to `App.js`
```js
...
import { withAuthenticator } from "aws-amplify-react-native"
import Amplify from "aws-amplify"
import awsconfig from './aws-exports';

Amplify.configure({
  ...awsconfig,
  Analytics: {
    disabled: true,
  },
});

function App() {
  return (
...
  );
}

export default withAuthenticator(App, true)
```
- The `aws-amplify-react-native` library has an [issue](https://github.com/aws-amplify/amplify-js/issues/5918) that requires adding the `Analytics: {disabled: true}` option to the `Amplify.configure` function.

- Add the following to the bottom of the `cypress/support/commands.js` file

```js
const Auth = require("aws-amplify").Auth;
import "cypress-localstorage-commands";
const username = Cypress.env("username");
const password = Cypress.env("password");
const userPoolId = Cypress.env("userPoolId");
const clientId = Cypress.env("clientId");

const awsconfig = {
  aws_user_pools_id: userPoolId,
  aws_user_pools_web_client_id: clientId,
};
Auth.configure(awsconfig);

Cypress.Commands.add("signIn", () => {
  cy.then(() => Auth.signIn(username, password)).then((cognitoUser) => {
    const idToken = cognitoUser.signInUserSession.idToken.jwtToken;
    const accessToken = cognitoUser.signInUserSession.accessToken.jwtToken;

    const makeKey = (name) => `CognitoIdentityServiceProvider
        .${cognitoUser.pool.clientId}
        .${cognitoUser.username}.${name}`;

    cy.setLocalStorage(makeKey("accessToken"), accessToken);
    cy.setLocalStorage(makeKey("idToken"), idToken);
    cy.setLocalStorage(
      `CognitoIdentityServiceProvider.${cognitoUser.pool.clientId}.LastAuthUser`,
      cognitoUser.username
    );
  });
  cy.saveLocalStorage();
});
```

- Create a new file at the root of your project named `cypress.env.json` with the following content

```json
{
  "username": "[Login username you just created]",
  "password": "[Login password you just created]",
  "userPoolId": "[The `aws_user_pools_id` value found in your `src/aws-exports.js`]",
  "clientId": "[The `aws_user_pools_web_client_id` value found in your `src/aws-exports.js`]"
}
```

- Add `cypress.env.json` to `.gitignore` so that it will not be committed and pushed to GitHub

```
#amplify
amplify/\#current-cloud-backend
...
amplifyconfiguration.dart
amplify-build-config.json
amplify-gradle-config.json
amplifytools.xcconfig
.secret-*
cypress.env.json
```

- Add the following set ups and tear downs to `cypress/integration/note.spec.js`

```js
before(() => {
  cy.signIn();
  cy.visit("/");
});

after(() => {
  cy.clearLocalStorageSnapshot();
  cy.clearLocalStorage();
});

beforeEach(() => {
  cy.restoreLocalStorage();
});

afterEach(() => {
  cy.saveLocalStorage();
});
```
- Run the Cypress tests
- Green!
- Commit

[Code for this section](https://github.com/pairing4good/tdd-amplify-react-native/commit/1fb5a25acc72e15c053ea1ad5df988a704540d80)
</details>
