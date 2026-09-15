import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config({ path: './scripts/.env' });

const app = express();
app.use(express.json());

// CORS Configuration
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Dynamic CSS Aesthetics Generation Endpoint
app.post('/api/generate-card-prompt', async (req, res) => {
  try {
    const { theme = 'storm' } = req.body;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate custom card aesthetic styling parameters for this concept: "${theme}".`,
      config: {
        systemInstruction: `You are an expert UI designer. Return ONLY a valid JSON object matching this schema without markdown block formatting:
{
  "background": "CSS background string (e.g. linear-gradient(...))",
  "accentColor": "HEX or RGBA color string",
  "glowColor": "RGBA color string with opacity",
  "gridColor": "RGBA color string for grid patterns",
  "textColor": "HEX color string",
  "borderStyle": "CSS border specification (e.g. '1px solid rgba(...)')"
}`,
        responseMimeType: 'application/json'
      }
    });

    const cardStyles = JSON.parse(response.text);
    return res.json({ success: true, styles: cardStyles });
  } catch (error) {
    console.error('Error generating card styles:', error);
    return res.status(500).json({
      success: false,
      styles: {
        background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
        accentColor: '#3b82f6',
        glowColor: 'rgba(59, 130, 246, 0.5)',
        gridColor: 'rgba(255, 255, 255, 0.1)',
        textColor: '#ffffff',
        borderStyle: '1px solid rgba(255, 255, 255, 0.2)'
      }
    });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));