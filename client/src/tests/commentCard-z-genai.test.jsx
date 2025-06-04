import { describe, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CommentCard from "../components/CommentCard";
import { auth } from "../firebase";

vi.mock("../firebase", () => {
    return {
        auth: {
            currentUser: null,
        }
    }
});

describe("Testing CommentCard", () => {
    const mockComment = {
        parentPostId: "testcomment1",
        parentCommentId: null,
        authorId: "-dBDIKbFiuqgifl",
        authorUserName: "testuser",
        content: "This is a test comment",
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    };

    const mockSetShowTopBanner = vi.fn();
    const mockSetBannerMessage = vi.fn();
    const mockAddComment = vi.fn();

    beforeEach(() => {
        // Reset any calls to our mocked functions
        vi.clearAllMocks();
    });

    it('renders author username and timestamp', () => {
        render(
          <CommentCard
            comment={mockComment}
            addComment={mockAddComment}
            setShowTopBanner={mockSetShowTopBanner}
            setBannerMessage={mockSetBannerMessage}
          />
        );
    
        // Check that username and approximate time appear
        expect(screen.getByText('testuser')).toBeInTheDocument();
        expect(screen.getByText(/hour ago/)).toBeInTheDocument();
        expect(screen.getByText('This is a test comment')).toBeInTheDocument();
      });


});