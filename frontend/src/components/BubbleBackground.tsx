import { useBubbleGenerator } from '@/hooks/useBubbleGenerator';

interface BubbleBackgroundProps {
  direction: 'up' | 'down';
}

const BubbleBackground:React.FC<BubbleBackgroundProps> = ({direction}) => {
  const sectionRef = useBubbleGenerator(direction);

  return (
    <div ref={sectionRef} className="bubble-background w-full z-5"></div>
  );
};

export default BubbleBackground;
