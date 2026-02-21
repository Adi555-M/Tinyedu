export const COLORS = {
  YELLOW: '#FFD700',
  BLUE: '#87CEEB',
  GREEN: '#90EE90',
  NEUMORPHIC_LIGHT: '#FFFFFF',
  NEUMORPHIC_DARK: '#D1D9E6',
};

export const APP_FONT_CLASS = 'font-comic-neue'; // Referenced in index.html for global font
export const NEUMORPHIC_BASE_CLASSES =
  'bg-white bg-opacity-70 rounded-3xl shadow-neumorphic-light relative';
export const NEUMORPHIC_PRESSED_CLASSES = 'shadow-neumorphic-inset';
export const NEUMORPHIC_HOVER_CLASSES = 'hover:shadow-neumorphic-hover';

export const AI_MODEL_NAME = 'gemini-flash-latest';
export const AI_GENERATION_COUNT = 10;
export const AI_SYSTEM_INSTRUCTION = `You are a helpful and creative assistant specializing in early childhood education. Your goal is to generate simple, toddler-safe educational content. Ensure all words are suitable for children under 5 years old. Avoid complex, abstract, or potentially scary concepts.`;

// Prompt template used to interact with Gemini
export const AI_PROMPT_TEMPLATE = (topic: string) => `
Generate exactly ${AI_GENERATION_COUNT} unique educational items related to "${topic}".
Each item should consist of:
1. A single uppercase letter (A-Z).
2. A single, simple, toddler-safe word that starts with that letter and is related to the topic.
3. An image prompt to generate a high-quality 3D claymation style image of the word on a plain white background.

Ensure variety in the letters and words chosen. Do not repeat letters if possible.
The output MUST be a JSON array of objects, each with the following structure:
[
  {
    "letter": "A",
    "word": "Apple",
    "imagePrompt": "A high-quality 3D claymation style image of a red apple on a plain white background."
  },
  {
    "letter": "B",
    "word": "Ball",
    "imagePrompt": "A high-quality 3D claymation style image of a colorful ball on a plain white background."
  }
  // ... up to 10 items
]
`;
