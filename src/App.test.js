import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./components/Login', () => () => <div>LoginMock</div>);

test('renders app container', () => {
  render(<App />);
  expect(screen.getByRole('main')).toBeInTheDocument();
});