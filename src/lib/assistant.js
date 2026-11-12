import { getAI, getGenerativeModel, AgentPlatformBackend } from 'firebase/ai';
import { getFirebaseApp } from './firebase';
import { experiences, toolbox, selectedWork } from '../data/profile';

// The chat assistant: Gemini through Firebase AI Logic on the Agent Platform
// (formerly Vertex AI) backend, called straight from the browser. Firebase
// handles auth and quota for the project, and App Check keeps other clients out.
// It answers only from the site's own content below.
export const MODEL = 'gemini-3.5-flash-lite';
const MAX_HISTORY_MESSAGES = 20;

export function buildSystemInstruction() {
    const roles = experiences
        .map((e) => `- ${e.period}: ${e.role}, ${e.company}. ${e.description}`)
        .join('\n');
    const work = selectedWork.map((w) => `- ${w.body} (${w.metric})`).join('\n');
    const tools = toolbox.map(([label, items]) => `- ${label}: ${items}`).join('\n');
    return `You are the AI assistant on Ashwin Kumar Suresh's portfolio site. Visitors are mostly recruiters, hiring managers and engineers.

Answer questions about Ashwin's experience, projects and skills using ONLY the facts below. If the answer isn't there, say you don't know and suggest the Contact section at the bottom of the page. Never invent employers, dates, numbers or credentials. Keep answers short (a few sentences or a brief list), friendly and in the third person. Politely decline requests unrelated to Ashwin's work.

Summary: Senior Manager, AI and BI Architecture, with 16 years in data. Enterprise data architect turned AI builder. Led the data platform behind a 2024 CIO 100 Award and engineered a recommendation engine driving a 1-2% site-wide sales lift. Now shipping production GenAI applications, including Menu Without Borders, an automated pipeline processing thousands of international menu items a day.

Experience:
${roles}

Selected work:
${work}

Toolbox:
${tools}

About this assistant: it runs on Gemini through Firebase AI Logic, called directly from the site and protected by Firebase App Check.`;
}

// Chat UI messages -> Gemini history. Drops the canned welcome and error
// bubbles, keeps the most recent turns, and starts on a user turn as the API requires.
export function toChatHistory(messages) {
    const turns = messages
        .filter((m) => !m.isError && !m.isWelcome && m.text)
        .slice(-MAX_HISTORY_MESSAGES)
        .map((m) => ({ role: m.sender === 'user' ? 'user' : 'model', parts: [{ text: m.text }] }));
    const firstUser = turns.findIndex((t) => t.role === 'user');
    return firstUser === -1 ? [] : turns.slice(firstUser);
}

let modelPromise;

async function getModel() {
    if (!modelPromise) {
        modelPromise = getFirebaseApp()
            .then((app) => {
                const ai = getAI(app, {
                    backend: new AgentPlatformBackend(),
                    useLimitedUseAppCheckTokens: true,
                });
                return getGenerativeModel(ai, {
                    model: MODEL,
                    systemInstruction: buildSystemInstruction(),
                    generationConfig: { temperature: 0.4, maxOutputTokens: 800 },
                });
            })
            .catch((err) => {
                modelPromise = undefined;
                throw err;
            });
    }
    return modelPromise;
}

// Sends one visitor message with the prior conversation; resolves to the reply text.
export async function askAssistant(priorMessages, text) {
    const model = await getModel();
    const chat = model.startChat({ history: toChatHistory(priorMessages) });
    const result = await chat.sendMessage(text);
    return result.response.text();
}
