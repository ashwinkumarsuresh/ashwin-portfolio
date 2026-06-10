import React from 'react';

// Case study with Tufte-style margin sidenotes (design doc section 4).
// Layout: main column + reserved right margin rail on md+; sidenotes collapse
// inline below their paragraph on mobile.
//
//   ┌────────────────────────────┬───┬──────────────┐
//   │ main column (prose, figs)  │gap│ margin rail  │
//   │ ¹ markers in text ─────────────▶ sidenotes    │
//   └────────────────────────────┴───┴──────────────┘
//
// Fig. 1 is the hand-drawn retrieval-flow sketch (design doc step 0a — owner-drawn,
// photographed). Until /assets/rag-flow-sketch.jpg exists, the existing architecture
// image renders with an honest caption; swap the primary figure when the sketch lands.
const HAND_SKETCH = '/assets/rag-flow-sketch.jpg'; // TODO(step 0a): drop in the photographed sketch

const Sidenote = ({ id, children }) => (
    <aside
        className="text-[13px] italic leading-relaxed text-ink-soft border-l border-rule-soft pl-4 mt-3 md:mt-0"
        role="note"
        aria-label={`Sidenote ${id}`}
    >
        <span className="text-ochre not-italic font-mono text-[11px]">{id}</span> {children}
    </aside>
);

const DigitalTwinCaseStudy = () => {
    return (
        <section id="case-study" className="py-12 md:py-16">
            <div className="max-w-[1080px] mx-auto px-6">
                <h2 className="font-mono text-[11px] tracking-[0.2em] uppercase text-ink-soft mb-8">
                    Case Study — The Digital Twin
                </h2>

                <div className="md:grid md:grid-cols-[7fr_1fr_3fr] md:gap-y-8">
                    {/* ¶1 + sidenote 1 */}
                    <p className="text-[17px] leading-[1.7] max-w-[620px]">
                        This site answers questions about my work by itself. The assistant in the
                        corner is a RAG agent<sup className="text-ochre font-mono text-[11px]">1</sup> I
                        designed and run in production: FastAPI on Cloud Run, Firestore vector
                        search, Gemini via Vertex AI.
                    </p>
                    <div className="hidden md:block" />
                    <Sidenote id="1">
                        RAG — retrieval-augmented generation: the model answers from indexed
                        resume and project documents, not from memory, so replies stay grounded.
                    </Sidenote>

                    {/* Figure spans main column */}
                    <figure className="mt-8 md:mt-0 md:col-start-1">
                        <div className="bg-white border border-rule-soft p-4 md:p-6">
                            <picture>
                                <source srcSet="/assets/system-architecture.webp" type="image/webp" />
                                <img
                                    src="/assets/system-architecture.png"
                                    alt="System architecture of the Digital Twin: React frontend, FastAPI backend on Cloud Run, Firestore vector search, and Gemini via Vertex AI"
                                    width="1024"
                                    height="1024"
                                    loading="lazy"
                                    className="w-full h-auto"
                                />
                            </picture>
                        </div>
                        <figcaption className="font-mono text-[11px] text-ink-soft mt-2">
                            Fig. 1 — Architecture overview.
                        </figcaption>
                    </figure>
                    <div className="hidden md:block" />
                    <Sidenote id="2">
                        Hosted on Firebase; the same stack serves the page you are reading and the
                        assistant you can ask about it.
                    </Sidenote>

                    {/* ¶2 + sidenote 3 */}
                    <p className="text-[17px] leading-[1.7] max-w-[620px] mt-8 md:mt-0 md:col-start-1">
                        The build was a set of deliberate tradeoffs: Vite over a meta-framework
                        because a single-page portfolio needs no server rendering; Firestore vector
                        search over a dedicated vector database because the corpus is small and the
                        operational surface should be too; Gemini through Vertex AI for managed
                        auth, quotas, and observability instead of hand-rolled key management.
                    </p>
                    <div className="hidden md:block" />
                    <Sidenote id="3">
                        Tradeoffs documented in the repo&rsquo;s architecture guide — the same
                        reasoning the assistant will explain if you ask it.
                    </Sidenote>
                </div>

                <button
                    type="button"
                    onClick={() => window.dispatchEvent(new CustomEvent('open-digital-twin'))}
                    className="mt-10 inline-block border border-ink px-6 py-3 font-mono text-xs tracking-[0.06em] hover:bg-ink hover:text-paper transition-colors"
                >
                    → THIS IS THE SYSTEM DESCRIBED ABOVE. TRY IT.
                </button>
            </div>
        </section>
    );
};

export default DigitalTwinCaseStudy;
