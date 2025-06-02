// HomePage.test.jsx
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import HomePage from '../Pages/HomePage';
// import '@testing-library/jest-dom';

import { MemoryRouter } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
// import * as firebaseDb from 'firebase/database';
vi.mock('./contexts/AuthContext', () => ({
  useAuth: () => ({
    logout: vi.fn(), // empty mock function for logout
  }),
}));

// ✅ mock firebase/database
vi.mock('firebase/database', () => {
  return {
    ref: vi.fn(),
    get: vi.fn(() =>
      Promise.resolve({
        val: () => ({
          'Standing Committees of the Council': {
            finance: { name: 'Finance Committee', slug: 'finance' },
          },
        }),
      })
    ),
    getDatabase: vi.fn(),
  };
});

describe('HomePage component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders welcome message', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    expect(screen.getByText('Welcome to Community Talks')).toBeInTheDocument();
  });

  test('displays committee from firebase data', async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByText('Finance Committee')).toBeInTheDocument()
    );
  });
});