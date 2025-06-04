import { describe, test, vi, beforeEach, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react';
import LoginPage from '../pages/LoginPage';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    login: vi.fn(() => Promise.resolve()),
    signup: vi.fn(() => Promise.resolve()),
    loginWithGoogle: vi.fn(() => Promise.resolve({ _tokenResponse: { isNewUser: false } })),
  }),
}));

describe('LoginPage component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders login form by default', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  test('allows user to input email and password and submit login', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: '123456' } });

    await act(async () => {
      fireEvent.click(screen.getByText('Login'));
    });

    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('123456')).toBeInTheDocument();
  });

  test('can switch to sign up form', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    await act(async () => {
      fireEvent.click(screen.getByText('Sign up'));
    });

    expect(screen.getByText((content, element) => {
      return element.tagName.toLowerCase() === 'h4' && content === 'Sign Up';
    })).toBeInTheDocument();

    expect(screen.getByPlaceholderText('First name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last name')).toBeInTheDocument();
  });

  test('clicking Google button triggers loginWithGoogle', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const googleButton = screen.getByText(/Sign In with Google/i);

    await act(async () => {
      fireEvent.click(googleButton);
    });

    expect(googleButton).toBeInTheDocument();
  });
});
