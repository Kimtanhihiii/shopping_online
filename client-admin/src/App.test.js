import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('axios', () => ({
  post: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
}), { virtual: true });

jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => <div>{children}</div>,
  Routes: ({ children }) => <div>{children}</div>,
  Route: () => null,
  Navigate: () => null,
  Link: ({ children }) => <span>{children}</span>
}), { virtual: true });

import App from './App';

test('renders admin login heading', () => {
  render(<App />);
  expect(screen.getByText(/admin login/i)).toBeInTheDocument();
});
