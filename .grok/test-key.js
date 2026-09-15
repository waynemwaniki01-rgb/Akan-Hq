import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config({ path: './scripts/.env' });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ ERROR: GEMINI_API_KEY is missing from your .env file!");
  process.exit(1);
}

console.log("✅ .env loaded successfully. Testing connection to Gemini...");

const ai = new GoogleGenAI({ apiKey });

async function testGeminiConnection() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: 'Say "Connection successful!" if you can read this.',
    });

    console.log("🎉 SUCCESS! Gemini Response:", response.text);
  } catch (error) {
    console.error("❌ API Call Failed:\n", error.message);
  }
}

testGeminiConnection();