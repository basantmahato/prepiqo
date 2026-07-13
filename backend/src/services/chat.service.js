import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PromptTemplate } from '@langchain/core/prompts';

const llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    maxOutputTokens: 8192,
});

export const generateChatService = async (promptText) => {
    const promptTemplate = new PromptTemplate({
        template: `You are an expert AI Assistant named Prepiqo. Respond helpfully, accurately, and concisely to the following user prompt.

User Prompt: {promptText}

CRITICAL INSTRUCTIONS:
1. Provide the output STRICTLY as Markdown.
2. Use appropriate formatting (bolding, lists, code blocks) to make your response easy to read.
3. Be direct and conversational but professional.
`,
        inputVariables: ["promptText"],
    });

    const prompt = await promptTemplate.format({
        promptText: promptText,
    });

    const response = await llm.invoke(prompt);
    return response.content;
};
