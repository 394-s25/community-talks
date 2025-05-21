import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import '@testing-library/jest-dom';

// Test with MemoryRouter to simulate navigation
describe('App routing tests', () => {
  it('renders homepage on default route /', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    // Assuming HomePage renders something like "Welcome" or similar
    expect(screen.getByText(/welcome to community talks/i)).toBeInTheDocument();
  });

  it('redirects unknown routes to homepage', () => {
    render(
      <MemoryRouter initialEntries={['/random-route']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/welcome to community talks/i)).toBeInTheDocument();
  });

  it('renders login page on /login route', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/login|sign in/i)).toBeInTheDocument();
  });

});
