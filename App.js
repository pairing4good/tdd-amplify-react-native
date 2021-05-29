import React from 'react';
import { Text, View, TextInput, Button } from 'react-native';
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

export default withAuthenticator(App, true)