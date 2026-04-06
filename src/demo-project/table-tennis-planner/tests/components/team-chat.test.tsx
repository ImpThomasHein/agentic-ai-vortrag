/** Component tests for TeamChat container */
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TeamChat } from '@/components/chat/TeamChat';

// scrollIntoView is not available in jsdom
beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

// Mock the useChat hook to avoid real API calls
vi.mock('@/hooks/useChat', () => ({
  useChat: (teamId: string | null) => ({
    messages: teamId
      ? [
          {
            id: 'msg-1',
            teamId: 'team-1',
            userId: 'user-other',
            username: 'max',
            displayName: 'Max Schneider',
            content: 'Hallo!',
            imageId: null,
            createdAt: '2025-04-03T10:30:00Z',
            isEdited: false,
          },
          {
            id: 'msg-2',
            teamId: 'team-1',
            userId: 'user-1',
            username: 'thomas',
            displayName: 'Thomas Müller',
            content: 'Hi zurück!',
            imageId: null,
            createdAt: '2025-04-03T10:32:00Z',
            isEdited: true,
          },
        ]
      : [],
    sendMessage: vi.fn(),
    deleteMessage: vi.fn(),
    editMessage: vi.fn(),
    loadMore: vi.fn(),
    uploadImage: vi.fn(),
    hasMore: false,
    isLoading: false,
    isSending: false,
    isUploading: false,
  }),
}));

describe('TeamChat', () => {
  const defaultProps = {
    teamId: 'team-1',
    currentUserId: 'user-1',
    isTrainer: false,
  };

  it('renders Chat header', () => {
    render(<TeamChat {...defaultProps} />);
    expect(screen.getByText('Chat')).toBeInTheDocument();
  });

  it('shows messages when expanded', () => {
    render(<TeamChat {...defaultProps} defaultExpanded />);
    expect(screen.getByText('Max Schneider')).toBeInTheDocument();
    expect(screen.getByText('Hallo!')).toBeInTheDocument();
    expect(screen.getByText('Thomas Müller')).toBeInTheDocument();
    expect(screen.getByText('Hi zurück!')).toBeInTheDocument();
  });

  it('shows edited indicator for edited messages', () => {
    render(<TeamChat {...defaultProps} defaultExpanded />);
    expect(screen.getByText('(bearbeitet)')).toBeInTheDocument();
  });

  it('shows delete button for own messages (non-trainer)', () => {
    render(<TeamChat {...defaultProps} defaultExpanded />);
    // Only msg-2 is from user-1 (currentUserId), only one delete button
    const deleteButtons = screen.getAllByLabelText('Nachricht löschen');
    expect(deleteButtons.length).toBe(1);
  });

  it('shows delete button for all messages when trainer', () => {
    render(<TeamChat {...defaultProps} isTrainer defaultExpanded />);
    const deleteButtons = screen.getAllByLabelText('Nachricht löschen');
    expect(deleteButtons.length).toBe(2);
  });

  it('shows edit button only for own messages', () => {
    render(<TeamChat {...defaultProps} defaultExpanded />);
    const editButtons = screen.getAllByLabelText('Nachricht bearbeiten');
    expect(editButtons.length).toBe(1);
  });

  it('trainer cannot edit other users messages', () => {
    render(<TeamChat {...defaultProps} isTrainer defaultExpanded />);
    // Still only 1 edit button — only own messages can be edited
    const editButtons = screen.getAllByLabelText('Nachricht bearbeiten');
    expect(editButtons.length).toBe(1);
  });

  it('shows empty state when no messages', () => {
    render(<TeamChat teamId="" currentUserId="user-1" isTrainer={false} defaultExpanded />);
    expect(screen.getByText('Noch keine Nachrichten. Schreib die erste!')).toBeInTheDocument();
  });

  it('shows chat input when expanded', () => {
    render(<TeamChat {...defaultProps} defaultExpanded />);
    expect(screen.getByPlaceholderText('Nachricht schreiben...')).toBeInTheDocument();
  });
});
