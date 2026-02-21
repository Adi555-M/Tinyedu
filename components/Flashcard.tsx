import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { speakText } from '../utils/speechUtils';
import { FlashcardItem } from '../types';
import { NEUMORPHIC_BASE_CLASSES, NEUMORPHIC_HOVER_CLASSES, COLORS } from '../constants';
import Button from './Button';
import { Volume2 } from 'lucide-react';

interface FlashcardProps {
  item: FlashcardItem;
}

const Flashcard: React.FC<FlashcardProps> = ({ item }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleSpeak = (text: string, isLetter = false) => {
    if (isLetter) {
      speakText(`The letter is ${text}.`);
    }
    speakText(text);
  };

  return (
    <div
      className={`relative w-[300px] h-[400px] sm:w-[400px] sm:h-[500px] md:w-[500px] md:h-[600px] perspective-1000 cursor-pointer`}
      onClick={handleFlip}
    >
      <motion.div
        className={`w-full h-full absolute ${NEUMORPHIC_BASE_CLASSES} p-4 sm:p-6 md:p-8 flex flex-col justify-between items-center backface-hidden`}
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, animationDirection: 'normal' }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front of Card */}
        <div
          className={`absolute w-full h-full flex flex-col justify-center items-center text-center p-4 sm:p-6 md:p-8 rounded-3xl
                      bg-gradient-to-br from-white via-white to-blue-50/70 backface-hidden`}
        >
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.word}
              className="w-4/5 h-auto max-h-[60%] object-contain rounded-xl shadow-inner mb-4"
              loading="lazy"
            />
          ) : (
            <div className="w-4/5 h-[60%] bg-gray-200 flex items-center justify-center rounded-xl shadow-inner mb-4 text-gray-500 text-lg">
              Loading Image...
            </div>
          )}
          <div className="text-gray-800 font-bold text-5xl sm:text-7xl md:text-8xl lg:text-9xl mb-4">
            {item.letter.toUpperCase()}
            {item.letter.toLowerCase()}
          </div>
          <Button
            onClick={(e) => {
              e.stopPropagation(); // Prevent card flip
              handleSpeak(item.letter, true);
            }}
            variant="accent"
            size="sm"
            className={`w-auto px-4 py-2 text-2xl sm:text-3xl`}
          >
            <Volume2 className="h-8 w-8 sm:h-10 sm:w-10 mr-2" />
            Hear Letter
          </Button>
        </div>

        {/* Back of Card */}
        <div
          className={`absolute w-full h-full flex flex-col justify-center items-center text-center p-4 sm:p-6 md:p-8 rounded-3xl
                      bg-gradient-to-br from-white via-white to-yellow-50/70 rotate-y-180 backface-hidden`}
        >
          <div className={`text-gray-800 font-bold text-6xl sm:text-8xl md:text-9xl lg:text-10xl mb-8 uppercase`}>
            {item.word}
          </div>
          <Button
            onClick={(e) => {
              e.stopPropagation(); // Prevent card flip
              handleSpeak(item.word);
            }}
            variant="primary"
            size="md"
            className={`w-auto px-6 py-3 text-2xl sm:text-4xl`}
          >
            <Volume2 className="h-8 w-8 sm:h-12 sm:w-12 mr-2" />
            Hear Word
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Flashcard;
