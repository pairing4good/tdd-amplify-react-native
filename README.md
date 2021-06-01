# TDD React Native App

This is the second part of a two part tutorial. In the [first tutorial](https://github.com/pairing4good/tdd-amplify-react) we created a React Notes App that uses an AWS Amplify backend to secure and store notes. In this tutorial we will hook up a [native](https://en.wikipedia.org/wiki/Mobile_app#Native_app) mobile app that will use the same backend service that we built in the first tutorial.

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

- One of the benefits of using Expo is that it provides multiple ways to access your application. For this test we are using the web browser version to quickly verify the apps behavior.

- Run one or two of the Cypress `examples` to make sure everything is set up correctly.
- **Once you have verified that Cypress is running correctly, delete the `cypress/integration/examples/` directory so that your tests will run faster on your [Continuous Integration (CI) Server](https://en.wikipedia.org/wiki/Continuous_integration).**
- Create a new test called `note.spec.js` under the `cypress\integration\` directory in your project
- Add the following tests to drive the same UI that you created in the first tutorial.

```js
describe("Note Capture", () => {
  before(() => {
    cy.visit("/");
  });

  it("should have header", () => {
    cy.get("[data-testid=note-header]").should("have.text", "My Notes App");
  });

  it("should create a note when name and description provided", () => {
    //cy.get('[data-testid=test-name-0]').should('not.exist');
    //cy.get('[data-testid=test-description-0]').should('not.exist');

    cy.get("[data-testid=note-name-field]").type("test note");
    cy.get("[data-testid=note-description-field]").type(
      "test note description"
    );
    cy.get("[data-testid=note-form-submit]").click();

    // cy.get('[data-testid=note-name-field]').should('have.value', '');
    // cy.get('[data-testid=note-description-field]').should('have.value', '');

    cy.get("[data-testid=test-name-0]").should("have.text", "test note");
    cy.get("[data-testid=test-description-0]").should(
      "have.text",
      "test note description"
    );
  });

  it("should delete note", () => {
    cy.get("[data-testid=test-button-0]").click();

    // cy.get('[data-testid=test-name-0]').should('not.exist')
    // cy.get('[data-testid=test-description-0]').should('not.exist')
  });

  it("should have an option to sign out", () => {
    cy.get("[data-testid=aws-amplify__auth--sign-out-button]").click();
    cy.get(
      "[data-testid=aws-amplify__auth--sign-in-to-your-account-text]"
    ).should("exist");
  });
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

Our objective will be to get to Green as quickly as we can in the simplest way possible. Since the backend already exists we will use it as is and build out just enough UI to make it turn Green. Once it is Green then we will Refactor.

[Code for this section](https://github.com/pairing4good/tdd-amplify-react-native/commit/a891634380beff0c0b68a89b7024b2636b36d531)

</details>

<details>
  <summary>Build The UI</summary>

## Build The UI

Build out the simplest UI that will cause the Cypress test to go Green. Once we have green then we will refactor and expand the UI's functionality.

```js
import React from "react";
import { Text, View, TextInput, Button } from "react-native";

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

- React Native uses different components than React

  - [View](https://reactnative.dev/docs/view)
  - [Text](https://reactnative.dev/docs/text)
  - [TextInput](https://reactnative.dev/docs/textinput)
  - [Button](https://reactnative.dev/docs/button)

- In React Native `testID` replaces React's `data-testid` but they both render to the same element id in the web.

- Run the Cypress test
- Green
- Commit

[Code for this section](https://github.com/pairing4good/tdd-amplify-react-native/commit/8841993a22da1eb4fdb146870df0c049aa1cdcfe)

</details>

<details>
  <summary>Connect Backend Auth</summary>

## Connect Backend Auth

We want to reuse the same Amplify backend authentication that we created in the first tutorial.

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

<details>
  <summary>Connect Backend API</summary>

## Connect Backend API

We want to reuse the same Amplify backend API that we created in the first tutorial.

- Go to http://console.aws.amazon.com/
- Select `AWS AppSync`
- Select the application you created in the first tutorial
- In the `Integrate with your app` section select the `JavaScript` tab
- Copy the `amplify add codegen --apiId xxxxxxxxxxxxxxxxxxxx` command
- Select `Schema` on the left navigation bar
- Click the `Export schema` dropdown
- Select `schema.json`
- Once it has downloaded move the file to the root of your project
- Run the command you copied (`amplify add codegen --apiId xxxxxxxxxxxxxxxxxxxx`)

```
? Choose the type of app that you're building: javascript
? What javascript framework are you using: react-native
? Choose the code generation language target: javascript
? Enter the file name pattern of graphql queries, mutations and subscriptions: src/graphql/**/*.js
? Do you want to generate/update all possible GraphQL operations - queries, mutations and subscriptions: Yes
? Enter maximum statement depth [increase from default if your schema is deeply nested]: 2
```

- Create a new folder in the `src` directory called `test`
- Create a new file named `NoteRepository.test.js`

```js
import { save, findAll, deleteById } from "../common/NoteRepository";
import { API } from "aws-amplify";
import {
  createNote as createNoteMutation,
  deleteNote as deleteNoteMutation,
} from "../graphql/mutations";
import { listNotes } from "../graphql/queries";

const mockGraphql = jest.fn();
const id = "test-id";

beforeEach(() => {
  API.graphql = mockGraphql;
});

afterEach(() => {
  jest.clearAllMocks();
});

it("should create a new note", () => {
  const note = { name: "test name", description: "test description" };

  save(note);

  expect(mockGraphql.mock.calls.length).toBe(1);
  expect(mockGraphql.mock.calls[0][0]).toStrictEqual({
    query: createNoteMutation,
    variables: { input: note },
  });
});

it("should findAll notes", () => {
  const note = { name: "test name", description: "test description" };

  findAll(note);

  expect(mockGraphql.mock.calls.length).toBe(1);
  expect(mockGraphql.mock.calls[0][0]).toStrictEqual({ query: listNotes });
});

it("should delete note by id", () => {
  deleteById(id);

  expect(mockGraphql.mock.calls.length).toBe(1);
  expect(mockGraphql.mock.calls[0][0]).toStrictEqual({
    query: deleteNoteMutation,
    variables: { input: { id } },
  });
});
```

- Run `npm install jest-expo --save-dev`
- Add the following to your `package.json` file

```json
"scripts": {
  ...
  "test": "jest --watch --testPathPattern=src/test"
},
"jest": {
  "preset": "jest-expo"
}
```

- Run `npm install react-test-renderer --save-dev`
- Run `npm install @react-native-community/netinfo`
- Run `npm run test`

- The tests go Red

- Create a new folder in the `src` directory called `common`
- Create a new file named `NoteRepository.js`

```js
import { API } from "aws-amplify";
import { listNotes } from "../graphql/queries";

export async function findAll() {
  const apiData = await API.graphql({ query: listNotes });
  return apiData.data.listNotes.items;
}
```

- One test goes Green

```js
...
import { createNote as createNoteMutation, deleteNote as deleteNoteMutation} from '../graphql/mutations';

...

export async function save(note){
    const apiData = await API.graphql({ query: createNoteMutation, variables: { input: note } });
    return apiData.data.createNote;
}
```

- One more test goes Green

```js
export async function deleteById(id) {
  return await API.graphql({
    query: deleteNoteMutation,
    variables: { input: { id } },
  });
}
```

- The final test goes Green
- Run the Cypress tests.
- Green!
- Commit

[Code for this section](https://github.com/pairing4good/tdd-amplify-react-native/commit/647dff44562ffa491d5fc1150986dfb3609fb0e2)

</details>

<details>
  <summary>Connect Repository To UI</summary>

## Connect Repository To UI

Now we will test drive the creation and listing of notes

- Uncomment the assertions that will drive us to save the note in `cypress/integration/note.spec.js`

```js
    it('should create a note when name and description provided', () => {
        cy.get('[data-testid=test-name-0]').should('not.exist');
        cy.get('[data-testid=test-description-0]').should('not.exist');
```

- We have a failing test that will drive our production code changes.

```js
import React, { useState, useEffect } from 'react';
...
import { findAll, save } from './src/common/NoteRepository';
...

function App() {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchNotesCallback();
  }, []);

  async function fetchNotesCallback() {
    const notes = await findAll()
    if(notes)
      setNotes(notes);
    else
      setNotes([])
  }

  async function createNote() {
    const newNote = await save(formData);
    const updatedNoteList = [ ...notes, newNote ];
    setNotes(updatedNoteList);
  }

  return (
    <View>
      ...
      <TextInput testID="note-name-field"
        onChangeText={text => setFormData({
          ...formData, 'name': text}
        )}
        value={formData.name}/>

      <TextInput testID="note-description-field"
        onChangeText={text => setFormData({
          ...formData, 'description': text}
        )}
        value={formData.description}/>

      <Button testID="note-form-submit"
        title="Create Note"
        onPress={createNote}/>

      {
        notes.map((note, index) => (
          <div>
            <Text testID={"test-name-" + index}>{note.name}</Text>
            <Text testID={"test-description-" + index}>{note.description}</Text>
            <Button testID={"test-button-" + index} title="Delete note" />
          </div>
        ))
      }
    </View>
  );
}
...
```

Here are syntax differences between React and React Native

- React's `onChange` is replaced with `onChangeText` in React Native
- React passes an event `e` to the `onChange` function where React Native just passes the actual text to the `onChangeText` function
- React's `onClick` is replaced with `onPress` in React Native

- Rerun all of the tests
- Green!
- Commit

[Code for this section](https://github.com/pairing4good/tdd-amplify-react-native/commit/6dc746dd3ee168ef52d8cc8d7f90f5a8cdd5f68c)

</details>

<details>
  <summary>Clear Form After Save</summary>

## Clear Form After Save

Now we will test drive clearing the form values on save

- Uncomment the assertions that will drive us to clear the note form in `cypress/integration/note.spec.js`

```js
cy.get("[data-testid=note-name-field]").should("have.value", "");
cy.get("[data-testid=note-description-field]").should("have.value", "");
```

- We have a failing test that will drive our production code changes.

```js
...
function App() {
...
  async function createNote() {
    ...
    setFormData({name: '', description: ''});
  }
...
```

- Rerun all of the tests
- Green!
- Commit

[Code for this section](https://github.com/pairing4good/tdd-amplify-react-native/commit/b4351d11328af0a275c89c55573589bace4ff04a)

</details>

<details>
  <summary>Hook Up Note Deletion</summary>

## Hook Up Note Deletion

Now we will test drive the deletion of a note

- Uncomment the assertions that will drive us to delete a note in `cypress/integration/note.spec.js`

```js
cy.get("[data-testid=test-name-0]").should("not.exist");
cy.get("[data-testid=test-description-0]").should("not.exist");
```

- We have a failing test that will drive our production code changes.

```js
...
import { findAll, save, deleteById } from './src/common/NoteRepository';
...

function App() {
  ...

  async function deleteNoteCallback( id ) {
    const newNotesArray = notes.filter(note => note.id !== id);
    setNotes(newNotesArray);
    await deleteById(id);
  }

  return (
    <View>
      ...

      <Button testID="note-form-submit"
        title="Create Note"
        onPress={createNote}/>

      {
        notes.map((note, index) => (
          <div>
            ...
            <Button testID={"test-button-" + index}
              onPress={() => deleteNoteCallback(note.id)}
              title="Delete note" />
          </div>
        ))
      }
    </View>
  );
}
...
```

- Rerun all of the tests
- Green!
- Commit

[Code for this section](https://github.com/pairing4good/tdd-amplify-react-native/commit/2062f451c66e3032c540c06c62d5bb8d71f23ded)

</details>

<details>
  <summary>Single Responsibility</summary>

## Single Responsibility

The `App` component is doing way too much. Let's pull the form and the list out into separate components.

- Create a new `note` folder in the `src` directory
- Create a new component named `NoteForm.js` in the `note` directory
- Copy the form to this new component

```js
import React from "react";
import { TextInput, Button } from "react-native";

function NoteForm(props) {
  return (
    <div>
      <TextInput
        testID="note-name-field"
        onChangeText={(text) =>
          props.setFormData({
            ...props.formData,
            name: text,
          })
        }
        value={props.formData.name}
      />

      <TextInput
        testID="note-description-field"
        onChangeText={(text) =>
          props.setFormData({
            ...props.formData,
            description: text,
          })
        }
        value={props.formData.description}
      />

      <Button
        testID="note-form-submit"
        title="Create Note"
        onPress={props.createNote}
      />
    </div>
  );
}

export default NoteForm;
```

- Add the `NoteForm` component to `App.js`

```js
...
import { Text, View, Button } from 'react-native';
...
import NoteForm from './src/note/NoteForm';

...

  return (
    <View>
      ...

      <NoteForm setFormData={setFormData}
        formData={formData}
        createNote={createNote}/>

      ...
    </View>
  );
}
...
```

- Rerun all of your tests
- Green

- Pull out a `Header` component

```js
import React from "react";
import { Text } from "react-native";

function Header() {
  return <Text testID="note-header">My Notes App</Text>;
}

export default Header;
```

```js
...
import Header from './src/note/Header';
...
  return (
    <View>
      <Header/>
      ...
    </View>
  );
}
...
```

- Rerun all of your tests
- Green

- Pull out a `NoteList` component

```js
import React from "react";
import { Text, Button } from "react-native";

function NoteList(props) {
  return (
    <div>
      {props.notes.map((note, index) => (
        <div>
          <Text testID={"test-name-" + index}>{note.name}</Text>
          <Text testID={"test-description-" + index}>{note.description}</Text>
          <Button
            testID={"test-button-" + index}
            onPress={() => props.deleteNoteCallback(note.id)}
            title="Delete note"
          />
        </div>
      ))}
    </div>
  );
}

export default NoteList;
```

```js
...
import { View} from 'react-native';
...
import NoteList from './src/note/NoteList';

...

function App() {
  ...
  return (
    <View>
      ...
      <NoteList notes={notes}
        deleteNoteCallback={deleteNoteCallback}/>
    </View>
  );
}
...
```

- Rerun all of your tests
- Green
- Commit

[Code for this section](https://github.com/pairing4good/tdd-amplify-react-native/commit/44e1b06400d9baa0d5f2a4597401b3eda260b888)

</details>

<details>
  <summary>Component Testing</summary>

## Component Testing

Now that each concern has been pulled out into focused components, we need to move down the testing pyramid and write non-UI tests.

- Run `npm install --save-dev @testing-library/react-native`

- Create a new test `Header.test.js` in the `src/test/` directory

```js
import React from "react";
import { render } from "@testing-library/react-native";
import Header from "../note/Header";

test("should display header", () => {
  const { getByTestId } = render(<Header />);
  const heading = getByTestId("note-header");
  expect(heading.props.children).toBe("My Notes App");
});
```

- Run all the tests
- Green

- Create a new test `NoteList.test.js` in the `src/test/` directory

```js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import NoteList from "../note/NoteList";

const deleteNoteCallback = jest.fn();

const defaultProps = {
  notes: [],
  deleteNoteCallback: deleteNoteCallback,
};

const setup = (props = {}) => {
  const setupProps = { ...defaultProps, ...props };
  return render(<NoteList {...setupProps} />);
};

test("should display nothing when no notes are provided", () => {
  const { queryByTestId } = setup();
  const firstNoteName = queryByTestId("test-name-0");

  expect(firstNoteName).toBeNull();
});
```

- Run all the tests
- Green

- Add another `NoteList` test

```js
test("should display one note when one notes is provided", () => {
  const note = { name: "test name", description: "test description" };
  const { queryByTestId } = setup({ notes: [note] });

  const firstNoteName = queryByTestId("test-name-0");
  expect(firstNoteName.props.children).toBe("test name");

  const firstNoteDescription = queryByTestId("test-description-0");
  expect(firstNoteDescription.props.children).toBe("test description");
});
```

- Run all the tests
- Green

- Add another `NoteList` test

```js
test("should display one note when one notes is provided", () => {
  const firstNote = { name: "test name 1", description: "test description 1" };
  const secondNote = { name: "test name 2", description: "test description 2" };
  const { queryByTestId } = setup({ notes: [firstNote, secondNote] });

  const firstNoteName = queryByTestId("test-name-0");
  expect(firstNoteName.props.children).toBe("test name 1");

  const firstNoteDescription = queryByTestId("test-description-0");
  expect(firstNoteDescription.props.children).toBe("test description 1");

  const secondNoteName = queryByTestId("test-name-1");
  expect(secondNoteName.props.children).toBe("test name 2");

  const secondNoteDescription = queryByTestId("test-description-1");
  expect(secondNoteDescription.props.children).toBe("test description 2");
});
```

- Run all the tests
- Green

- Add another `NoteList` test

```js
test("should delete note when clicked", () => {
  const note = {
    id: 1,
    name: "test name 1",
    description: "test description 1",
  };
  const notes = [note];
  const { getByTestId } = setup({ notes: notes });
  const button = getByTestId("test-button-0");

  fireEvent.press(button);

  expect(deleteNoteCallback.mock.calls.length).toBe(1);
  expect(deleteNoteCallback.mock.calls[0][0]).toStrictEqual(1);
});
```

- Run all the tests
- Green

- Add another `NoteList` test

```js
test("should throw an exception the note array is undefined", () => {
  expect(() => {
    render(<NoteList />);
  }).toThrowError();
});
```

- Run all the tests
- Green

- Create a new test `NoteForm.test.js` in the `src/test/` directory

```js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import NoteForm from "../note/NoteForm";
import "@testing-library/jest-dom/extend-expect";

const createNoteCallback = jest.fn();
const setFormDataCallback = jest.fn();
const formData = { name: "", description: "" };

const setup = () => {
  return render(
    <NoteForm
      notes={[]}
      createNoteCallback={createNoteCallback}
      setFormDataCallback={setFormDataCallback}
      formData={formData}
    />
  );
};

test("should display a create note button", () => {
  const { getByTestId } = setup();
  const button = getByTestId("note-form-submit");

  expect(button.props.children[0].props.children.props.children).toBe(
    "Create Note"
  );
});
```

- Run all the tests
- Green

- Add another `NoteForm` test

```js
test("should display the name placeholder", () => {
  const { getByPlaceholderText } = setup();
  const input = getByPlaceholderText("Note Name");

  expect(input).toBeTruthy();
});
```

- Run all the tests
- **Red**

- Update the input with the placeholder

```js
<TextInput
  testID="note-name-field"
  onChangeText={(text) =>
    props.setFormData({
      ...props.formData,
      name: text,
    })
  }
  placeholder="Note Name"
  value={props.formData.name}
/>
```
- Run all the tests
- Green

- Add another `NoteForm` test

```js
test("should display the description placeholder", () => {
  const { getByPlaceholderText } = setup();
  const input = getByPlaceholderText("Note Description");

  expect(input).toBeTruthy();
});
```
- Run all the tests
- **Red**

- Update the input with the placeholder

```js
<TextInput
  testID="note-description-field"
  onChangeText={(text) =>
    props.setFormData({
      ...props.formData,
      description: text,
    })
  }
  placeholder="Note Description"
  value={props.formData.description}
/>
```
- Run all the tests
- Green

- Add another `NoteForm` test
```js
test('should require name and description', () => {
    formData.name = "";
    formData.description = "";
    const { getByTestId } = setup();

    const button = getByTestId('note-form-submit');

    fireEvent.press(button)

    expect(createNoteCallback.mock.calls.length).toBe(0);
});
```
- Run all the tests
- **Red**

- Add validation for name and description
```js
function NoteForm(props) {

  function createNote() {
      if (!props.formData.name || !props.formData.description) return;
      props.createNote();
      props.setFormData({name: '', description: ''});
  }
  
  return (
    <View>
        ...
        <Button testID="note-form-submit" 
            title="Create Note" 
            onPress={createNote}/>
    </View>
  );
}
...
```

```js
function App() {
  ...

  async function createNote() {
    const newNote = await save(formData);
    const updatedNoteList = [ ...notes, newNote ];
    setNotes(updatedNoteList); 
  }

  ...

  return (
    ...
  );
}
...
```
- I moved the form name and description reset to the `NoteForm` component to keep reset with the fields that it resets.
- Run all the tests
- Green

- Add another `NoteForm` test
```js
test('should require name when description provided', () => {
    formData.name = "";
    formData.description = "test description";
    const { getByTestId } = setup();

    const button = getByTestId('note-form-submit');

    fireEvent.press(button)

    expect(createNoteCallback.mock.calls.length).toBe(0);
});
```
- Run all the tests
- Green

- Add another `NoteForm` test
```js
test('should require description when name provided', () => {
    formData.name = "test name";
    formData.description = "";
    const { getByTestId } = setup();

    const button = getByTestId('note-form-submit');

    fireEvent.press(button)

    expect(createNoteCallback.mock.calls.length).toBe(0);
});
```
- Run all the tests
- Green

- Add another `NoteForm` test
```js
test('should add a new note when name and description are provided', () => {
    formData.name = "test name";
    formData.description = "test description";
    const { getByTestId } = setup();

    const button = getByTestId('note-form-submit');

    fireEvent.press(button)

    expect(createNoteCallback.mock.calls.length).toBe(1);
});
```
- Run all the tests
- Green

- Add another `NoteForm` test
```js
test('should add a new note when name and description are provided', () => {
    formData.name = "test name";
    formData.description = "test description";
    const { getByTestId } = setup();

    const button = getByTestId('note-form-submit');

    fireEvent.press(button)

    expect(setFormDataCallback).toHaveBeenCalledWith({name: '', description: ''});
});
```
- Run all the tests
- Green
- Commit

[Code for this section](https://github.com/pairing4good/tdd-amplify-react-native/commit/6c98e133369339d7ef5c4a4c6539c77835ae12cc)

</details>

<details>
  <summary>Demonstrate The Native Mobile App</summary>

## Demonstrate The Native Mobile App
Up until now we have been using Expos Web view to test drive this app.  
- Run `expo start`
- Open http://localhost:19002/
- Set up one of the following
  - [iPhone Expo App](https://apps.apple.com/app/apple-store/id982107779)
  - [Android Expo App](https://play.google.com/store/apps/details?id=host.exp.exponent&referrer=www)
  - [iOS Simulator](https://docs.expo.io/workflow/ios-simulator)
  - [Android Studio Emulator](https://docs.expo.io/workflow/android-studio-emulator)

I installed the iPhone Expo App from the Apple Store.  I used my iPhone camera to scan the [QR Code](https://en.wikipedia.org/wiki/QR_code) provided in the [Metro Bundler](http://localhost:19002).

- I entered a new note through my iPhone
- I opened the Amplify web app that I deployed in the first tutorial.
- I refreshed the web app and verified that the new note is listed.
- I added a note through the web but it did not list the new note on the mobile app

```
Given a new note was entered outside of the mobile app
When I pull down to refresh
Then the new note is listed
```
- This is a new user story that came out of the mobile native app demo.
- In order to test drive this we will set up the auto refresh in the `NoteList` component so we can pass in the function and the refresh interval.
```js
...
const fetchNotesCallback = jest.fn();

const defaultProps = { 
    notes: [],
    deleteNoteCallback: deleteNoteCallback,
    fetchNotesCallback: fetchNotesCallback,
    interval: 1
 };
  
...

test('should reload the note list on the specified interval', () => {
    const oneMillisecond = 1
    setup({interval: oneMillisecond});

    expect(fetchNotesCallback.mock.calls.length > 1).toBe(true);
});
```
- Run all the tests
- **Red**

```js
useEffect(() => {
  const interval = setInterval(() => { props.fetchNotesCallback() }, props.interval);
  return () => clearInterval(interval);
}, []);
```
- The `useEffect` React hook is called during the loading of the page by React Native.  
- Run all the tests
- Green

[Code for this section]()

</details>