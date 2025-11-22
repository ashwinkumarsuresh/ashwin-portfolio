import React from 'react';
import { motion } from 'framer-motion';
import {
    Brain,
    Bot,
    Cloud,
    Database,
    BarChart,
    Server,
    Cpu,
    Users
} from 'lucide-react';

const skills = [
    {
        category: "Generative AI",
        icon: <Brain className="w-8 h-8 text-gold-400" />,
        items: ["Copilot Studio", "Amazon Bedrock", "Q Business"]
    },
    {
        category: "Agent Frameworks",
        icon: <Bot className="w-8 h-8 text-gold-400" />,
        items: ["LangChain", "ADK", "Strands"]
    },
    {
        category: "Cloud Platforms",
        icon: <Cloud className="w-8 h-8 text-gold-400" />,
        items: ["AWS", "Azure", "GCP"]
    },
    {
        category: "Machine Learning",
        icon: <Cpu className="w-8 h-8 text-gold-400" />,
        items: ["SageMaker", "Vertex AI", "Scikit-learn", "Pandas", "NumPy"]
    },
    {
        category: "Data Analytics",
        icon: <BarChart className="w-8 h-8 text-gold-400" />,
        items: ["MicroStrategy", "Tableau", "Google Analytics", "Power BI", "SSRS"]
    },
    {
        category: "Data Engineering",
        icon: <Server className="w-8 h-8 text-gold-400" />,
        items: ["Informatica Power Center", "Microsoft SSIS", "IBM DataStage"]
    },
    {
        category: "Databases",
        icon: <Database className="w-8 h-8 text-gold-400" />,
        items: ["Redshift", "BigQuery", "SQL Server", "Netezza", "Teradata", "DynamoDB"]
    },
    {
        category: "Leadership",
        icon: <Users className="w-8 h-8 text-gold-400" />,
        items: ["Team Management", "Strategic Planning", "Stakeholder Communication"]
    }
];

const CoreExpertise = () => {
    return (
        <section id="skills" className="py-20 relative">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold mb-4">Core <span className="text-gradient">Expertise</span></h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Comprehensive technical proficiency across AI, Data Engineering, and Strategic Leadership.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {skills.map((skill, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="glass p-6 rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/5 hover:border-gold-500/30 group"
                        >
                            <div className="mb-4 p-3 bg-white/5 rounded-lg w-fit group-hover:bg-gold-500/20 transition-colors">
                                {skill.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-gold-400 transition-colors">
                                {skill.category}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {skill.items.map((item, i) => (
                                    <span key={i} className="text-sm text-gray-400 bg-white/5 px-2 py-1 rounded border border-white/5">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CoreExpertise;
