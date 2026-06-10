// CRITICAL regression guard (eng-review iron rule): the restyle must not change
// the send→reply round-trip, error handling, or API-key behavior of the
// pre-redesign ChatWidget. If these fail, the live demo is broken.
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatPanel from '../ChatPanel';

const typeAndSend = async (user, text) => {
    await user.type(screen.getByPlaceholderText(/ask about the work/i), text);
    await user.click(screen.getByRole('button', { name: /send message/i }));
};

describe('ChatPanel (regression guard)', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('renders the welcome message when opened with no history', () => {
        render(<ChatPanel isOpen={true} onClose={() => {}} />);
        expect(screen.getByText(/ask me anything about his experience/i)).toBeInTheDocument();
    });

    it('completes a send→reply round-trip and persists to localStorage', async () => {
        const user = userEvent.setup();
        vi.spyOn(global, 'fetch').mockResolvedValue({
            ok: true,
            json: async () => ({ response: 'He led the AI Foundry.' }),
        });

        render(<ChatPanel isOpen={true} onClose={() => {}} />);
        await typeAndSend(user, 'What did Ashwin build?');

        expect(await screen.findByText('What did Ashwin build?')).toBeInTheDocument();
        expect(await screen.findByText(/He led the AI Foundry\./)).toBeInTheDocument();

        const stored = JSON.parse(localStorage.getItem('chat_messages'));
        expect(stored.map((m) => m.sender)).toEqual(['bot', 'user', 'bot']);

        // Request shape pinned: POST {url}/chat with message + session_id
        const [url, opts] = global.fetch.mock.calls[0];
        expect(url).toMatch(/\/chat$/);
        const body = JSON.parse(opts.body);
        expect(body.message).toBe('What did Ashwin build?');
        expect(body.session_id).toBeTruthy();
    });

    it('renders a user-visible error after retries are exhausted (no silent hang)', async () => {
        const user = userEvent.setup();
        vi.useFakeTimers({ shouldAdvanceTime: true });
        vi.spyOn(global, 'fetch').mockResolvedValue({ ok: false, status: 500 });

        render(<ChatPanel isOpen={true} onClose={() => {}} />);
        await typeAndSend(user, 'hello');

        // 1 initial + 2 retries with backoff
        await waitFor(
            () => expect(screen.getByText(/having trouble connecting/i)).toBeInTheDocument(),
            { timeout: 10000 }
        );
        expect(global.fetch).toHaveBeenCalledTimes(3);
        vi.useRealTimers();
    });

    it('renders nothing when isOpen is false', () => {
        const { container } = render(<ChatPanel isOpen={false} onClose={() => {}} />);
        expect(container.querySelector('input')).toBeNull();
    });
});
