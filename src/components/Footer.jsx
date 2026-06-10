import React from 'react';
import { Mail, Phone, Linkedin } from 'lucide-react';

const Footer = () => {
    return (
        <footer id="contact" className="mt-8 border-t border-ink">
            <div className="max-w-[1080px] mx-auto px-6 py-10 md:py-12">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
                    <div>
                        <h2 className="font-display font-semibold text-2xl mb-3">Let&rsquo;s talk</h2>
                        <p className="text-[15px] text-ink/80 max-w-md leading-relaxed">
                            AI architecture, data strategy, or a question the assistant couldn&rsquo;t answer.
                        </p>
                    </div>
                    <div className="flex flex-col gap-3">
                        <a href="mailto:vinomashwin@gmail.com" className="flex items-center gap-2.5 text-[15px] hover:text-ochre transition-colors">
                            <Mail className="w-4 h-4 text-ochre" /> vinomashwin@gmail.com
                        </a>
                        <a href="tel:4248326039" className="flex items-center gap-2.5 text-[15px] hover:text-ochre transition-colors">
                            <Phone className="w-4 h-4 text-ochre" /> (424) 832-6039
                        </a>
                        <a
                            href="https://www.linkedin.com/in/ashwinkumarsuresh/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2.5 text-[15px] hover:text-ochre transition-colors"
                        >
                            <Linkedin className="w-4 h-4 text-ochre" /> LinkedIn
                        </a>
                    </div>
                </div>

                <div className="border-t border-rule-soft mt-10 pt-5 flex flex-col md:flex-row justify-between gap-2 font-mono text-[11px] text-ink-soft">
                    <span>© 2026 Ashwin Kumar Suresh</span>
                    <span>Set in Fraunces &amp; Newsreader · Built with React</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
