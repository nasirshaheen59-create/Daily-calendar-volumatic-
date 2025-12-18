import { GoogleGenAI } from "@google/genai";
import { HadithData } from '../types';

export const fetchDailyHadith = async (excludeReferences: string[] = []): Promise<HadithData> => {
  // Use a fresh instance for every call to ensure latest API key context
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelName = 'gemini-2.5-flash-preview-09-2025';

  // Even stronger randomization logic
  const collections = ['Sahih Bukhari', 'Sahih Muslim', 'Sunan Abi Dawud', 'Sunan al-Tirmidhi'];
  const topics = ['اخلاق', 'نماز', 'صدقہ', 'صبر', 'علم', 'جنت', 'محبت', 'سچائی', 'والدین', 'پڑوسی'];
  
  const randomCollection = collections[Math.floor(Math.random() * collections.length)];
  const randomTopic = topics[Math.floor(Math.random() * topics.length)];
  const randomSeed = Math.floor(Math.random() * 99999);

  const exclusionNote = excludeReferences.length > 0 
    ? `\n\nPreviously seen (DO NOT REPEAT): ${JSON.stringify(excludeReferences)}` 
    : '';

  const prompt = `
    Select one unique, authentic, and inspiring Hadith (Hadees) from "${randomCollection}" specifically about "${randomTopic}".
    
    RANDOM SEED: ${randomSeed}
    ${exclusionNote}
    
    RULES:
    - Never start with Hadith #1. Pick a random number between 100 and 5000 from the collection.
    - Provide ONLY the URDU TRANSLATION.
    - DO NOT include Arabic text.
    - Provide a short, easy-to-read translation for a daily calendar.
    
    OUTPUT FORMAT (Raw JSON):
    {
      "text": "Urdu translation text here...",
      "reference": "${randomCollection}, Hadith #...",
      "topic": "${randomTopic}"
    }
  `;

  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          // We let the model output text and parse it to ensure maximum compatibility with the search tool
        }
      });

      const textResponse = response.text || "";
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) throw new Error("Invalid response format");
      
      const parsedData = JSON.parse(jsonMatch[0]);

      if (!parsedData.text || !parsedData.reference) throw new Error("Incomplete data");

      let sourceUrl: string | undefined = undefined;
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        const webChunk = chunks.find((c: any) => c.web?.uri);
        if (webChunk) sourceUrl = webChunk.web.uri;
      }

      return {
        text: parsedData.text,
        reference: parsedData.reference,
        sourceUrl: sourceUrl
      };

    } catch (error) {
      console.error(`Fetch attempt ${attempt + 1} failed:`, error);
      attempt++;
      if (attempt >= maxRetries) throw new Error("حدیث حاصل کرنے میں دشواری ہو رہی ہے۔ براہ کرم انٹرنیٹ کنکشن چیک کریں۔");
      await new Promise(r => setTimeout(r, 1000 * attempt));
    }
  }

  throw new Error("Unknown error occurred");
};