import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LoginPage from '../pages/LoginPage';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    login: vi.fn(),
    signup: vi.fn(), 
    loginWithGoogle: vi.fn(), 
     currentUser: null, 
  }),
}));

describe('LoginPage basic tests', () => {
    // check if email and password inputs show up
  it ('renders login form with email and password fields', () => {
    render( 
       <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
    expect(screen.getByPlaceholderText(/email/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/password/i)).toBeTruthy();
  });

  it ('has a login button', () => {
    // make sure login button is there
    render(
      <MemoryRouter> 
        <LoginPage /> 
      </MemoryRouter>
    );
    expect(screen.getByText(/login/i)).toBeTruthy();
  });

  it('has a Google sign-in button', () => {
     // confirm Google sign-in button exists
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
    const googleButton = screen.getByRole('button', { name: /google/i });
    expect(googleButton).toBeTruthy();
  });

  it('switches to sign up form when clicking switch link', () => {
    // test if clicking link shows sign-up form
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
  
    const switchLink = screen.getByText((content, element) => {
      return ( 
        element?.tagName.toLowerCase() === 'span' &&
        element.className.includes('switch-link') && 

        /sign up/i.test(content) 
      );
    });
  
    fireEvent.click(switchLink);
  
    expect(screen.getByPlaceholderText(/first name/i)).toBeTruthy();
  });
});
