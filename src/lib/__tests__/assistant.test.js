import { describe, it, expect, vi } from 'vitest';
import { buildSystemInstruction, toChatHistory } from '../assistant';
import { experiences, selectedWork } from '../../data/profile';

// The Firebase SDK is never reached by these pure helpers.
vi.mock('../firebase', () => ({ getFirebaseApp: vi.fn() }));

describe('buildSystemInstruction', () => {
    it('grounds the model in every role and project shown on the page', () => {
        const prompt = buildSystemInstruction();
        for (const e of experiences) expect(prompt).toContain(e.company);
        for (const w of selectedWork) expect(prompt).toContain(w.metric);
        expect(prompt).toMatch(/ONLY the facts below/);
    });
});

describe('toChatHistory', () => {
    const msg = (sender, text, extra = {}) => ({ sender, text, ...extra });

    it('maps senders to roles and drops the welcome and error bubbles', () => {
        const history = toChatHistory([
            msg('bot', 'Hi!', { isWelcome: true }),
            msg('user', 'Where does he work?'),
            msg('bot', 'Dine Brands.'),
            msg('user', 'And before?'),
            msg('bot', 'Sorry, trouble connecting', { isError: true }),
        ]);
        expect(history).toEqual([
            { role: 'user', parts: [{ text: 'Where does he work?' }] },
            { role: 'model', parts: [{ text: 'Dine Brands.' }] },
            { role: 'user', parts: [{ text: 'And before?' }] },
        ]);
    });

    it('starts on a user turn even for histories saved before the welcome flag existed', () => {
        const history = toChatHistory([msg('bot', 'Hi!'), msg('user', 'Q'), msg('bot', 'A')]);
        expect(history[0].role).toBe('user');
        expect(history).toHaveLength(2);
    });

    it('keeps only the most recent turns', () => {
        const many = Array.from({ length: 50 }, (_, i) => msg(i % 2 ? 'bot' : 'user', `m${i}`));
        const history = toChatHistory(many);
        expect(history.length).toBeLessThanOrEqual(20);
        expect(history.at(-1).parts[0].text).toBe('m49');
        expect(history[0].role).toBe('user');
    });

    it('returns nothing before the first visitor message', () => {
        expect(toChatHistory([msg('bot', 'Hi!', { isWelcome: true })])).toEqual([]);
    });
});
