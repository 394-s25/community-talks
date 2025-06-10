import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import IssuePage from '../pages/issue';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import '@testing-library/jest-dom';

// ✅ mock Firebase
vi.mock('firebase/database', () => ({
  ref: vi.fn(),
  get: vi.fn(() =>
    Promise.resolve({
      exists: () => true,
      val: () => ({
        description: 'Some text here.',
        // ⛔ intentionally omit "members"
      }),
    })
  ),
  getDatabase: vi.fn(),
}));

vi.mock('../firebase', () => ({
  db: {},
}));

describe('IssuePage (negative cases)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does NOT render members section if "members" field is missing', async () => {
    render(
      <MemoryRouter initialEntries={['/department/SomeCategory/sample-slug']}>
        <Routes>
          <Route path="/department/:category/:slug" element={<IssuePage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      // ✅ members section title should NOT be present
      expect(screen.queryByText(/👫 Members/i)).not.toBeInTheDocument();
    });
  });

  it('does NOT render "📽️ Recordings" section when recordings field is missing', async () => {
    render(
      <MemoryRouter initialEntries={['/department/SomeCategory/sample-slug']}>
        <Routes>
          <Route path="/department/:category/:slug" element={<IssuePage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText(/📽️ Recordings/i)).not.toBeInTheDocument();
    });
  });



  it('renders "DUTIES & RESPONSIBILITIES" section when description is present', async () => {
    render(
      <MemoryRouter initialEntries={['/department/SomeCategory/sample-slug']}>
        <Routes>
          <Route path="/department/:category/:slug" element={<IssuePage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/DUTIES & RESPONSIBILITIES/i)).toBeInTheDocument();
    });
  });

});