import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders stock dashboard', () => {
  render(<App />);
  const linkElement = screen.getByText(/실시간 주식 모니터링/i);
  expect(linkElement).toBeInTheDocument();
});
