import React from 'react';
import { selectedWork as entries } from '../data/profile';

// Typeset numbered list — no cards, no icons (design doc: Selected Work 01–06).
// Entries 01–04 carry the prior KeyAchievements content; the Foundry entry keeps
// the source's "shipped or enablements" hedge and the honest denominator.
// 05–06 are the AI-assisted enterprise apps (user-confirmed, D10).
const SelectedWork = () => {
    return (
        <section id="projects" className="py-12 md:py-16">
            <div className="max-w-[1080px] mx-auto px-6">
                <h2 className="font-mono text-[11px] tracking-[0.2em] uppercase text-ink-soft mb-2">
                    Selected Work
                </h2>
                <ol className="border-t border-ink">
                    {entries.map((entry) => (
                        <li
                            key={entry.num}
                            className="grid grid-cols-[3.5rem_1fr] md:grid-cols-[4rem_1fr_220px] gap-x-4 md:gap-x-5 items-baseline py-6 border-b border-rule-soft"
                        >
                            <span className="font-display text-2xl text-rule-soft" aria-hidden="true">
                                {entry.num}
                            </span>
                            <p className="text-lg leading-relaxed">{entry.body}</p>
                            <span className="font-mono text-xs text-ochre md:text-right col-start-2 md:col-start-3 mt-2 md:mt-0">
                                {entry.metric}
                            </span>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
};

export default SelectedWork;
