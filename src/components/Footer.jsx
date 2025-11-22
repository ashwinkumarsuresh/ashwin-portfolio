import React from 'react';
import { Mail, Phone, Linkedin, Github } from 'lucide-react';

const Footer = () => {
    return (
        <footer id="contact" className="bg-slate-950 py-12 border-t border-white/10">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-4">Let's <span className="text-gradient">Connect</span></h2>
                        <p className="text-gray-400 max-w-md">
                            Interested in discussing AI architecture, data strategy, or potential collaborations? Reach out today.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <a href="mailto:vinomashwin@gmail.com" className="flex items-center gap-3 text-gray-300 hover:text-gold-400 transition-colors group">
                            <div className="p-2 bg-white/5 rounded-full group-hover:bg-gold-500/20 transition-colors">
                                <Mail className="w-5 h-5" />
                            </div>
                            vinomashwin@gmail.com
                        </a>
                        <a href="tel:4248326039" className="flex items-center gap-3 text-gray-300 hover:text-gold-400 transition-colors group">
                            <div className="p-2 bg-white/5 rounded-full group-hover:bg-gold-500/20 transition-colors">
                                <Phone className="w-5 h-5" />
                            </div>
                            (424)-832-6039
                        </a>
                        <a href="https://www.linkedin.com/in/ashwinkumarsuresh/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-300 hover:text-gold-400 transition-colors group">
                            <div className="p-2 bg-white/5 rounded-full group-hover:bg-gold-500/20 transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </div>
                            LinkedIn Profile
                        </a>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>&copy; 2025 Ashwin Kumar Suresh. All rights reserved.</p>
                    <p>Architecting the Future of AI</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
