import React from 'react';
import { experiences, toolbox } from '../data/profile';

// Editorial entries — mono date left, role + outcomes right. No cards, no icons,
// no timeline dots. CoreExpertise is folded in as the typeset toolbox below
// (design doc section 5; anchor #skills retired).
const Experience = () => {
    return (
        <section id="experience" className="py-12 md:py-16">
            <div className="max-w-[1080px] mx-auto px-6">
                <h2 className="font-mono text-[11px] tracking-[0.2em] uppercase text-ink-soft mb-2">
                    Experience
                </h2>
                <div className="border-t border-ink">
                    {experiences.map((exp) => (
                        <div
                            key={exp.period + exp.role}
                            className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-x-6 py-5 border-b border-rule-soft"
                        >
                            <span className="font-mono text-[11px] text-ink-soft pt-1">{exp.period}</span>
                            <div>
                                <h3 className="font-display font-semibold text-lg">{exp.role}</h3>
                                <p className="text-[15px] text-ink-soft">{exp.company}</p>
                                <p className="text-[15px] leading-relaxed mt-1.5 text-ink/80">{exp.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <p className="mt-8 text-[15px] leading-[1.9] max-w-[720px] text-ink/80">
                    {toolbox.map(([label, items], i) => (
                        <span key={label}>
                            <span className="font-mono text-[11px] tracking-wide uppercase text-ink-soft">{label}</span>{' '}
                            — {items}
                            {i < toolbox.length - 1 ? ' · ' : ''}
                        </span>
                    ))}
                </p>
            </div>
        </section>
    );
};

export default Experience;
