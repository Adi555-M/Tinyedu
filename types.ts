export interface FlashcardItem {
  letter: string;
  word: string;
  imagePrompt: string;
  imageUrl?: string; // Optional: will be populated after image generation
}

export interface GeminiFlashcardResponse {
  letter: string;
  word: string;
  imagePrompt: string;
}

export interface ImagePart {
  inlineData: {
    data: string; // base64 encoded string
    mimeType: string;
  };
}

export interface TextPart {
  text: string;
}

export type ContentPart = ImagePart | TextPart;
