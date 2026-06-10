import React from 'react';

// Typographic masthead with a pencil-sketch portrait (op-ed style) — no photography,
// no slogans (design doc: editorial "The Quarterly"; portrait added at owner request).
// The portrait asset carries real alpha (strokes only, background transparent) —
// blend modes proved unreliable across browsers for hiding its paper background.
// Every claim in the dek is verifiable: lift + award from KeyAchievements history,
// Menu Without Borders from the attested abstract.
const Hero = () => {
    return (
        <header id="about" className="pt-28 md:pt-36 pb-10 md:pb-14">
            <div className="max-w-[1080px] mx-auto px-6 masthead-settle grid grid-cols-1 md:grid-cols-[1fr_340px] gap-x-12 items-center">
                <div>
                    <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-ochre">
                        Senior Manager · AI &amp; BI Architecture · 15 Years
                    </p>
                    <h1 className="font-display font-semibold text-[clamp(3.5rem,9vw,6.5rem)] leading-[0.98] tracking-tight mt-5 mb-4">
                        Ashwin Kumar<br />Suresh
                    </h1>
                    <hr className="w-24 border-0 border-t-[3px] border-ochre mb-7" />
                    <p className="text-xl md:text-[21px] leading-relaxed max-w-[600px] text-ink/85">
                        Enterprise data architect turned AI builder. Led the award-winning data
                        platform behind a 2024 CIO 100 Award and engineered a recommendation engine
                        driving a 1–2% site-wide sales lift.
                    </p>
                    <p className="text-xl md:text-[21px] leading-relaxed max-w-[600px] text-ink mt-4">
                        <em className="font-semibold">Now shipping production-grade GenAI applications</em> —
                        including Menu Without Borders, an automated pipeline processing thousands
                        of international menu items a day.
                    </p>
                </div>
                <picture className="order-first md:order-none mb-8 md:mb-0 justify-self-center md:justify-self-end">
                    <source srcSet="/assets/ashwin-sketch.webp" type="image/webp" />
                    <img
                        src="/assets/ashwin-sketch.png"
                        alt="Pencil-sketch portrait of Ashwin Kumar Suresh"
                        width="800"
                        height="800"
                        fetchPriority="high"
                        className="w-[220px] md:w-[340px] h-auto"
                    />
                </picture>
            </div>
        </header>
    );
};

export default Hero;
