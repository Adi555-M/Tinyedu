import React, { useEffect, useState } from 'react';

const ConfettiAnimation: React.FC = () => {
  const [confettiVisible, setConfettiVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setConfettiVisible(false);
    }, 5000); // Confetti visible for 5 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!confettiVisible) {
    return null;
  }

  const confettiColors = ['#FFD700', '#87CEEB', '#90EE90', '#FF69B4', '#FFA500']; // Sunny Yellow, Sky Blue, Grass Green, Hot Pink, Orange

  const generateConfetti = (count: number) => {
    const confettiElements = [];
    for (let i = 0; i < count; i++) {
      const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      const size = Math.random() * 15 + 10; // 10-25px
      const delay = Math.random() * 3; // 0-3s delay
      const duration = Math.random() * 3 + 2; // 2-5s duration
      const left = Math.random() * 100; // 0-100% left
      const transformX = Math.random() * 200 - 100; // -100 to 100vw horizontal spread
      const rotate = Math.random() * 360; // 0-360deg rotation

      confettiElements.push(
        <div
          key={i}
          className="absolute z-50 rounded-full opacity-0 confetti-piece"
          style={{
            backgroundColor: color,
            width: `${size}px`,
            height: `${size}px`,
            left: `${left}%`,
            top: `-20px`, // Start above screen
            animation: `fall ${duration}s ease-out ${delay}s forwards,
                        sway ${Math.random() * 2 + 1}s ease-in-out ${delay}s infinite alternate`,
            transform: `translateX(${transformX}vw) rotate(${rotate}deg)`,
          }}
        ></div>
      );
    }
    return confettiElements;
  };

  return (
    <>
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(0vh) translateX(var(--transformX, 0vw)) rotate(var(--rotate, 0deg));
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          100% {
            transform: translateY(120vh) translateX(var(--transformX, 0vw)) rotate(var(--rotate, 0deg));
            opacity: 0;
          }
        }
        @keyframes sway {
            0% { transform: translateX(-50%) rotate(0deg); }
            100% { transform: translateX(50%) rotate(360deg); }
        }
        .confetti-piece {
            --transformX: 0vw;
            --rotate: 0deg;
        }
      `}</style>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {generateConfetti(100)} {/* Generate 100 confetti pieces */}
      </div>
    </>
  );
};

export default ConfettiAnimation;
