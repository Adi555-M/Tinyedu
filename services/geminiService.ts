import { GoogleGenAI, GenerateContentResponse, Type } from '@google/genai';
import { AI_MODEL_NAME, AI_SYSTEM_INSTRUCTION, AI_PROMPT_TEMPLATE } from '../constants';
import { FlashcardItem, GeminiFlashcardResponse, ContentPart, ImagePart } from '../types';

interface GenerateFlashcardsResult {
  flashcards: FlashcardItem[];
  error: string | null;
}

// Function to decode audio data (copied from guidance)
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Calls the Gemini API to generate a list of flashcard items based on a topic.
 * @param topic The topic for the flashcards.
 * @returns A promise that resolves to an array of FlashcardItem.
 */
export const generateFlashcardData = async (topic: string): Promise<GenerateFlashcardsResult> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = AI_PROMPT_TEMPLATE(topic);

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: AI_MODEL_NAME,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        systemInstruction: AI_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              letter: { type: Type.STRING },
              word: { type: Type.STRING },
              imagePrompt: { type: Type.STRING },
            },
            required: ['letter', 'word', 'imagePrompt'],
          },
        },
      },
    });

    const jsonStr = response.text?.trim();

    if (!jsonStr) {
      console.error('Gemini API returned an empty or null response text.');
      return { flashcards: [], error: 'AI did not return a valid JSON response.' };
    }

    let parsedResponse: GeminiFlashcardResponse[];
    try {
      parsedResponse = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Error parsing AI response JSON:', parseError, jsonStr);
      return { flashcards: [], error: 'AI returned malformed JSON. Please try again.' };
    }


    if (!Array.isArray(parsedResponse) || parsedResponse.length === 0) {
      console.warn('AI returned an empty or invalid flashcard list for topic:', topic, parsedResponse);
      return { flashcards: [], error: 'AI returned an empty or invalid flashcard list.' };
    }

    const flashcards: FlashcardItem[] = parsedResponse.map((item) => ({
      letter: item.letter,
      word: item.word,
      imagePrompt: item.imagePrompt,
    }));

    console.log(`Flashcard data generated from AI: ${flashcards.length} items for topic "${topic}".`);
    return { flashcards, error: null };
  } catch (err: any) {
    console.error('Error generating flashcard data:', err);
    return {
      flashcards: [],
      error: `Failed to generate flashcard data. Please try again. (Details: ${err.message || 'Unknown error'})`,
    };
  }
};

/**
 * Generates an image for a given image prompt using Gemini's image generation capabilities.
 * @param imagePrompt The prompt for the image.
 * @returns A promise that resolves to the base64 encoded image URL or null on failure.
 */
export const generateImage = async (imagePrompt: string): Promise<string | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    // Use gemini-3-pro-image-preview for higher quality images as requested by the prompt for "high-quality 3D claymation style image"
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: imagePrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: '1:1', // Square images work well for flashcards
          imageSize: '1K',    // 1K resolution as a good balance
        },
      },
    });

    // Iterate through parts to find the image part
    const imagePart = response.candidates?.[0]?.content?.parts?.find(
      (part) => (part as ImagePart).inlineData?.data
    ) as ImagePart | undefined;

    if (imagePart?.inlineData?.data) {
      const base64EncodeString: string = imagePart.inlineData.data;
      return `data:${imagePart.inlineData.mimeType};base64,${base64EncodeString}`;
    } else {
      console.warn('No image data found in Gemini response for prompt:', imagePrompt);
      return null;
    }
  } catch (err: any) {
    console.error('Error generating image for prompt:', imagePrompt, err);
    return null;
  }
};