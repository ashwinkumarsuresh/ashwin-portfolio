import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Hero from '../Hero';
import SelectedWork from '../SelectedWork';
import DigitalTwinCaseStudy from '../DigitalTwinCaseStudy';
import Navbar from '../Navbar';
import Experience from '../Experience';
import Footer from '../Footer';

describe('Hero (masthead)', () => {
    it('renders kicker, name, and the verifiable dek', () => {
        render(<Hero />);
        expect(screen.getByText(/senior manager · ai & bi architecture/i)).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Ashwin Kumar\s*Suresh/);
        expect(screen.getByText(/1–2% site-wide sales lift/)).toBeInTheDocument();
        expect(screen.getByText(/Menu Without Borders/)).toBeInTheDocument();
    });
});

describe('SelectedWork', () => {
    it('renders all 6 entries in order with their metrics', () => {
        render(<SelectedWork />);
        const items = screen.getAllByRole('listitem');
        expect(items).toHaveLength(6);
        expect(within(items[0]).getByText(/15 SHIPPED OR ENABLED · 4 STOPPED/)).toBeInTheDocument();
        expect(within(items[1]).getByText(/\+1–2% SITE SALES/)).toBeInTheDocument();
        expect(within(items[4]).getByText(/Menu Without Borders/)).toBeInTheDocument();
        expect(within(items[5]).getByText(/STORE × CHANNEL × DAYPART/)).toBeInTheDocument();
    });
});

describe('DigitalTwinCaseStudy', () => {
    it('renders the figure with caption and sidenotes', () => {
        render(<DigitalTwinCaseStudy />);
        expect(screen.getByRole('img', { name: /system architecture of the digital twin/i })).toBeInTheDocument();
        expect(screen.getByText(/Fig\. 1/)).toBeInTheDocument();
        expect(screen.getAllByRole('note').length).toBeGreaterThanOrEqual(2);
    });

    it('CTA dispatches open-digital-twin exactly once per click', async () => {
        const user = userEvent.setup();
        const handler = vi.fn();
        window.addEventListener('open-digital-twin', handler);
        render(<DigitalTwinCaseStudy />);
        await user.click(screen.getByRole('button', { name: /try it/i }));
        expect(handler).toHaveBeenCalledTimes(1);
        window.removeEventListener('open-digital-twin', handler);
    });
});

describe('Navbar', () => {
    it('links match the anchor map and #skills is gone', () => {
        render(<Navbar />);
        const hrefs = screen.getAllByRole('link').map((a) => a.getAttribute('href'));
        ['#about', '#projects', '#case-study', '#experience', '#contact'].forEach((id) =>
            expect(hrefs).toContain(id)
        );
        expect(hrefs).not.toContain('#skills');
    });

    it('mobile hamburger toggles the menu', async () => {
        const user = userEvent.setup();
        render(<Navbar />);
        const toggle = screen.getByRole('button', { name: /open menu/i });
        await user.click(toggle);
        expect(screen.getByRole('button', { name: /close menu/i })).toBeInTheDocument();
    });
});

describe('Experience', () => {
    it('renders merged entries and the typeset toolbox (no icon grid)', () => {
        render(<Experience />);
        expect(screen.getByText(/Senior Manager — AI and BI Architecture/)).toBeInTheDocument();
        expect(screen.getByText(/Sathyabama University/)).toBeInTheDocument();
        expect(screen.getByText(/Agent frameworks/)).toBeInTheDocument();
    });
});

describe('Footer', () => {
    it('renders contact links and colophon, no slogans', () => {
        render(<Footer />);
        expect(screen.getByRole('link', { name: /vinomashwin@gmail.com/i })).toBeInTheDocument();
        expect(screen.getByText(/Set in Fraunces & Newsreader/)).toBeInTheDocument();
        expect(screen.queryByText(/Architecting the Future of AI/)).toBeNull();
    });
});
