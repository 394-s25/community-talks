// ProfilePage.test.jsx
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import ProfilePage from '../pages/profile';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    currentUser: { email: 'test@example.com' }, // or null if unauthenticated
    logout: vi.fn(),
  }),
}));


vi.mock('../firebase', () => ({
  db: {},
  auth: {
    currentUser: { uid: 'test-user-id', email: 'test@example.com' },
    onAuthStateChanged: (callback) => {
      callback({ uid: 'test-user-id', email: 'test@example.com' });
      return () => {};
    },
  },
}));

vi.mock('firebase/database', () => ({
  ref: vi.fn(),
  get: vi.fn(() =>
    Promise.resolve({
      exists: () => true,
      val: () => ({
        zipcode: '60201',
        interests: [{ label: 'Zoning Committee' }],
        preferences: ['Virtual Comments'],
        experience: 'Gone to a meeting',
        gender: 'Female',
        race: 'Asian',
        homeowner: 'Renter'
      })
    })
  ),
  child: vi.fn(),
  update: vi.fn(() => Promise.resolve()),
}));

describe('ProfilePage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders ProfilePage with email and zipcode', async () => {
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );

    await waitFor(() => {
        expect(screen.getByText('Email:')).toBeInTheDocument();
        expect(screen.getByText('test@example.com')).toBeInTheDocument();
        expect(screen.getByText('Zipcode:')).toBeInTheDocument();
        expect(screen.getByText('60201')).toBeInTheDocument();
    });
  });

  test('renders user interests and preferences', async () => {
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Zoning Committee')).toBeInTheDocument();
      expect(screen.getByLabelText('Virtual Comments')).toBeChecked();
    });
  });

  test('renders experience and demographic values', async () => {
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Gone to a meeting')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Female')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Asian')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Renter')).toBeInTheDocument();
    });
  });
});