import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function run() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GOOGLE_API_KEY}`);
        const data = await response.json();
        const models = data.models.map(m => m.name);
        console.log("Available models:", models.filter(m => m.includes('gemini')));
    } catch(e) {
        console.error(e);
    }
}
run();
