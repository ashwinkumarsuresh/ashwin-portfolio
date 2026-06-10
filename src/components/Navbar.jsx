import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

// Editorial navbar — paper background, ink rule, mono uppercase links.
// Anchor map per design doc: #skills retired (CoreExpertise folded into Experience).
const links = [
    { name: 'About', href: '#about' },
    { name: 'Work', href: '#projects' },
    { name: 'Case Study', href: '#case-study' },
    { name: 'Experience', href: '#experience' },
    { name: 'Contact', href: '#contact' },
];

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 w-full z-40 bg-paper/95 backdrop-blur-sm border-b border-ink">
            <div className="max-w-[1080px] mx-auto px-6 flex justify-between items-baseline py-4">
                <a href="#about" className="font-display font-bold text-base">
                    Ashwin K. Suresh
                </a>

                {/* Desktop */}
                <div className="hidden md:flex items-baseline gap-7">
                    {links.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="font-mono text-[11px] tracking-[0.12em] uppercase text-ink-soft hover:text-ochre transition-colors"
                        >
                            {link.name}
                        </a>
                    ))}
                </div>

                {/* Mobile toggle */}
                <button
                    className="md:hidden text-ink"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label={isOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={isOpen}
                >
                    {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden border-t border-rule-soft bg-paper">
                    <div className="flex flex-col px-6 py-4 gap-4">
                        {links.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="font-mono text-xs tracking-[0.12em] uppercase text-ink-soft hover:text-ochre"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
