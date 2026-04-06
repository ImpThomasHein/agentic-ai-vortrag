import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NoteEditModal } from '@/components/notes';

describe('NoteEditModal', () => {
  const mockNote = {
    id: '1',
    name: 'Test Notiz',
    description: 'Test Beschreibung',
    type: 'note' as const,
    category: 'notiz' as const,
    difficulty: 'beginner' as const,
    ttrRange: { min: 0, max: 2500 },
    diagram: { trajectories: [] },
  };

  it('renders nothing when not open', () => {
    const { container } = render(
      <NoteEditModal isOpen={false} note={mockNote} onSave={vi.fn()} onClose={vi.fn()} />
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders form with existing note data when open', () => {
    render(
      <NoteEditModal isOpen={true} note={mockNote} onSave={vi.fn()} onClose={vi.fn()} />
    );
    expect(screen.getByDisplayValue('Test Notiz')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Beschreibung')).toBeInTheDocument();
  });

  it('calls onSave with updated data on submit', async () => {
    const onSave = vi.fn().mockResolvedValue({ ...mockNote, name: 'Neuer Titel' });
    render(
      <NoteEditModal isOpen={true} note={mockNote} onSave={onSave} onClose={vi.fn()} />
    );
    const nameInput = screen.getByDisplayValue('Test Notiz');
    fireEvent.change(nameInput, { target: { value: 'Neuer Titel' } });
    fireEvent.click(screen.getByText('Speichern'));
    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith('1', { name: 'Neuer Titel', description: 'Test Beschreibung' });
    });
  });

  it('calls onClose when cancel is clicked', () => {
    const onClose = vi.fn();
    render(
      <NoteEditModal isOpen={true} note={mockNote} onSave={vi.fn()} onClose={onClose} />
    );
    fireEvent.click(screen.getByText('Abbrechen'));
    expect(onClose).toHaveBeenCalled();
  });
});
