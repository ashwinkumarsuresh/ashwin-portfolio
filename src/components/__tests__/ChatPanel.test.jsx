// CRITICAL regression guard (eng-review iron rule): the send→reply round-trip,
// retries and error handling must keep working. If these fail, the live demo is
// broken. The Firebase assistant itself is mocked; its pure parts are tested in
// src/lib/__tests__/assistant.test.js.
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatPanel from '../ChatPanel';
import { askAssistant } from '../../lib/assistant';

vi.mock('../../lib/assistant', () => ({ askAssistant: vi.fn() }));

const typeAndSend = async (user, text) => {
    await user.type(screen.getByPlaceholderText(/ask about the work/i), text);
    await user.click(screen.getByRole('button', { name: /send message/i }));
};

describe('ChatPanel (regression guard)', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        askAssistant.mockReset();
        localStorage.clear();
    });

    it('renders the welcome message when opened with no history', () => {
        render(<ChatPanel isOpen={true} onClose={() => {}} />);
        expect(screen.getByText(/ask me anything about his experience/i)).toBeInTheDocument();
    });

    it('completes a send→reply round-trip and persists to localStorage', async () => {
        const user = userEvent.setup();
        askAssistant.mockResolvedValue('He led the AI Foundry.');

        render(<ChatPanel isOpen={true} onClose={() => {}} />);
        await typeAndSend(user, 'What did Ashwin build?');

        expect(await screen.findByText('What did Ashwin build?')).toBeInTheDocument();
        expect(await screen.findByText(/He led the AI Foundry\./)).toBeInTheDocument();

        const stored = JSON.parse(localStorage.getItem('chat_messages'));
        expect(stored.map((m) => m.sender)).toEqual(['bot', 'user', 'bot']);

        // Called with the conversation so far (the welcome) and the new text
        expect(askAssistant).toHaveBeenCalledTimes(1);
        const [prior, text] = askAssistant.mock.calls[0];
        expect(text).toBe('What did Ashwin build?');
        expect(prior.map((m) => m.sender)).toEqual(['bot']);
    });

    it('recovers when a retry succeeds', async () => {
        const user = userEvent.setup();
        vi.useFakeTimers({ shouldAdvanceTime: true });
        askAssistant.mockRejectedValueOnce(new Error('boom')).mockResolvedValue('Second try worked.');

        render(<ChatPanel isOpen={true} onClose={() => {}} />);
        await typeAndSend(user, 'hello');

        expect(await screen.findByText('Second try worked.', {}, { timeout: 5000 })).toBeInTheDocument();
        expect(askAssistant).toHaveBeenCalledTimes(2);
        // The user's message is shown once, not once per attempt
        expect(screen.getAllByText('hello')).toHaveLength(1);
        vi.useRealTimers();
    });

    it('renders a user-visible error after retries are exhausted (no silent hang)', async () => {
        const user = userEvent.setup();
        vi.useFakeTimers({ shouldAdvanceTime: true });
        askAssistant.mockRejectedValue(new Error('unavailable'));

        render(<ChatPanel isOpen={true} onClose={() => {}} />);
        await typeAndSend(user, 'hello');

        // 1 initial + 2 retries with backoff
        await waitFor(
            () => expect(screen.getByText(/having trouble connecting/i)).toBeInTheDocument(),
            { timeout: 10000 }
        );
        expect(askAssistant).toHaveBeenCalledTimes(3);
        vi.useRealTimers();
    });

    it('renders nothing when isOpen is false', () => {
        const { container } = render(<ChatPanel isOpen={false} onClose={() => {}} />);
        expect(container.querySelector('input')).toBeNull();
    });
});
