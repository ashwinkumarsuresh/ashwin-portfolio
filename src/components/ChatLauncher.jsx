import React, { useState, useEffect, lazy, Suspense } from 'react';
import { MessageCircle, X } from 'lucide-react';

// Eager launcher + lazy panel (eng-review decisions 6A/14A):
// the launcher ships in the main bundle so the 'open-digital-twin' CustomEvent
// always has a listener; the panel (react-markdown, framer-motion) code-splits
// and loads on first open. Hovering the case-study CTA region prefetches it.
const ChatPanel = lazy(() => import('./ChatPanel'));
const prefetchPanel = () => import('./ChatPanel');

const ChatLauncher = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [hasOpened, setHasOpened] = useState(false);

    useEffect(() => {
        const open = () => {
            setIsOpen(true);
            setHasOpened(true);
        };
        window.addEventListener('open-digital-twin', open);
        return () => window.removeEventListener('open-digital-twin', open);
    }, []);

    const toggle = () => {
        setIsOpen((prev) => !prev);
        setHasOpened(true);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {hasOpened && (
                <Suspense
                    fallback={
                        isOpen ? (
                            <div className="mb-4 w-[400px] max-w-[calc(100vw-2rem)] bg-paper border border-ink p-6 font-mono text-xs text-ink-soft">
                                Loading the assistant…
                            </div>
                        ) : null
                    }
                >
                    <ChatPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
                </Suspense>
            )}

            <button
                type="button"
                onClick={toggle}
                onMouseEnter={prefetchPanel}
                onFocus={prefetchPanel}
                aria-label={isOpen ? 'Close the assistant' : 'Ask my AI assistant'}
                className="flex items-center gap-2.5 bg-paper border border-ink px-5 py-3 font-mono text-xs tracking-[0.06em] hover:bg-ink hover:text-paper transition-colors shadow-[3px_3px_0_#ded8cc]"
            >
                {isOpen ? <X className="w-4 h-4" /> : <MessageCircle className="w-4 h-4" />}
                {isOpen ? 'CLOSE' : 'ASK MY AI ASSISTANT'}
            </button>
        </div>
    );
};

export default ChatLauncher;
