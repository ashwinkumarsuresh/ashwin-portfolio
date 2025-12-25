import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState('');
    const [hasShownWelcome, setHasShownWelcome] = useState(false);
    const messagesEndRef = useRef(null);

    // Generate or retrieve session ID
    useEffect(() => {
        let storedSessionId = localStorage.getItem('chat_session_id');
        if (!storedSessionId) {
            storedSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem('chat_session_id', storedSessionId);
        }
        setSessionId(storedSessionId);

        // Load previous messages
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
            };
            setMessages([welcomeMessage]);
            setHasShownWelcome(true);
            localStorage.setItem('chat_messages', JSON.stringify([welcomeMessage]));
        }
    }, [isOpen, hasShownWelcome, messages.length]);

    // Send message to API
    const sendMessage = async (retryCount = 0) => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = {
            id: Date.now(),
            text: inputMessage,
            sender: 'user',
            timestamp: new Date().toISOString(),
        };

        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        localStorage.setItem('chat_messages', JSON.stringify(updatedMessages));
        setInputMessage('');
        setIsLoading(true);

        try {
            const response = await fetch('https://digital-twin-agent-988262606076.us-central1.run.app/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': '7f44101773872e75776916fdb36c2e7ad3ec103bc7f75653fd367bd254f75ba5',
                },
                body: JSON.stringify({
                    message: inputMessage,
                    session_id: sessionId,
                }),
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();

            const botMessage = {
                id: Date.now() + 1,
                text: data.response,
                sender: 'bot',
                timestamp: new Date().toISOString(),
            };

            const finalMessages = [...updatedMessages, botMessage];
            setMessages(finalMessages);
            localStorage.setItem('chat_messages', JSON.stringify(finalMessages));
        } catch (error) {
            console.error('Error sending message:', error);

            // Retry mechanism (max 2 retries)
            if (retryCount < 2) {
                setTimeout(() => {
                    sendMessage(retryCount + 1);
                }, 1000 * (retryCount + 1)); // Exponential backoff
            } else {
                const errorMessage = {
                    id: Date.now() + 1,
                    text: "Sorry, I'm having trouble connecting right now. Please try again later.",
                    sender: 'bot',
                    timestamp: new Date().toISOString(),
                    isError: true,
                };

                const finalMessages = [...updatedMessages, errorMessage];
                setMessages(finalMessages);
                localStorage.setItem('chat_messages', JSON.stringify(finalMessages));
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const clearChat = () => {
        setMessages([]);
        setHasShownWelcome(false);
        localStorage.removeItem('chat_messages');
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="mb-4 w-[400px] h-[600px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-8rem)] bg-slate-900 rounded-2xl shadow-2xl border border-white/10 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="glass p-4 flex items-center justify-between border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full flex items-center justify-center">
                                    <MessageCircle className="w-5 h-5 text-slate-900" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">Ashwin's AI Assistant</h3>
                                    <p className="text-xs text-gray-400">Usually replies instantly</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] px-4 py-2 rounded-2xl ${message.sender === 'user'
                                            ? 'bg-gold-500 text-slate-900'
                                            : message.isError
                                                ? 'bg-red-900/50 text-red-200'
                                                : 'bg-slate-800 text-gray-100'
                                            }`}
                                    >
                                        {message.sender === 'bot' ? (
                                            <div className="text-sm prose prose-invert prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0 prose-strong:text-gold-400">
                                                <ReactMarkdown>{message.text}</ReactMarkdown>
                                            </div>
                                        ) : (
                                            <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                                        )}
                                    </div>
                                </motion.div>
                            ))}

                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-slate-800 text-gray-100 px-4 py-2 rounded-2xl flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span className="text-sm">Typing...</span>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-white/10">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Type your message..."
                                    className="flex-1 bg-slate-800 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-gold-500"
                                    disabled={isLoading}
                                />
                                <button
                                    onClick={() => sendMessage()}
                                    disabled={isLoading || !inputMessage.trim()}
                                    className="bg-gold-500 text-slate-900 p-2 rounded-full hover:bg-gold-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="bg-gradient-to-br from-gold-500 to-gold-600 text-slate-900 w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <X className="w-6 h-6" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="open"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <MessageCircle className="w-6 h-6" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    );
};

export default ChatWidget;
