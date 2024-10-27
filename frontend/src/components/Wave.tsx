interface WaveProps {
  direction: 'up' | 'down';
  onAnimationEnd: () => void;
  isActive: boolean;
}

const Wave: React.FC<WaveProps> = ({ direction, onAnimationEnd, isActive }) => {
  const waveAnimationClass = isActive
    ? direction === 'up'
      ? 'animate-wave-up'
      : 'animate-wave-down'
    : '';

  return (
    <div
    className={` bottom-[-200%] w-[400%] h-[400%] rounded-wave bg-wave-gradient ${waveAnimationClass} z-0`}
      onAnimationEnd={onAnimationEnd}
    ></div>
  );
};

export default Wave;
