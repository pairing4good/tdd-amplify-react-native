import React from 'react';
import {Text, Button} from 'react-native';

function NoteList(props) {
  
  return (
      <div>
        {
            props.notes.map((note, index) => (
            <div>
                <Text testID={"test-name-" + index}>{note.name}</Text>
                <Text testID={"test-description-" + index}>{note.description}</Text>
                <Button testID={"test-button-" + index} 
                onPress={() => props.deleteNoteCallback(note.id)}
                title="Delete note" />
            </div>
            ))
        }
      </div>
  );
}

export default NoteList