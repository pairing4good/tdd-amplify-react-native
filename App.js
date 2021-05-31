import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, Button } from 'react-native';
import { withAuthenticator } from "aws-amplify-react-native";
import { findAll, save } from './src/common/NoteRepository';
import Amplify from "aws-amplify"
import awsconfig from './aws-exports';

Amplify.configure({
  ...awsconfig,
  Analytics: {
    disabled: true,
  },
});

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
    setFormData({name: '', description: ''});
  }

  return (
    <View>
      <Text testID="note-header">My Notes App</Text>

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

export default withAuthenticator(App, true)