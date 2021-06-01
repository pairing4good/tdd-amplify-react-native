import React, {useEffect } from 'react';
import {Text, Button, View} from 'react-native';

function NoteList(props) {

  useEffect(() => {
    const interval = setInterval(() => { props.fetchNotesCallback() }, props.interval);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <View>
        {
            props.notes.map((note, index) => (
                <View key={index}>
                    <Text testID={"test-name-" + index}>{note.name}</Text>
                    <Text testID={"test-description-" + index}>{note.description}</Text>
                    <Button testID={"test-button-" + index} 
                    onPress={() => props.deleteNoteCallback(note.id)}
                    title="Delete note" />
                </View>
            ))
        }
      </View>
  );
}

export default NoteList