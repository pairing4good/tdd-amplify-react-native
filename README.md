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
});
```

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