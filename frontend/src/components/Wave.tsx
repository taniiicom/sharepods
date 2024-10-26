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
      className={`absolute bottom-[-200%] left-[-50%] w-[250%] h-[200%] rounded-wave bg-wave-gradient ${waveAnimationClass}`}
      onAnimationEnd={onAnimationEnd}
    ></div>
  );
};

export default Wave;
