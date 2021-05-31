import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import NoteList from '../note/NoteList';

const deleteNoteCallback = jest.fn();

const defaultProps = { 
    notes: [],
    deleteNoteCallback: deleteNoteCallback
 };
  
const setup = (props = {}) => {
    const setupProps = { ...defaultProps, ...props};
    return render(<NoteList {...setupProps}/>);
};

test('should display nothing when no notes are provided', () => {
    const { queryByTestId } = setup();
    const firstNoteName = queryByTestId('test-name-0');

    expect(firstNoteName).toBeNull()
});

test('should display one note when one notes is provided', () => {
    const note = {name: 'test name', description: 'test description'}
    const { queryByTestId } = setup({notes: [note]});

    const firstNoteName = queryByTestId('test-name-0');
    expect(firstNoteName.props.children).toBe("test name");

    const firstNoteDescription = queryByTestId('test-description-0');
    expect(firstNoteDescription.props.children).toBe("test description");
});

test('should display one note when one notes is provided', () => {
    const firstNote = {name: 'test name 1', description: 'test description 1'}
    const secondNote = {name: 'test name 2', description: 'test description 2'}
    const { queryByTestId } = setup({notes: [firstNote, secondNote]});

    const firstNoteName = queryByTestId('test-name-0');
    expect(firstNoteName.props.children).toBe("test name 1");

    const firstNoteDescription = queryByTestId('test-description-0');
    expect(firstNoteDescription.props.children).toBe("test description 1");


    const secondNoteName = queryByTestId('test-name-1');
    expect(secondNoteName.props.children).toBe("test name 2");

    const secondNoteDescription = queryByTestId('test-description-1');
    expect(secondNoteDescription.props.children).toBe("test description 2");
});

test('should delete note when clicked', () => {
    const note = {
        id: 1,
        name: 'test name 1',
        description: 'test description 1'
    }
    const notes = [ note ]
    const { getByTestId } = setup({notes: notes});
    const button = getByTestId('test-button-0');

    fireEvent.press(button)

    expect(deleteNoteCallback.mock.calls.length).toBe(1);
    expect(deleteNoteCallback.mock.calls[0][0]).toStrictEqual(1);
});

test('should throw an exception the note array is undefined', () => {
    expect(() => {render(<NoteList />)}).toThrowError();
});