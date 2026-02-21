import React, { useState, useEffect } from 'react';
import Flashcard from '../components/Flashcard';
import Button from '../components/Button';
import ConfettiAnimation from '../components/ConfettiAnimation';
import { FlashcardItem } from '../types';
import { ArrowLeft, ArrowRight, Home } from 'lucide-react';
import { NEUMORPHIC_BASE_CLASSES } from '../constants';

interface FlashcardPlayerProps {
  flashcards: FlashcardItem[];
  topic: string;
  onReset: () => void;
}

const FlashcardPlayer: React.FC<FlashcardPlayerProps> = ({ flashcards, topic, onReset }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Check if it's the last card and trigger confetti
    if (currentIndex === flashcards.length && flashcards.length > 0) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000); // Confetti for 5 seconds
      return () => clearTimeout(timer);
    }
  }, [currentIndex, flashcards.length]);

  const goToNextCard = () => {
    if (currentIndex < flashcards.length) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const goToPreviousCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const isLastCard = currentIndex === flashcards.length - 1;
  const isAfterLastCard = currentIndex === flashcards.length; // For the "finished" screen

  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-screen p-4">
      {showConfetti && <ConfettiAnimation />}

      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 mb-6 text-center">
        Learning about <span className="text-blue-600">{topic}</span>!
      </h2>

      {isAfterLastCard ? (
        <div className={`flex flex-col items-center justify-center p-8 sm:p-12 md:p-16 ${NEUMORPHIC_BASE_CLASSES} text-center`}>
          <h3 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-green-600 mb-6">
            Hooray! You finished all the cards!
          </h3>
          <p className="text-2xl sm:text-3xl text-gray-700 mb-8">
            Great job learning about {topic}!
          </p>
          <Button onClick={onReset} variant="primary" size="lg" className="flex items-center justify-center">
            <Home className="h-8 w-8 sm:h-10 sm:w-10 mr-3" />
            Go Home
          </Button>
        </div>
      ) : (
        <>
          <p className="text-xl sm:text-2xl text-gray-600 mb-4">
            Card {currentIndex + 1} of {flashcards.length}
          </p>
          <Flashcard item={flashcards[currentIndex]} />

          <div className="mt-8 flex flex-row space-x-4 sm:space-x-6 md:space-x-8 w-full max-w-lg justify-center sticky bottom-4 z-10">
            <Button
              onClick={goToPreviousCard}
              disabled={currentIndex === 0}
              variant="secondary"
              size="md"
              className="flex-1 min-w-[120px] max-w-[200px] flex items-center justify-center"
            >
              <ArrowLeft className="h-8 w-8 sm:h-10 sm:w-10" />
              <span className="ml-2 hidden sm:inline">Previous</span>
            </Button>
            <Button
              onClick={goToNextCard}
              variant="primary"
              size="md"
              className="flex-1 min-w-[120px] max-w-[200px] flex items-center justify-center"
            >
              <span className="mr-2 hidden sm:inline">{isLastCard ? 'Finish' : 'Next'}</span>
              <ArrowRight className="h-8 w-8 sm:h-10 sm:w-10" />
            </Button>
          </div>

          <div className="fixed top-4 right-4 z-20">
            <Button onClick={onReset} variant="accent" size="sm" className="flex items-center">
                <Home className="h-6 w-6 mr-2" />
                Home
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default FlashcardPlayer;
