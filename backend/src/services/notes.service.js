import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PromptTemplate } from '@langchain/core/prompts';

const llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    maxOutputTokens: 8192,
});

export const generateNotesService = async (topic) => {
    const promptTemplate = new PromptTemplate({
        template: `You are an expert educator and study assistant. Generate highly detailed, well-structured study notes about the topic: "{topic}".
        
CRITICAL INSTRUCTIONS:
1. Provide the output STRICTLY as Markdown.
2. Use appropriate headings (#, ##, ###), bullet points, bold text for emphasis, and code blocks if applicable.
3. Include a short "Summary" section at the top.
4. Include a "Key Concepts" or "Key Terminology" section if appropriate.
5. Ensure the notes are educational, accurate, and easy to read.
`,
        inputVariables: ["topic"],
    });

    const prompt = await promptTemplate.format({
        topic: topic,
    });

    const response = await llm.invoke(prompt);
    return response.content;
};
