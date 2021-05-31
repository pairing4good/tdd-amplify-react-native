import React from 'react';
import {TextInput, Button } from 'react-native';

function NoteForm(props) {
  
  return (
    <div>
        <TextInput testID="note-name-field" 
            onChangeText={text => props.setFormData({ 
            ...props.formData, 'name': text}
            )}
            value={props.formData.name}/>

        <TextInput testID="note-description-field"  
            onChangeText={text => props.setFormData({ 
            ...props.formData, 'description': text}
            )}
            value={props.formData.description}/>

        <Button testID="note-form-submit" 
            title="Create Note" 
            onPress={props.createNote}/>
    </div>
  );
}

export default NoteForm