import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AtlasPage from '../AtlasPage';

describe('AtlasPage', () => {
    it('renders the headline, stats, timeline and passport', () => {
        render(<AtlasPage />);
        expect(screen.getByRole('heading', { level: 1, name: 'Travel atlas' })).toBeInTheDocument();
        expect(screen.getByText('25 trips since 2021, 33 national parks, 14 states.')).toBeInTheDocument();
        expect(screen.getAllByRole('heading', { level: 4 })).toHaveLength(25);
        expect(screen.getByText(/33 national parks, stamped/)).toBeInTheDocument();
        expect(document.title).toMatch(/Travel atlas/);
    });

    it('shows the months the trips site knows and every park on its trip', () => {
        render(<AtlasPage />);
        const catalina = document.getElementById('trip-catalina-2022');
        expect(within(catalina).getByText('Aug')).toBeInTheDocument();
        const southwest = document.getElementById('trip-thanksgiving-southwest-2022');
        expect(within(southwest).getByText('Guadalupe Mountains')).toBeInTheDocument();
        expect(within(southwest).getByText('Saguaro')).toBeInTheDocument();
    });

    it('filters the timeline and the map together', async () => {
        const user = userEvent.setup();
        render(<AtlasPage />);
        const pinsBefore = screen.getAllByRole('button', { name: /:/ }).length;
        await user.click(screen.getByRole('button', { name: 'Road trips' }));
        expect(screen.getAllByRole('heading', { level: 4 })).toHaveLength(5);
        expect(screen.getAllByRole('button', { name: /:/ }).length).toBeLessThan(pinsBefore);
        await user.click(screen.getByRole('button', { name: 'Cities' }));
        expect(screen.getAllByRole('heading', { level: 4 }).map((h) => h.textContent)).toContain('New York City');
    });

    it('opens the trips at a pin and highlights them in the timeline', async () => {
        const user = userEvent.setup();
        render(<AtlasPage />);
        await user.click(screen.getByRole('button', { name: 'Las Vegas: 3 trips' }));
        const panel = screen.getByRole('heading', { level: 3, name: 'Las Vegas' }).closest('div').parentElement;
        expect(within(panel).getAllByRole('link')).toHaveLength(3);
        expect(document.getElementById('trip-las-vegas-2024').className).toMatch(/border-l-ochre/);
        await user.click(screen.getByRole('button', { name: 'Close' }));
        expect(screen.queryByRole('heading', { level: 3, name: 'Las Vegas' })).toBeNull();
    });
});
