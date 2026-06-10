import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatLauncher from '../ChatLauncher';

describe('ChatLauncher', () => {
    it('opens the panel on the open-digital-twin CustomEvent', async () => {
        render(<ChatLauncher />);
        expect(screen.queryByPlaceholderText(/ask about the work/i)).toBeNull();

        act(() => {
            window.dispatchEvent(new CustomEvent('open-digital-twin'));
        });

        // Lazy chunk resolves, panel mounts open
        await waitFor(() =>
            expect(screen.getByPlaceholderText(/ask about the work/i)).toBeInTheDocument()
        );
    });

    it('dispatching the event twice opens exactly one panel (double-click safe)', async () => {
        render(<ChatLauncher />);
        act(() => {
            window.dispatchEvent(new CustomEvent('open-digital-twin'));
            window.dispatchEvent(new CustomEvent('open-digital-twin'));
        });
        await waitFor(() =>
            expect(screen.getAllByPlaceholderText(/ask about the work/i)).toHaveLength(1)
        );
    });

    it('removes the event listener on unmount (cleanup)', () => {
        const removeSpy = vi.spyOn(window, 'removeEventListener');
        const { unmount } = render(<ChatLauncher />);
        unmount();
        expect(removeSpy.mock.calls.some(([name]) => name === 'open-digital-twin')).toBe(true);
    });

    it('toggle button opens and closes the panel', async () => {
        const user = userEvent.setup();
        render(<ChatLauncher />);
        await user.click(screen.getByRole('button', { name: /ask my ai assistant/i }));
        await waitFor(() =>
            expect(screen.getByPlaceholderText(/ask about the work/i)).toBeInTheDocument()
        );
        await user.click(screen.getByRole('button', { name: /close the assistant/i }));
        await waitFor(() =>
            expect(screen.queryByPlaceholderText(/ask about the work/i)).toBeNull()
        );
    });
});
