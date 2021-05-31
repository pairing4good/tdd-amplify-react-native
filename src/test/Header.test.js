import React from 'react';
import { render } from '@testing-library/react-native'
import Header from '../note/Header';

test('should display header', () => {
  const { getByTestId } = render(<Header />);
  const heading = getByTestId('note-header');
  expect(heading.props.children).toBe('My Notes App')
});