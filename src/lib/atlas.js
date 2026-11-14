// Pure helpers for the Travel atlas page. All counts on the page are derived
// from src/data/trips.json so the headline never drifts from the list.

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const FILTERS = [
    { id: 'all', label: 'All' },
    { id: 'road-trips', label: 'Road trips' },
    { id: 'parks', label: 'National parks' },
    { id: 'cities', label: 'Cities' },
];

export function matchesFilter(trip, filter) {
    switch (filter) {
        case 'road-trips':
            return trip.kind === 'road-trip';
        case 'parks':
            return trip.parks.length > 0;
        case 'cities':
            return trip.kind === 'city';
        default:
            return true;
    }
}

// "2026-03" → "Mar". Dates are kept to the month on purpose.
function monthOf(ym) {
    const m = Number(ym.split('-')[1]);
    return MONTHS[m - 1];
}

// Month label for a trip: "Mar", "Mar – Apr", or null when the date is unknown
// (the year heading above the entry is then all the page shows).
export function monthLabel(trip) {
    if (!trip.start) return null;
    const a = monthOf(trip.start);
    const b = trip.end ? monthOf(trip.end) : a;
    return a === b ? a : `${a} – ${b}`;
}

// stampBook: parks ticked in the family's stamp book whose trip isn't on the
// page (no year recorded). They count toward parks and states.
export function stampBookStates(stampBook = [], parks = {}) {
    return stampBook.map((id) => parks[id]?.state).filter(Boolean);
}

export function atlasStats(trips, stampBook = [], parks = {}) {
    const parkIds = new Set([...trips.flatMap((t) => t.parks), ...stampBook]);
    const states = new Set([...trips.flatMap((t) => t.states), ...stampBookStates(stampBook, parks)]);
    const years = trips.map((t) => t.year);
    const first = Math.min(...years);
    const last = Math.max(...years);
    return {
        trips: trips.length,
        parks: parkIds.size,
        states: states.size,
        stateList: [...states].sort(),
        firstYear: first,
        lastYear: last,
        years: last - first + 1,
    };
}

// Newest year first; trips keep the hand-kept file order within a year.
export function tripsByYear(trips) {
    const byYear = new Map();
    for (const t of trips) {
        if (!byYear.has(t.year)) byYear.set(t.year, []);
        byYear.get(t.year).push(t);
    }
    return [...byYear.entries()].sort((a, b) => b[0] - a[0]);
}

export const pinKey = (pin) => `${pin.lat},${pin.lng}`;

// One map pin per place: repeat visits (Las Vegas ×3, Sedona ×3…) share a pin.
export function groupPins(trips) {
    const groups = new Map();
    for (const t of trips) {
        if (!t.pin) continue;
        const key = pinKey(t.pin);
        if (!groups.has(key)) groups.set(key, { key, pin: t.pin, trips: [] });
        groups.get(key).trips.push(t);
    }
    return [...groups.values()];
}

// A short place name for a pin's label: the first place of its newest trip,
// without the state suffix ("Las Vegas, NV" → "Las Vegas").
export function pinLabel(group) {
    const t = group.trips[0];
    const place = t.places[0] || t.name;
    return place.replace(/,\s*[A-Z]{2}$/, '');
}

// Passport stamps in the order they were first collected; stamp-book parks
// with no recorded year come last.
export function parkPassport(trips, parks, stampBook = []) {
    const visits = new Map();
    for (const t of trips) {
        for (const id of t.parks) {
            if (!visits.has(id)) visits.set(id, []);
            visits.get(id).push(t.year);
        }
    }
    const stamps = [...visits.entries()].map(([id, years]) => ({
        id,
        name: parks[id]?.name ?? id,
        state: parks[id]?.state ?? '',
        firstYear: Math.min(...years),
        visits: years.length,
    }));
    const undated = stampBook
        .filter((id) => !visits.has(id))
        .map((id) => ({ id, name: parks[id]?.name ?? id, state: parks[id]?.state ?? '', firstYear: null, visits: 0 }));
    stamps.sort((a, b) => a.firstYear - b.firstYear || a.name.localeCompare(b.name));
    undated.sort((a, b) => a.name.localeCompare(b.name));
    return [...stamps, ...undated];
}

// Two-letter state code → Census FIPS id used by us-atlas.
export const STATE_FIPS = {
    AL: '01', AK: '02', AZ: '04', AR: '05', CA: '06', CO: '08', CT: '09', DE: '10',
    DC: '11', FL: '12', GA: '13', HI: '15', ID: '16', IL: '17', IN: '18', IA: '19',
    KS: '20', KY: '21', LA: '22', ME: '23', MD: '24', MA: '25', MI: '26', MN: '27',
    MS: '28', MO: '29', MT: '30', NE: '31', NV: '32', NH: '33', NJ: '34', NM: '35',
    NY: '36', NC: '37', ND: '38', OH: '39', OK: '40', OR: '41', PA: '42', RI: '44',
    SC: '45', SD: '46', TN: '47', TX: '48', UT: '49', VT: '50', VA: '51', WA: '53',
    WV: '54', WI: '55', WY: '56',
};
