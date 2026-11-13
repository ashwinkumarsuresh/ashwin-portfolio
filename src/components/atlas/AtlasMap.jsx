import React, { useEffect, useMemo, useRef, useState } from 'react';
import { geoAlbersUsa, geoPath } from 'd3-geo';
import { feature, mesh } from 'topojson-client';
import us from 'us-atlas/states-albers-10m.json';
import { STATE_FIPS, pinLabel } from '../../lib/atlas';

// Key-free US map: us-atlas ships states already projected to a 975×610 Albers
// USA plane (Alaska and Hawaii as insets), and this projection places the pins
// on the same plane. No tiles, no API key, nothing fetched at runtime.
const WIDTH = 975;
const HEIGHT = 610;
const projection = geoAlbersUsa().scale(1300).translate([487.5, 305]);
const path = geoPath();
const states = feature(us, us.objects.states).features;
const borders = path(mesh(us, us.objects.states, (a, b) => a !== b));
const nation = path(feature(us, us.objects.nation));

// Pins stay the same size on screen at any width (finger-sized on phones).
const PIN_PX = 5;
const HIT_PX = 14;

function useViewBoxScale(ref) {
    const [scale, setScale] = useState(1);
    useEffect(() => {
        const el = ref.current;
        if (!el || typeof ResizeObserver === 'undefined') return undefined;
        const ro = new ResizeObserver(([entry]) => {
            const w = entry.contentRect.width;
            if (w > 0) setScale(w / WIDTH);
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, [ref]);
    return scale;
}

function routePath(route) {
    const pts = route.map((p) => projection([p.lng, p.lat])).filter(Boolean);
    return pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join('');
}

const AtlasMap = ({ pins, routes, visitedStates, selectedKey, onSelect }) => {
    const svgRef = useRef(null);
    const scale = useViewBoxScale(svgRef);
    const r = PIN_PX / scale;
    const hit = HIT_PX / scale;

    const visited = useMemo(
        () => new Set(visitedStates.map((s) => STATE_FIPS[s]).filter(Boolean)),
        [visitedStates]
    );

    const placed = useMemo(
        () =>
            pins
                .map((g) => ({ ...g, xy: projection([g.pin.lng, g.pin.lat]) }))
                .filter((g) => g.xy)
                // Draw the selected pin last so it sits on top of its neighbours.
                .sort((a, b) => (a.key === selectedKey) - (b.key === selectedKey)),
        [pins, selectedKey]
    );

    const onKey = (key) => (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(key);
        }
    };

    return (
        <svg
            ref={svgRef}
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="w-full h-auto block"
            role="group"
            aria-label="Map of the United States with a pin for each trip"
        >
            <path d={nation} fill="#F1ECE2" />
            {states.map((s) => (
                <path
                    key={s.id}
                    d={path(s)}
                    fill={visited.has(s.id) ? 'rgba(138, 94, 26, 0.16)' : 'none'}
                >
                    <title>{s.properties.name}</title>
                </path>
            ))}
            <path d={borders} fill="none" stroke="#ded8cc" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <path d={nation} fill="none" stroke="#5a5650" strokeWidth="1" vectorEffect="non-scaling-stroke" />

            {routes.map((t) => (
                <path
                    key={t.id}
                    d={routePath(t.route)}
                    fill="none"
                    stroke="#8A5E1A"
                    strokeWidth="1.5"
                    strokeDasharray="5 4"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                    opacity="0.85"
                    aria-hidden="true"
                />
            ))}

            {placed.map((g) => {
                const [x, y] = g.xy;
                const selected = g.key === selectedKey;
                const n = g.trips.length;
                const label = `${pinLabel(g)}: ${n === 1 ? g.trips[0].name : `${n} trips`}`;
                return (
                    <g
                        key={g.key}
                        role="button"
                        tabIndex={0}
                        aria-label={label}
                        aria-pressed={selected}
                        onClick={() => onSelect(g.key)}
                        onKeyDown={onKey(g.key)}
                        className="cursor-pointer"
                    >
                        <title>{label}</title>
                        <circle cx={x} cy={y} r={hit} fill="transparent" />
                        <circle
                            cx={x}
                            cy={y}
                            r={selected ? r * 1.5 : r}
                            fill={selected ? '#8A5E1A' : '#1C1A17'}
                            stroke="#FAF7F2"
                            strokeWidth={1.5 / scale}
                        />
                        {n > 1 && (
                            <text
                                x={x + r * 1.6}
                                y={y - r * 1.1}
                                fontSize={11 / scale}
                                className="font-mono"
                                fill="#5a5650"
                                aria-hidden="true"
                            >
                                ×{n}
                            </text>
                        )}
                    </g>
                );
            })}
        </svg>
    );
};

export default AtlasMap;
