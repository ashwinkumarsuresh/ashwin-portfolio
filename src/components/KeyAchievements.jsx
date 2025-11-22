import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, CloudLightning, DatabaseZap } from 'lucide-react';

const achievements = [
    {
        title: "AI Foundry",
        metric: "Innovation Hub",
        description: "Spearheaded the establishment of AI Foundry to accelerate innovation; delivered multiple POCs and production-ready Gen AI projects including Data AI Ordering Assistant and Culinary Assistant.",
        icon: <Trophy className="w-10 h-10 text-gold-400" />
    },
    {
        title: "Recommendation Engine",
        metric: "10x ROI",
        description: "Developed across brands, boosting website sales by 1-2%. Winner of 2024 CIO 100 Award for driving significant business value through personalized customer experiences.",
        icon: <TrendingUp className="w-10 h-10 text-gold-400" />
    },
    {
        title: "Cloud Transformation",
        metric: "100% Cloud",
        description: "Transformed on-premise infrastructure to a 100% cloud ecosystem (AWS/GCP), successfully migrating DW, ETL, and BI systems to modern scalable architectures.",
        icon: <CloudLightning className="w-10 h-10 text-gold-400" />
    },
    {
        title: "Customer Data Platform",
        metric: "Unified View",
        description: "Architected a unified CDP collecting data from website sales, call centers, and surveys to enhance data-driven decision-making and 360-degree customer insights.",
        icon: <DatabaseZap className="w-10 h-10 text-gold-400" />
    }
];

const KeyAchievements = () => {
    return (
        <section id="projects" className="py-20 relative bg-slate-900/50">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold mb-4">Key <span className="text-gradient">Achievements</span></h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Delivering measurable business impact through technological innovation.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                    {achievements.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="glass p-8 rounded-2xl border-l-4 border-l-gold-500 hover:bg-white/5 transition-all group"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-gold-400 transition-colors">
                                        {item.title}
                                    </h3>
                                    <span className="text-gold-400 font-mono text-sm border border-gold-500/30 px-3 py-1 rounded-full bg-gold-500/10">
                                        {item.metric}
                                    </span>
                                </div>
                                <div className="p-3 bg-white/5 rounded-xl group-hover:scale-110 transition-transform">
                                    {item.icon}
                                </div>
                            </div>
                            <p className="text-gray-300 leading-relaxed">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default KeyAchievements;
