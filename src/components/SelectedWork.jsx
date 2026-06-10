import React from 'react';

// Typeset numbered list — no cards, no icons (design doc: Selected Work 01–06).
// Entries 01–04 carry the prior KeyAchievements content; the Foundry entry keeps
// the source's "shipped or enablements" hedge and the honest denominator.
// 05–06 are the AI-assisted enterprise apps (user-confirmed, D10).
const entries = [
    {
        num: '01',
        body: 'AI Innovation Foundry — virtual lab incubating GenAI solutions with Microsoft, Google, and Cognizant; Gen AI ordering and culinary assistants among the deliveries.',
        metric: '15 SHIPPED OR ENABLED · 4 STOPPED',
    },
    {
        num: '02',
        body: 'Recommendation engine across brands — architecture, rollout, measurement. Winner of the 2024 CIO 100 Award.',
        metric: '+1–2% SITE SALES',
    },
    {
        num: '03',
        body: 'Cloud transformation — on-premise DW, ETL, and BI migrated to a fully cloud ecosystem on AWS and GCP.',
        metric: '100% CLOUD',
    },
    {
        num: '04',
        body: 'Customer data platform unifying website sales, call centers, and surveys into 360-degree customer insight.',
        metric: 'UNIFIED VIEW',
    },
    {
        num: '05',
        body: 'Menu Without Borders — GenAI platform for international menu intelligence: a daily Amazon Bedrock pipeline translates and matches menu items from local languages and POS codes to domestic catalog equivalents, paired with a human-in-the-loop review app with full audit trail.',
        metric: 'THOUSANDS OF ITEMS/DAY, UNATTENDED',
    },
    {
        num: '06',
        body: 'Demand forecaster for corporate restaurants — custom models trained on SageMaker instances (not out-of-the-box), backed by SageMaker Feature Store, offline today and online-capable.',
        metric: 'STORE × CHANNEL × DAYPART',
    },
];

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
