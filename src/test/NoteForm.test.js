import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import NoteForm from "../note/NoteForm";
import '@testing-library/jest-dom/extend-expect';

const createNoteCallback = jest.fn();
const setFormDataCallback = jest.fn();
const formData = {name: '', description: ''}

const setup = (() => {
    return render(<NoteForm notes={[]} 
        createNote={createNoteCallback}
            setFormData={setFormDataCallback}
            formData={formData}/>)
});

test('should display a create note button', () => {
    const { getByTestId } = setup();
    const button = getByTestId('note-form-submit')
  
    expect(button.props.children[0].props.children.props.children).toBe('Create Note')
});

test('should display the name placeholder', () => {
    const { getByPlaceholderText } = setup();
    const input = getByPlaceholderText('Note Name');

    expect(input).toBeTruthy();
});

test('should display the description placeholder', () => {
    const { getByPlaceholderText } = setup();
    const input = getByPlaceholderText('Note Description');

    expect(input).toBeTruthy();
});

test('should require name and description', () => {
    formData.name = "";
    formData.description = "";
    const { getByTestId } = setup();

    const button = getByTestId('note-form-submit');

    fireEvent.press(button)

    expect(createNoteCallback.mock.calls.length).toBe(0);
});

test('should require name when description provided', () => {
    formData.name = "";
    formData.description = "test description";
    const { getByTestId } = setup();

    const button = getByTestId('note-form-submit');

    fireEvent.press(button)

    expect(createNoteCallback.mock.calls.length).toBe(0);
});

test('should require description when name provided', () => {
    formData.name = "test name";
    formData.description = "";
    const { getByTestId } = setup();

    const button = getByTestId('note-form-submit');

    fireEvent.press(button)

    expect(createNoteCallback.mock.calls.length).toBe(0);
});

test('should add a new note when name and description are provided', () => {
    formData.name = "test name";
    formData.description = "test description";
    const { getByTestId } = setup();

    const button = getByTestId('note-form-submit');

    fireEvent.press(button)

    expect(createNoteCallback.mock.calls.length).toBe(1);
});

test('should add a new note when name and description are provided', () => {
    formData.name = "test name";
    formData.description = "test description";
    const { getByTestId } = setup();

    const button = getByTestId('note-form-submit');

    fireEvent.press(button)

    expect(setFormDataCallback).toHaveBeenCalledWith({name: '', description: ''});
});