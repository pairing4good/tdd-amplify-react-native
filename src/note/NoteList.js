import React, { useEffect } from 'react';
import {SafeAreaView, ScrollView,} from 'react-native';
import {Card, Button, Text, ListItem} from 'react-native-elements';


function NoteList(props) {
  
  useEffect(() => {
    const interval = setInterval(() => { props.fetchNotesCallback() }, props.interval);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView>
        {
            props.notes.map((note, index) => (
              <ListItem key={index}>
                  <Card containerStyle={{flex: 1}}>
                      <Card.Title testID={"test-name-" + index}>{note.name}</Card.Title>
                      <Card.Divider/>
                      <Text testID={"test-description-" + index}>{note.description}</Text>
                      <Button testID={"test-button-" + index }  
                        style={{padding: 10}}
                        onPress={() => props.deleteNoteCallback(note.id)}
                        title="Delete note"/>
                  </Card>
                </ListItem>
            ))
        }
        </ScrollView>
      </SafeAreaView>
  );
}

export default NoteList