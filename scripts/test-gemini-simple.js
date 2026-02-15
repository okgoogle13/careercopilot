import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = (process.env.GEMINI_API_KEY || '').trim();
console.log('Testing API Key:', apiKey.substring(0, 5) + '...');
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

async function run() {
  try {
    const result = await model.generateContent('Hello, world!');
    console.log('Response:', result.response.text());
  } catch (error) {
    console.error('Error:', error);
  }
}
run();
