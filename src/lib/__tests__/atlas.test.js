import { describe, it, expect } from 'vitest';
import data from '../../data/trips.json';
import { atlasStats, earlierEntries, groupPins, matchesFilter, monthLabel, parkPassport, STATE_FIPS, tripsByYear } from '../atlas';

const { trips, parks } = data;
const earlier = earlierEntries(data.earlier);
const entries = [...trips, ...earlier];

describe('trips.json', () => {
    it('matches the trips site: 25 trips, 33 parks, 14 states, 2021–2026', () => {
        const s = atlasStats(trips, earlier);
        expect(s).toMatchObject({ trips: 25, parks: 33, states: 14, firstYear: 2021, lastYear: 2026, years: 6 });
        expect(s.stateList).toEqual(['AK', 'AZ', 'CA', 'CO', 'HI', 'ME', 'NM', 'NV', 'NY', 'OR', 'TX', 'UT', 'WA', 'WY']);
    });

    it('keeps only places, months and parks (no costs, stays, addresses or bookings)', () => {
        const allowed = new Set(['id', 'year', 'name', 'start', 'end', 'kind', 'places', 'states', 'parks', 'pin', 'route']);
        for (const t of trips) {
            for (const k of Object.keys(t)) expect(allowed.has(k), `${t.id}.${k}`).toBe(true);
        }
        expect(JSON.stringify(data)).not.toMatch(/\$|cost|price|hotel|airbnb|address|booking|confirmation/i);
    });

    it('leaves upcoming trips off the page', () => {
        const names = trips.map((t) => t.name).join(' ');
        expect(names).not.toMatch(/Big Bend|Fairbanks/);
        expect(Object.keys(parks)).not.toContain('big-bend');
    });

    it('has unique ids, known parks and known states', () => {
        expect(new Set(trips.map((t) => t.id)).size).toBe(trips.length);
        for (const t of trips) {
            t.parks.forEach((p) => expect(parks[p], `${t.id} → ${p}`).toBeDefined());
            t.states.forEach((s) => expect(STATE_FIPS[s], `${t.id} → ${s}`).toBeDefined());
            if (t.start) expect(t.start).toMatch(/^\d{4}-\d{2}$/);
        }
        for (const e of data.earlier) {
            e.parks.forEach((p) => expect(parks[p], p).toBeDefined());
            expect(e.pin, e.id).toBeTruthy();
            expect('year' in e, e.id).toBe(false);
        }
    });

    it('draws route lines for the four big road trips', () => {
        expect(trips.filter((t) => t.route).map((t) => t.id).sort()).toEqual([
            'arches-havasu-2023',
            'la-to-washington-2023',
            'rocky-mountain-2021',
            'thanksgiving-southwest-2022',
        ]);
    });
});

describe('atlas helpers', () => {
    it('puts the year-less earlier parks after the oldest year', () => {
        const groups = tripsByYear(entries);
        expect(groups[0][0]).toBe(2026);
        expect(groups.at(-1)[0]).toBeNull();
        expect(groups.at(-1)[1]).toHaveLength(5);
    });

    it('labels months and copes with unknown dates', () => {
        expect(monthLabel({ start: '2026-03', end: '2026-04' })).toBe('Mar – Apr');
        expect(monthLabel({ start: '2026-02', end: '2026-02' })).toBe('Feb');
        expect(monthLabel({ start: null, end: null })).toBeNull();
    });

    it('groups repeat visits onto one pin and skips trips without one', () => {
        const groups = groupPins(trips);
        const vegas = groups.find((g) => g.key === '36.17,-115.14');
        expect(vegas.trips).toHaveLength(3);
        expect(groups.flatMap((g) => g.trips)).toHaveLength(25);
        expect(groupPins(entries).flatMap((g) => g.trips)).toHaveLength(30);
        expect(groupPins([{ id: 'x', pin: null }])).toEqual([]);
    });

    it('filters road trips, park trips and cities', () => {
        const count = (f) => trips.filter((t) => matchesFilter(t, f)).length;
        expect(count('all')).toBe(25);
        expect(count('road-trips')).toBe(5);
        expect(count('cities')).toBe(7);
        expect(count('parks')).toBe(trips.filter((t) => t.parks.length).length);
    });

    it('stamps each park once, in first-visit order, counting repeat visits', () => {
        const passport = parkPassport(entries, parks);
        expect(passport).toHaveLength(33);
        expect(passport.slice(0, 5).map((p) => p.name)).toEqual([
            'Bryce Canyon', 'Channel Islands', 'Grand Canyon', 'Yellowstone', 'Zion',
        ]);
        expect(passport.slice(0, 5).every((p) => p.firstYear === null)).toBe(true);
        expect(passport[5].firstYear).toBe(2021);
        expect(passport.find((p) => p.id === 'death-valley')).toMatchObject({ firstYear: 2023, visits: 2 });
    });
});
