import React, { useRef } from 'react';
import {View } from 'react-native';
import {Input, Button } from 'react-native-elements';

function NoteForm(props) {

  const noteName = useRef(null);

  function createNote() {
      if (!props.formData.name || !props.formData.description) return;
      props.createNote();
      props.setFormData({name: '', description: ''});
      noteName.current.focus();
  }
  
  return (
    <View>
        <Input testID="note-name-field" 
            onChangeText={text => props.setFormData({ 
            ...props.formData, 'name': text}
            )}
            placeholder="Note Name"
            ref={noteName}
            value={props.formData.name}/>

        <Input testID="note-description-field"  
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