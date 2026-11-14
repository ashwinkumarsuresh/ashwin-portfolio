import React, { useEffect, useMemo, useState } from 'react';
import data from '../data/trips.json';
import AtlasMap from '../components/atlas/AtlasMap';
import {
    FILTERS,
    atlasStats,
    groupPins,
    matchesFilter,
    monthLabel,
    parkPassport,
    stampBookStates,
    pinLabel,
    tripsByYear,
} from '../lib/atlas';

// Travel atlas: the family's trips since 2021 on one page, in the site's
// editorial style (paper, ink rules, mono labels, one ochre accent).
// Data is hand-kept in src/data/trips.json: places, months and parks only —
// never costs, stays, addresses or booking details.
const { trips, parks, stampBook = [] } = data;

const Label = ({ children, className = '' }) => (
    <h2 className={`font-mono text-[11px] tracking-[0.2em] uppercase text-ink-soft mb-2 ${className}`}>
        {children}
    </h2>
);

const ParkChips = ({ ids }) =>
    ids.length > 0 && (
        <ul className="flex flex-wrap gap-1.5 mt-2" aria-label="National parks">
            {ids.map((id) => (
                <li
                    key={id}
                    className="font-mono text-[10px] tracking-[0.08em] uppercase text-ochre border border-ochre/40 px-1.5 py-0.5"
                >
                    {parks[id]?.name ?? id}
                </li>
            ))}
        </ul>
    );

const TripEntry = ({ trip, highlighted }) => {
    const month = monthLabel(trip);
    return (
        <li
            id={`trip-${trip.id}`}
            className={`scroll-mt-24 grid grid-cols-[4.5rem_1fr] md:grid-cols-[6rem_1fr] gap-x-4 py-4 border-b border-rule-soft pl-3 -ml-3 border-l-2 transition-colors ${
                highlighted ? 'border-l-ochre bg-ochre/[0.06]' : 'border-l-transparent'
            }`}
        >
            <span className="font-mono text-[11px] text-ink-soft pt-1.5">{month ?? trip.year}</span>
            <div>
                <h4 className="font-display font-semibold text-lg leading-snug">{trip.name}</h4>
                {trip.places.length > 0 && (
                    <p className="text-[15px] leading-relaxed text-ink/80 mt-0.5">{trip.places.join(' · ')}</p>
                )}
                <ParkChips ids={trip.parks} />
            </div>
        </li>
    );
};

const ParkStamp = ({ park, index }) => (
    <li
        className="aspect-square rounded-full border-2 border-ochre/80 p-1"
        style={{ transform: `rotate(${[-4, 3, -2, 5, -3, 2][index % 6]}deg)` }}
    >
        <div className="h-full w-full rounded-full border border-dashed border-ochre/50 flex flex-col items-center justify-center text-center px-2">
            <span className="font-mono text-[9px] tracking-[0.14em] uppercase text-ochre">{park.state}</span>
            <span className="font-display font-semibold text-[12px] sm:text-sm leading-tight text-ink my-1">
                {park.name}
            </span>
            <span className="font-mono text-[9px] tracking-[0.1em] text-ink-soft">
                {park.firstYear ?? 'Stamp book'}
                {park.visits > 1 ? ` · ×${park.visits}` : ''}
            </span>
        </div>
    </li>
);

const AtlasPage = () => {
    const [filter, setFilter] = useState('all');
    const [selectedKey, setSelectedKey] = useState(null);

    useEffect(() => {
        document.title = 'Travel atlas — Ashwin Kumar Suresh';
    }, []);

    const stats = useMemo(() => atlasStats(trips, stampBook, parks), []);
    const passport = useMemo(() => parkPassport(trips, parks, stampBook), []);

    const visible = useMemo(() => trips.filter((t) => matchesFilter(t, filter)), [filter]);
    const pins = useMemo(() => groupPins(visible), [visible]);
    const routes = useMemo(() => visible.filter((t) => t.route), [visible]);
    // Stamp-book parks have no trip or pin, but their states still count as visited.
    const visitedStates = useMemo(
        () => [
            ...new Set([
                ...visible.flatMap((t) => t.states),
                ...(filter === 'all' || filter === 'parks' ? stampBookStates(stampBook, parks) : []),
            ]),
        ],
        [visible, filter]
    );
    const years = useMemo(() => tripsByYear(visible), [visible]);

    // A pin hidden by the filter drops its selection without extra state.
    const selected = pins.find((g) => g.key === selectedKey) ?? null;
    const highlighted = new Set(selected ? selected.trips.map((t) => t.id) : []);

    const toggleSelect = (key) => setSelectedKey((k) => (k === key ? null : key));

    const statItems = [
        { value: stats.trips, label: 'Trips' },
        { value: stats.parks, label: 'National parks' },
        { value: stats.states, label: 'States' },
        { value: stats.years, label: 'Years on the road' },
    ];

    return (
        <div className="pt-28 md:pt-36 pb-6">
            <div className="max-w-[1080px] mx-auto px-6">
                {/* 1. Header */}
                <header className="masthead-settle">
                    <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-ochre">
                        Off the clock · {stats.firstYear}–{stats.lastYear}
                    </p>
                    <h1 className="font-display font-semibold text-[clamp(3rem,8vw,5.5rem)] leading-[0.98] tracking-tight mt-5 mb-4">
                        Travel atlas
                    </h1>
                    <hr className="w-24 border-0 border-t-[3px] border-ochre mb-6" />
                    <p className="text-xl md:text-[21px] leading-relaxed max-w-[600px] text-ink/85">
                        {stats.trips} trips since {stats.firstYear}, {stats.parks} national parks,{' '}
                        {stats.states} states.
                    </p>
                </header>

                {/* 2. Stat strip */}
                <dl className="grid grid-cols-2 md:grid-cols-4 border-t border-ink mt-10">
                    {statItems.map((s, i) => (
                        <div
                            key={s.label}
                            className={`py-5 pr-4 border-b border-rule-soft ${i % 2 === 1 ? 'pl-4 border-l' : ''} ${
                                i > 0 ? 'md:pl-4 md:border-l' : ''
                            }`}
                        >
                            <dt className="font-mono text-[10px] tracking-[0.14em] uppercase text-ink-soft">{s.label}</dt>
                            <dd className="font-display font-semibold text-4xl md:text-5xl mt-1">{s.value}</dd>
                        </div>
                    ))}
                </dl>

                {/* 3–4. Map + filters */}
                <section aria-labelledby="atlas-map" className="mt-12">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-4">
                        <Label className="mb-0">
                            <span id="atlas-map">The map</span>
                        </Label>
                        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter trips">
                            {FILTERS.map((f) => (
                                <button
                                    key={f.id}
                                    type="button"
                                    aria-pressed={filter === f.id}
                                    onClick={() => setFilter(f.id)}
                                    className={`font-mono text-[11px] tracking-[0.1em] uppercase px-3 py-1.5 border transition-colors ${
                                        filter === f.id
                                            ? 'bg-ink text-paper border-ink'
                                            : 'border-rule-soft text-ink-soft hover:border-ink hover:text-ink'
                                    }`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-b border-ink py-4">
                        <AtlasMap
                            pins={pins}
                            routes={routes}
                            visitedStates={visitedStates}
                            selectedKey={selected?.key ?? null}
                            onSelect={toggleSelect}
                        />
                        <p className="font-mono text-[10px] tracking-[0.08em] text-ink-soft mt-2">
                            Shaded: states visited · Dashed: the big road trips, sketched town to town · Tap a pin
                        </p>
                    </div>

                    {selected && (
                        <div className="mt-4 border border-ink p-4 md:p-5" aria-live="polite">
                            <div className="flex items-baseline justify-between gap-4">
                                <h3 className="font-display font-semibold text-xl">{pinLabel(selected)}</h3>
                                <button
                                    type="button"
                                    onClick={() => setSelectedKey(null)}
                                    className="font-mono text-[11px] tracking-[0.1em] uppercase text-ink-soft hover:text-ochre"
                                >
                                    Close
                                </button>
                            </div>
                            <ul className="mt-2">
                                {selected.trips.map((t) => (
                                    <li key={t.id} className="py-2 border-t border-rule-soft first:border-t-0">
                                        <a href={`#trip-${t.id}`} className="hover:text-ochre transition-colors">
                                            <span className="font-mono text-[11px] text-ink-soft mr-3">
                                                {monthLabel(t) ? `${monthLabel(t)} ${t.year}` : t.year}
                                            </span>
                                            <span className="text-[16px]">{t.name}</span>
                                        </a>
                                        <ParkChips ids={t.parks} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </section>

                {/* 5. Timeline */}
                <section aria-labelledby="atlas-timeline" className="mt-14">
                    <Label>
                        <span id="atlas-timeline">Every trip</span>
                    </Label>
                    <div className="border-t border-ink">
                        {years.map(([year, list]) => (
                            <div
                                key={year}
                                className="grid grid-cols-1 md:grid-cols-[7rem_1fr] gap-x-6 border-b border-ink/70"
                            >
                                <h3 className="font-display text-3xl text-rule-soft pt-4 md:pt-3">{year}</h3>
                                <ol className="pl-3">
                                    {list.map((t) => (
                                        <TripEntry key={t.id} trip={t} highlighted={highlighted.has(t.id)} />
                                    ))}
                                </ol>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 6. Parks passport */}
                <section aria-labelledby="atlas-passport" className="mt-14">
                    <Label>
                        <span id="atlas-passport">Parks passport</span>
                    </Label>
                    <p className="text-[15px] text-ink/80 border-t border-ink pt-4 mb-6">
                        {passport.length} national parks, stamped in the order they were first visited.
                        {stampBook.length > 0 &&
                            ' The ones marked “stamp book” are ticked in the family’s park stamp book; their trips aren’t on this page yet.'}
                    </p>
                    <ol className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
                        {passport.map((p, i) => (
                            <ParkStamp key={p.id} park={p} index={i} />
                        ))}
                    </ol>
                </section>
            </div>
        </div>
    );
};

export default AtlasPage;
