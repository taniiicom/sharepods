import { useState } from 'react';
import BubbleBackground from './BubbleBackground';
import Wave from './Wave';

const WaveAnimation = () => {
  const [isBubbleActive, setIsBubbleActive] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isWaveAnimationActive, setIsWaveAnimationActive] = useState(
    true
  );

  const handleAnimationEnd = () => {
    setIsBubbleActive(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [direction, setDirection] = useState<'up' | 'down'>('up');

  return (
    <div className="relative overflow-hidden mx-auto w-full h-screen bg-white/10 shadow-custom">
      <Wave direction={direction} onAnimationEnd={handleAnimationEnd} isActive={isWaveAnimationActive}/>
      {isBubbleActive && <BubbleBackground direction={direction} />}
    </div>
  );
};

export default WaveAnimation;
