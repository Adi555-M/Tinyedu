import React, { useState } from 'react';
import ParentMode from './pages/ParentMode';
import FlashcardPlayer from './pages/FlashcardPlayer';
import { FlashcardItem } from './types';
import { APP_FONT_CLASS } from './constants';

const App: React.FC = () => {
  const [flashcards, setFlashcards] = useState<FlashcardItem[]>([]);
  const [topic, setTopic] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const startFlashcardSession = (
    generatedCards: FlashcardItem[],
    selectedTopic: string
  ) => {
    setFlashcards(generatedCards);
    setTopic(selectedTopic);
    setError(null);
  };

  const resetApp = () => {
    setFlashcards([]);
    setTopic('');
    setIsGenerating(false);
    setError(null);
  };

  return (
    <div className={`flex flex-col items-center justify-center w-full min-h-screen p-4 sm:p-8 md:p-12 ${APP_FONT_CLASS}`}>
      {flashcards.length === 0 ? (
        <ParentMode
          onGenerate={startFlashcardSession}
          isGenerating={isGenerating}
          setIsGenerating={setIsGenerating}
          error={error}
          setError={setError}
        />
      ) : (
        <FlashcardPlayer flashcards={flashcards} topic={topic} onReset={resetApp} />
      )}
    </div>
  );
};

export default App;