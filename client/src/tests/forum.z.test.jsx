import { describe, it, expect, test, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider } from '../contexts/AuthContext';
import { MemoryRouter } from 'react-router-dom';
import "@testing-library/jest-dom";
import ForumPage from '../pages/ForumPage';


// it('math is easy', ({ expect }) => {
//     expect(2 + 2).toBe(4)
// })

// set the logout context
vi.mock('./contexts/AuthContext', () => ({
  useAuth: () => ({
    logout: vi.fn(), // empty mock function for logout
  }),
}));

describe("ForumPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("renders page header", async () => {
        render(
            <AuthProvider>
                <MemoryRouter>
                    <ForumPage/>
                </MemoryRouter>
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.findByText("Community Forum"));
        });
    });
});