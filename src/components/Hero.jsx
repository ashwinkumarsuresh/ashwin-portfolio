import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
    return (
        <section id="about" className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/assets/hero-bg.jpg"
                    alt="Background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900/70"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center pt-20 md:pt-0">
                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center md:text-left order-2 md:order-1"
                >
                    <h2 className="text-gold-400 font-medium mb-4 tracking-wider text-sm md:text-base">SENIOR MANAGER – AI & BI ARCHITECTURE</h2>
                    <h1 className="text-4xl md:text-7xl font-bold mb-6 text-white">
                        Ashwin Kumar <span className="text-gradient">Suresh</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed">
                        15+ Years Driving Business Value through Data & Innovation.
                        <br />
                        <span className="text-gold-400">Architecting the Future of AI</span>
                    </p>

                    <div className="flex gap-4 justify-center md:justify-start">
                        <a href="#projects" className="px-6 md:px-8 py-3 bg-gold-500 text-slate-900 font-bold rounded-full hover:bg-gold-400 transition-all transform hover:scale-105 text-sm md:text-base">
                            View Work
                        </a>
                        <a href="#contact" className="px-6 md:px-8 py-3 border border-white/20 text-white rounded-full hover:bg-white/10 transition-all text-sm md:text-base">
                            Contact Me
                        </a>
                    </div>
                </motion.div>

                {/* 3D Element */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="relative order-1 md:order-2"
                >
                    <motion.img
                        src="/assets/3d.jpg"
                        alt="AI Architecture"
                        className="w-full max-w-[280px] md:max-w-lg mx-auto drop-shadow-2xl"
                        animate={{ y: [0, -15, 0] }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />

                    {/* Floating Particles/Glow Effect */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-gold-500/20 rounded-full blur-[80px] md:blur-[100px] -z-10"></div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
