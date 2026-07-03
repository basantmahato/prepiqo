import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PromptTemplate } from '@langchain/core/prompts';

const llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    maxOutputTokens: 8192,
});

export const generateMCQsService = async (topic, numQuestions, difficulty) => {
    const promptTemplate = new PromptTemplate({
        template: `You are an expert educator. Generate {numQuestions} multiple-choice questions (MCQs) about the topic: "{topic}".
        
The difficulty level of these questions MUST be: {difficulty}.
        
CRITICAL INSTRUCTIONS FOR JSON OUTPUT:
1. Return the output STRICTLY as a valid JSON array of objects. 
2. Do NOT wrap the JSON in markdown code blocks (e.g., no \`\`\`json).
3. Ensure ALL inner double quotes inside strings are properly escaped (e.g., use \\" instead of ").
4. Ensure there are no raw line breaks or unescaped characters inside the string values.

Each object must exactly match this structure:
[
  {{
    "question": "The question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "The exact text of the correct option",
    "explanation": "A short explanation of why the answer is correct"
  }}
]
`,
        inputVariables: ["topic", "numQuestions", "difficulty"],
    });

    const prompt = await promptTemplate.format({
        topic: topic,
        numQuestions: numQuestions,
        difficulty: difficulty
    });

    const response = await llm.invoke(prompt);
    
    const text = response.content;
    const startIndex = text.indexOf('[');
    const endIndex = text.lastIndexOf(']');
    
    if (startIndex === -1 || endIndex === -1) {
        console.error("--- RAW LLM RESPONSE ---");
        console.error(text);
        console.error("------------------------");
        throw new Error("No JSON array found in response");
    }
    
    const jsonStr = text.substring(startIndex, endIndex + 1);
    return JSON.parse(jsonStr);
};
