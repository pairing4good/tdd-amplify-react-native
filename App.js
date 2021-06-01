import React, { useState, useEffect } from 'react';
import { View} from 'react-native';
import { withAuthenticator } from "aws-amplify-react-native";
import { findAll, save, deleteById } from './src/common/NoteRepository';
import Amplify from "aws-amplify"
import awsconfig from './aws-exports';
import NoteForm from './src/note/NoteForm';
import Header from './src/note/Header';
import NoteList from './src/note/NoteList';

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
  }

  async function deleteNoteCallback( id ) {
    const newNotesArray = notes.filter(note => note.id !== id);
    setNotes(newNotesArray);
    await deleteById(id);
  }

  return (
    <View>
      <Header/>
      <NoteForm setFormData={setFormData} 
        formData={formData} 
        createNote={createNote}/>
      <NoteList notes={notes} 
        deleteNoteCallback={deleteNoteCallback}
        fetchNotesCallback={fetchNotesCallback}
        interval={1000}/>
    </View>
  );
}

export default withAuthenticator(App, true)