import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Calendar } from 'lucide-react';

const experiences = [
    {
        role: "Senior Manager – AI and BI Architecture",
        company: "DineBrands Global",
        period: "Apr 2016 – Present",
        description: "Leading AI & BI architecture strategies, driving innovation through data-driven solutions.",
        type: "work"
    },
    {
        role: "BI Developer",
        company: "Peak Performance Marketing Solutions",
        period: "Aug 2015 – Apr 2016",
        description: "Developed business intelligence solutions to optimize marketing performance.",
        type: "work"
    },
    {
        role: "BI Analyst",
        company: "Systech Solutions Inc",
        period: "Jun 2014 – Aug 2015",
        description: "Analyzed data trends and implemented BI reporting tools.",
        type: "work"
    },
    {
        role: "Developer",
        company: "Systech Solutions Pvt Ltd",
        period: "Aug 2010 – Jun 2014",
        description: "Software development and data engineering foundations.",
        type: "work"
    },
    {
        role: "B.E., Electronics and Control Engineering",
        company: "Sathyabama University",
        period: "2009",
        description: "Foundation in engineering principles and control systems.",
        type: "education"
    }
];

const Experience = () => {
    return (
        <section id="experience" className="py-20 relative">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold mb-4">Professional <span className="text-gradient">Journey</span></h2>
                    <p className="text-gray-400">A timeline of growth, leadership, and technical excellence.</p>
                </motion.div>

                <div className="max-w-4xl mx-auto">
                    {experiences.map((exp, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="relative pl-8 pb-12 last:pb-0 border-l border-white/10"
                        >
                            {/* Timeline Dot */}
                            <div className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full ${index === 0 ? 'bg-gold-500 animate-pulse' : 'bg-slate-700 border border-white/20'}`}></div>

                            <div className="glass p-6 rounded-xl hover:bg-white/5 transition-all">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        {exp.type === 'education' ? <GraduationCap className="w-5 h-5 text-gold-400" /> : <Briefcase className="w-5 h-5 text-gold-400" />}
                                        {exp.role}
                                    </h3>
                                    <span className="text-sm text-gold-400/80 flex items-center gap-1 mt-1 md:mt-0">
                                        <Calendar className="w-4 h-4" />
                                        {exp.period}
                                    </span>
                                </div>
                                <h4 className="text-lg text-gray-300 mb-2">{exp.company}</h4>
                                <p className="text-gray-400 text-sm">{exp.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Experience;
