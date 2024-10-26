import { useState } from 'react';
import BubbleBackground from './BubbleBackground';

const WaveAnimation = () => {
  const [isBubbleActive, setIsBubbleActive] = useState(false);

  const handleAnimationEnd = () => {
    setIsBubbleActive(true);
  };

  return (
    <div className="relative overflow-hidden mx-auto w-full h-screen bg-white/10 shadow-custom">
      <div
        className="absolute bottom-[-150%] left-[-50%] w-[200%] h-[200%] rounded-wave bg-wave-gradient animate-wave-anime"
        onAnimationEnd={handleAnimationEnd}
      ></div>
      {isBubbleActive && <BubbleBackground />}
    </div>
  );
};

export default WaveAnimation;
