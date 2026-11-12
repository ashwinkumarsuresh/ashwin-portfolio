// Site content shared by the page sections and the chat assistant, so the
// assistant answers from exactly what the page says.

export const experiences = [
    {
        role: 'Senior Manager — AI and BI Architecture',
        company: 'Dine Brands Global',
        period: '2016 — NOW',
        description:
            'Leads AI and BI architecture across Applebee’s and IHOP: the AI Innovation Foundry, recommendation engine, customer data platform, and the Teradata-to-Redshift / MicroStrategy ONE cloud transformation.',
    },
    {
        role: 'BI Developer',
        company: 'Peak Performance Marketing Solutions',
        period: '2015 — 2016',
        description: 'Business intelligence for marketing performance optimization.',
    },
    {
        role: 'BI Analyst',
        company: 'Systech Solutions Inc',
        period: '2014 — 2015',
        description: 'Data trend analysis and BI reporting tooling.',
    },
    {
        role: 'Developer',
        company: 'Systech Solutions Pvt Ltd',
        period: '2010 — 2014',
        description: 'Software development and data engineering foundations.',
    },
    {
        role: 'B.E., Electronics and Control Engineering',
        company: 'Sathyabama University',
        period: '2009',
        description: 'Engineering principles and control systems.',
    },
];

export const toolbox = [
    ['Generative AI', 'Amazon Bedrock, Q Business, Copilot Studio'],
    ['Agent frameworks', 'LangChain, ADK, Strands'],
    ['ML platforms', 'SageMaker, Vertex AI, scikit-learn'],
    ['Cloud', 'AWS, GCP, Azure'],
    ['Analytics', 'MicroStrategy, Tableau, Power BI'],
    ['Data engineering', 'Informatica, SSIS, DataStage'],
    ['Warehouses', 'Redshift, BigQuery, Teradata, SQL Server'],
];

export const selectedWork = [
    {
        num: '01',
        body: 'AI Innovation Foundry — virtual lab incubating GenAI solutions with AWS, GCP, and Microsoft Azure. Gen AI ordering and culinary assistants among the deliveries.',
        metric: '15 SHIPPED OR ENABLED · 4 STOPPED',
    },
    {
        num: '02',
        body: 'Recommendation engine across brands — architecture, rollout, measurement. Winner of the 2024 CIO 100 Award.',
        metric: '+1–2% SITE SALES',
    },
    {
        num: '03',
        body: 'Cloud transformation — on-premise DW, ETL, and BI migrated to a fully cloud ecosystem on AWS and GCP.',
        metric: '100% CLOUD',
    },
    {
        num: '04',
        body: 'Customer data platform unifying website sales, call centers, and surveys into 360-degree customer insight.',
        metric: 'UNIFIED VIEW',
    },
    {
        num: '05',
        body: 'Menu Without Borders — GenAI platform for international menu intelligence: a daily Amazon Bedrock pipeline translates and matches menu items from local languages and POS codes to domestic catalog equivalents, paired with a human-in-the-loop review app with full audit trail.',
        metric: 'THOUSANDS OF ITEMS/DAY, UNATTENDED',
    },
    {
        num: '06',
        body: 'Demand forecaster for corporate restaurants — custom models trained on SageMaker instances (not out-of-the-box), backed by SageMaker Feature Store, offline today and online-capable.',
        metric: 'STORE × CHANNEL × DAYPART',
    },
];
