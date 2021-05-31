import React from 'react';
import {TextInput, Button, View } from 'react-native';

function NoteForm(props) {

  function createNote() {
      if (!props.formData.name || !props.formData.description) return;
      props.createNote();
      props.setFormData({name: '', description: ''});
  }
  
  return (
    <View>
        <TextInput testID="note-name-field" 
            onChangeText={text => props.setFormData({ 
            ...props.formData, 'name': text}
            )}
            placeholder="Note Name"
            value={props.formData.name}/>

        <TextInput testID="note-description-field"  
            onChangeText={text => props.setFormData({ 
            ...props.formData, 'description': text}
            )}
            placeholder="Note Description"
            value={props.formData.description}/>

        <Button testID="note-form-submit" 
            title="Create Note" 
            onPress={createNote}/>
    </View>
  );
}

export default NoteForm