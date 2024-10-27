import { useState } from 'react';
import BubbleBackground from './BubbleBackground';
import Wave from './Wave';

interface WaveAnimationProps {
  children: React.ReactNode;
  isWaveAnimationActive: boolean;
  direction: 'up' | 'down';
}
const WaveAnimation: React.FC<WaveAnimationProps> = ({ children, isWaveAnimationActive, direction }) => {
  const [isBubbleActive, setIsBubbleActive] = useState(false);

  const handleAnimationEnd = () => {
    setIsBubbleActive(true);
  };

  return (
    <div className="overflow-hidden mx-auto w-full h-screen bg-white/10 shadow-custom ">
      {children}
      <Wave direction={direction} onAnimationEnd={handleAnimationEnd} isActive={isWaveAnimationActive} />
      {isBubbleActive && <BubbleBackground direction={direction} />}
    </div>
  );
};

export default WaveAnimation;
