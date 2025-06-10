// HomePageLayout.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import HomePage from '../pages/HomePage';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/react';
const mockNavigate = vi.fn();

// Mock AuthContext
vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    logout: vi.fn(),
  }),
}));

// Scroll mocking
window.HTMLElement.prototype.scrollIntoView = vi.fn();

// Mock Firebase database
vi.mock('firebase/database', () => ({
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
}));

describe('HomePage layout structure', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders NavBar before main content', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    const header = screen.getByText('Welcome to Community Talks');
    const nav = document.querySelector('.homepage-container > .homepage-layout > .homepage-main .homepage-header h1');

    expect(header).toBeInTheDocument();
    expect(nav).toHaveTextContent('Welcome to Community Talks');
  });

  it('renders SidebarNav before grid content', async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Finance Committee')).toBeInTheDocument();
    });

    const sidebar = document.querySelector('.sidebar-nav');
    const grid = document.querySelector('.homepage-grid');

    expect(sidebar).toBeInTheDocument();
    expect(grid).toBeInTheDocument();
    expect(sidebar.compareDocumentPosition(grid) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});


describe('HomePage interactive behavior', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('clicking sidebar link scrolls to and highlights section', async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByText('Finance Committee')).toBeInTheDocument()
    );


    // get all occurrences of the title
    const allLinks = screen.getAllByText('Standing Committees of the Council');

    // select the sidebar <span> or <a> based on context (usually the first one)
    const sidebarLink = allLinks.find(el => el.tagName === 'SPAN' || el.closest('a.sidebar-link'));

    fireEvent.click(sidebarLink);

    const section = document.getElementById('standing-committees-of-the-council');
    expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();
    expect(section.className).toContain('highlight');
  });

  test('clicking a committee item triggers correct navigation or fallback', async () => {
    
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useNavigate: () => mockNavigate,
      };
    });

    const { get } = await import('firebase/database');
    get
      .mockResolvedValueOnce({
        val: () => ({
          'Standing Committees of the Council': {
            finance: { name: 'Finance Committee', slug: 'finance' },
          },
        }),
      })
      .mockResolvedValueOnce({ val: () => ({}) }) // detail not found
      .mockResolvedValueOnce({
        val: () => ({
          finance: { name: 'Finance Committee', slug: 'finance' },
        }),
      });

    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => { });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByText('Finance Committee')).toBeInTheDocument()
    );

    fireEvent.click(screen.getByText('Finance Committee'));
    openSpy.mockRestore();
  });


});
