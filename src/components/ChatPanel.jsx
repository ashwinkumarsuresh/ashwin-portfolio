import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { askAssistant } from '../lib/assistant';

// Lazy-loaded chat panel (split out of the old ChatWidget). framer-motion and
// the Firebase SDK are allowed HERE ONLY — this chunk loads on first open, never
// in the main bundle (eng-review decision 14A). The retry/localStorage behavior
// is pinned by the regression suite.
const MAX_RETRIES = 2;

const ChatPanel = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [hasShownWelcome, setHasShownWelcome] = useState(false);
    const messagesEndRef = useRef(null);

    // Load previous messages
    useEffect(() => {
        const storedMessages = localStorage.getItem('chat_messages');
        if (storedMessages) {
            setMessages(JSON.parse(storedMessages));
            setHasShownWelcome(true);
        }
    }, []);

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Show welcome message when chat is first opened
    useEffect(() => {
        if (isOpen && !hasShownWelcome && messages.length === 0) {
            const welcomeMessage = {
                id: Date.now(),
                text: "Hi! I'm Ashwin's AI assistant. Ask me anything about his experience, projects, or skills!",
                sender: 'bot',
                timestamp: new Date().toISOString(),
                isWelcome: true,
            };
            setMessages([welcomeMessage]);
            setHasShownWelcome(true);
            localStorage.setItem('chat_messages', JSON.stringify([welcomeMessage]));
        }
    }, [isOpen, hasShownWelcome, messages.length]);

    const sendMessage = async () => {
        const text = inputMessage.trim();
        if (!text || isLoading) return;

        const userMessage = {
            id: Date.now(),
            text,
            sender: 'user',
            timestamp: new Date().toISOString(),
        };

        const priorMessages = messages;
        const updatedMessages = [...priorMessages, userMessage];
        setMessages(updatedMessages);
        localStorage.setItem('chat_messages', JSON.stringify(updatedMessages));
        setInputMessage('');
        setIsLoading(true);

        let botMessage;
        for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
            try {
                const reply = await askAssistant(priorMessages, text);
                botMessage = {
                    id: Date.now() + 1,
                    text: reply,
                    sender: 'bot',
                    timestamp: new Date().toISOString(),
                };
                break;
            } catch (error) {
                console.error('Error sending message:', error);
                if (attempt < MAX_RETRIES) {
                    // Backoff: 1s, then 2s
                    await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
                }
            }
        }

        if (!botMessage) {
            botMessage = {
                id: Date.now() + 1,
                text: "Sorry, I'm having trouble connecting right now. Please try again later.",
                sender: 'bot',
                timestamp: new Date().toISOString(),
                isError: true,
            };
        }

        const finalMessages = [...updatedMessages, botMessage];
        setMessages(finalMessages);
        localStorage.setItem('chat_messages', JSON.stringify(finalMessages));
        setIsLoading(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                    className="mb-4 w-[400px] h-[600px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-8rem)] bg-paper border border-ink shadow-[4px_4px_0_#ded8cc] flex flex-col overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-4 flex items-center justify-between border-b border-ink bg-paper">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 border border-ink flex items-center justify-center">
                                <MessageCircle className="w-4 h-4 text-ochre" />
                            </div>
                            <div>
                                <h3 className="font-display font-semibold text-[15px]">Ashwin&rsquo;s AI Assistant</h3>
                                <p className="font-mono text-[10px] text-ink-soft uppercase tracking-wide">The system from the case study</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-ink-soft hover:text-ink transition-colors"
                            aria-label="Close chat"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messages.map((message) => (
                            <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.25 }}
                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] px-3.5 py-2 text-sm border ${message.sender === 'user'
                                        ? 'bg-ink text-paper border-ink'
                                        : message.isError
                                            ? 'bg-paper text-ochre border-ochre'
                                            : 'bg-white text-ink border-rule-soft'
                                        }`}
                                >
                                    {message.sender === 'bot' ? (
                                        <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0 prose-strong:text-ochre text-ink">
                                            <ReactMarkdown>{message.text}</ReactMarkdown>
                                        </div>
                                    ) : (
                                        <p className="whitespace-pre-wrap">{message.text}</p>
                                    )}
                                </div>
                            </motion.div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-rule-soft text-ink-soft px-3.5 py-2 flex items-center gap-2">
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    <span className="font-mono text-[11px] uppercase tracking-wide">Thinking…</span>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t border-ink bg-paper">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask about the work above…"
                                className="flex-1 bg-white border border-rule-soft text-ink px-3.5 py-2 text-sm focus:outline-none focus:border-ochre"
                                disabled={isLoading}
                            />
                            <button
                                onClick={() => sendMessage()}
                                disabled={isLoading || !inputMessage.trim()}
                                aria-label="Send message"
                                className="border border-ink px-3 hover:bg-ink hover:text-paper transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ChatPanel;
