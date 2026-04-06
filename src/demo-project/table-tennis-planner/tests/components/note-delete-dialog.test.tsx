import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NoteDeleteDialog } from '@/components/notes';

describe('NoteDeleteDialog', () => {
  it('renders nothing when not open', () => {
    const { container } = render(
      <NoteDeleteDialog isOpen={false} onConfirm={vi.fn()} onClose={vi.fn()} />
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders confirmation text when open', () => {
    render(
      <NoteDeleteDialog isOpen={true} onConfirm={vi.fn()} onClose={vi.fn()} />
    );
    expect(screen.getByText(/Notiz wirklich löschen/)).toBeInTheDocument();
  });

  it('calls onConfirm and onClose on successful deletion', async () => {
    const onConfirm = vi.fn().mockResolvedValue(true);
    const onClose = vi.fn();
    render(
      <NoteDeleteDialog isOpen={true} onConfirm={onConfirm} onClose={onClose} />
    );
    fireEvent.click(screen.getByText('Löschen'));
    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('does not close dialog on failed deletion', async () => {
    const onConfirm = vi.fn().mockResolvedValue(false);
    const onClose = vi.fn();
    render(
      <NoteDeleteDialog isOpen={true} onConfirm={onConfirm} onClose={onClose} />
    );
    fireEvent.click(screen.getByText('Löschen'));
    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalled();
    });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when cancel is clicked', () => {
    const onClose = vi.fn();
    render(
      <NoteDeleteDialog isOpen={true} onConfirm={vi.fn()} onClose={onClose} />
    );
    fireEvent.click(screen.getByText('Abbrechen'));
    expect(onClose).toHaveBeenCalled();
  });
});
