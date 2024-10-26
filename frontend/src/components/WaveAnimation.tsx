import { useState } from 'react';
import BubbleBackground from './BubbleBackground';
import Wave from './Wave';

const WaveAnimation = () => {
  const [isBubbleActive, setIsBubbleActive] = useState(false);

  const handleAnimationEnd = () => {
    setIsBubbleActive(true);
  };

  const [direction, setDirection] = useState<'up' | 'down'>('down');

  return (
    <div className="relative overflow-hidden mx-auto w-full h-screen bg-white/10 shadow-custom">
      <Wave direction={direction} onAnimationEnd={handleAnimationEnd} />
      {isBubbleActive && <BubbleBackground direction={direction} />}
    </div>
  );
};

export default WaveAnimation;
