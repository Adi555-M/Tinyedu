import React, { useState, useEffect, useRef } from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import Loader from '../components/Loader';
import { generateFlashcardData, generateImage } from '../services/geminiService';
import { FlashcardItem } from '../types';
import { Sparkles, Brain, AlertCircle, Loader2 } from 'lucide-react'; // Added AlertCircle
import { COLORS, NEUMORPHIC_BASE_CLASSES } from '../constants'; // Added NEUMORPHIC_BASE_CLASSES

interface ParentModeProps {
  onGenerate: (flashcards: FlashcardItem[], topic: string) => void;
  isGenerating: boolean;
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const ParentMode: React.FC<ParentModeProps> = ({
  onGenerate,
  isGenerating,
  setIsGenerating,
  error,
  setError,
}) => {
  const [topicInput, setTopicInput] = useState<string>('');
  const [currentProgress, setCurrentProgress] = useState<number>(0);
  const totalSteps = 11; // 1 for data generation + 10 for image generation
  const progressText = [
    'Thinking of fun words...',
    'Creating amazing pictures...',
    'Almost there...',
    'Just a little bit more...',
    'Perfecting the learning adventure!',
  ];

  // Using a ref to track if component is mounted to prevent state updates on unmounted component
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleGenerateFlashcards = async () => {
    if (!topicInput.trim()) {
      setError('Please enter a topic to learn about!');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setCurrentProgress(0);

    try {
      // 1. Generate flashcard data (letters, words, image prompts)
      setCurrentProgress(1); // Indicate start of data generation
      const { flashcards: generatedData, error: dataError } = await generateFlashcardData(
        topicInput
      );

      if (dataError) {
        throw new Error(dataError);
      }

      if (generatedData.length === 0) {
        throw new Error(
          'AI could not generate any flashcards for this topic. Please try a different one.'
        );
      }

      const flashcardsWithImages: FlashcardItem[] = [];
      let step = 2; // Starting image generation from step 2

      // 2. Generate images for each flashcard
      for (const item of generatedData) {
        if (!mountedRef.current) return; // Exit if component unmounted
        setCurrentProgress(step++);
        const imageUrl = await generateImage(item.imagePrompt);
        flashcardsWithImages.push({ ...item, imageUrl: imageUrl || undefined });
      }

      if (!mountedRef.current) return; // Exit if component unmounted
      setCurrentProgress(totalSteps); // All done!

      console.log(`Flashcards with images ready: ${flashcardsWithImages.length} items.`);
      onGenerate(flashcardsWithImages, topicInput.trim());
    } catch (err: any) {
      console.error('Error in generation process:', err);
      if (mountedRef.current) {
        setError(err.message || 'An unexpected error occurred during generation.');
      }
    } finally {
      if (mountedRef.current) {
        setIsGenerating(false);
      }
    }
  };

  const currentProgressMessage = () => {
    if (currentProgress === 0) return 'Ready to start the fun!';
    if (currentProgress === 1) return progressText[0]; // Data generation
    const imageProgress = currentProgress - 1; // Images start after data generation
    const messageIndex = Math.floor((imageProgress / (totalSteps - 1)) * progressText.length);
    return progressText[Math.min(messageIndex, progressText.length - 1)];
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 md:p-16 w-full max-w-lg mx-auto bg-white bg-opacity-70 rounded-3xl shadow-neumorphic-light text-center">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-800 mb-6 flex items-center justify-center">
        <Sparkles className="h-10 w-10 sm:h-12 sm:w-12 text-yellow-500 mr-3" />
        TinySteps AI
      </h1>
      <p className="text-2xl sm:text-3xl text-gray-700 mb-8 max-w-prose">
        What amazing things should we learn about today?
      </p>

      <div className="w-full mb-8">
        <Input
          type="text"
          value={topicInput}
          onChange={(e) => setTopicInput(e.target.value)}
          placeholder="e.g., Forest animals, Fire trucks, Fruits"
          className="text-center"
          fullWidth
          disabled={isGenerating}
        />
      </div>

      {error && (
        <div className={`${NEUMORPHIC_BASE_CLASSES} bg-red-100 border-2 border-red-400 p-4 sm:p-6 mb-6 w-full flex items-center justify-center`}>
          <AlertCircle className="h-8 w-8 sm:h-10 sm:w-10 text-red-600 mr-4" />
          <p className="text-red-700 text-xl sm:text-2xl font-semibold">Oops! {error}</p>
        </div>
      )}

      {isGenerating ? (
        <div className="w-full">
          <Loader />
          <p className="mt-4 text-xl sm:text-2xl text-gray-600 font-semibold animate-pulse">
            {currentProgressMessage()} (Step {currentProgress} / {totalSteps})
          </p>
          <div className="w-full bg-gray-200 rounded-full h-4 mt-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-400 to-green-400 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(currentProgress / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>
      ) : (
        <Button
          onClick={handleGenerateFlashcards}
          fullWidth
          variant="primary"
          className="bg-blue-400 text-white flex items-center justify-center"
        >
          <Brain className="h-8 w-8 sm:h-10 sm:w-10 mr-3" />
          Generate Flashcards!
        </Button>
      )}
    </div>
  );
};

export default ParentMode;