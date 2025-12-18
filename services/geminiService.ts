import { GoogleGenAI } from "@google/genai";
import { HadithData } from '../types';

// NOTE: process.env.API_KEY is assumed to be available as per instructions.
// Do not modify the key access.

export const fetchDailyHadith = async (excludeReferences: string[] = []): Promise<HadithData> => {
  // Initialize client with the key from environment
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Model as requested
  const modelName = 'gemini-2.5-flash-preview-09-2025';

  // Construct exclusions string
  const exclusionNote = excludeReferences.length > 0 
    ? `\n\nCRITICAL: The user has already read Hadiths with these references: ${JSON.stringify(excludeReferences)}. \nYOU MUST PROVIDE A DIFFERENT HADITH. DO NOT REPEAT ANY OF THE ABOVE.` 
    : '';

  // Inject Randomness to prevent "Hadith #1" repetition
  // Sahih Bukhari has roughly 7000+ hadiths. We pick a random starting point.
  const randomOffset = Math.floor(Math.random() * 7000) + 1;

  const prompt = `
    Provide a single, short, authentic Hadith (Hadees) from Sahih Bukhari or Sahih Muslim.
    
    VARIETY INSTRUCTION:
    - To ensure variety, please select a Hadith roughly around number ${randomOffset} in the collection, or pick a random topic like manners, prayer, charity, patience, etc.
    - Do NOT just pick the first Hadith (Innamal A'malu Binniyat).
    ${exclusionNote}
    
    CRITICAL INSTRUCTION:
    - Provide ONLY the **URDU TRANSLATION** of the Hadith text.
    - **DO NOT** include the Arabic text.
    - The content must be in the Urdu language using the standard Urdu script.
    
    CRITICAL OUTPUT RULES:
    1. Output MUST be a valid JSON object.
    2. Do NOT use Markdown code blocks (like \`\`\`json). Just the raw JSON string.
    3. The JSON must have exactly these keys:
       - "text": The **Urdu translation** of the Hadith.
       - "reference": The source reference (e.g., "Sahih Bukhari, Hadith ${randomOffset}").
    
    Ensure the Urdu is grammatically correct and the Hadith is inspiring.
  `;

  // Retries with exponential backoff
  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      // Note: We use googleSearch grounding as requested.
      // We do NOT use responseMimeType: 'application/json' because it conflicts with googleSearch tool in some contexts,
      // and we want to robustly parse it ourselves via Regex as per instructions.
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          // responseMimeType: "application/json" // Omitted to prevent conflict with search tool
        }
      });

      const textResponse = response.text;
      if (!textResponse) throw new Error("Empty response from AI");

      // Robust Parsing with Regex
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Failed to extract JSON from response");
      }

      const jsonString = jsonMatch[0];
      const parsedData = JSON.parse(jsonString);

      // Validation
      if (!parsedData.text || !parsedData.reference) {
        throw new Error("Invalid JSON structure received");
      }

      // Extract Grounding Metadata (Source URL)
      let sourceUrl: string | undefined = undefined;
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks && chunks.length > 0) {
        // Find the first chunk with a web URI
        const webChunk = chunks.find((c: any) => c.web?.uri);
        if (webChunk) {
          sourceUrl = webChunk.web.uri;
        }
      }

      return {
        text: parsedData.text,
        reference: parsedData.reference,
        sourceUrl: sourceUrl
      };

    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed:`, error);
      attempt++;
      if (attempt >= maxRetries) {
        throw new Error("نیٹ ورک یا سرور کی خرابی، براہ کرم بعد میں دوبارہ کوشش کریں۔");
      }
      // Simple backoff wait
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
    }
  }

  throw new Error("Unexpected error");
};