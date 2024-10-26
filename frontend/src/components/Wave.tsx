interface WaveProps {
  direction: 'up' | 'down';
  onAnimationEnd: () => void;
}

const Wave: React.FC<WaveProps> = ({ direction, onAnimationEnd }) => {
  const waveAnimationClass =
    direction === 'up' ? 'animate-wave-up' : 'animate-wave-down';

  return (
    <div
      className={`absolute bottom-[-150%] left-[-50%] w-[200%] h-[200%] rounded-wave bg-wave-gradient ${waveAnimationClass}`}
      onAnimationEnd={onAnimationEnd}
    ></div>
  );
};

export default Wave;
