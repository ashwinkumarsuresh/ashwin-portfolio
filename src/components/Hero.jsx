import React from 'react';

// Typographic masthead — no imagery, no slogans (design doc: editorial "The Quarterly").
// Every claim in the dek is verifiable: lift + award from KeyAchievements history,
// Menu Without Borders from the attested abstract.
const Hero = () => {
    return (
        <header id="about" className="pt-28 md:pt-36 pb-10 md:pb-14">
            <div className="max-w-[1080px] mx-auto px-6 masthead-settle">
                <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-ochre">
                    Senior Manager · AI &amp; BI Architecture · 15 Years
                </p>
                <h1 className="font-display font-semibold text-[clamp(3.5rem,9vw,6.5rem)] leading-[0.98] tracking-tight mt-5 mb-4">
                    Ashwin Kumar<br />Suresh
                </h1>
                <hr className="w-24 border-0 border-t-[3px] border-ochre mb-7" />
                <p className="text-xl md:text-[21px] leading-relaxed max-w-[600px] text-ink/85">
                    Built the recommendation engine behind a 1–2% site-wide sales lift; led the
                    data platform recognized with a 2024 CIO 100 Award. Now shipping enterprise
                    GenAI applications — most recently Menu Without Borders, processing thousands
                    of international menu items a day.
                </p>
            </div>
        </header>
    );
};

export default Hero;
