import { useBubbleGenerator } from '@/hooks/useBubbleGenerator';

interface BubbleBackgroundProps {
  direction: 'up' | 'down';
}

const BubbleBackground:React.FC<BubbleBackgroundProps> = ({direction}) => {
  const sectionRef = useBubbleGenerator(direction);

  return (
    <div ref={sectionRef} className="bubble-background relative w-full h-full"></div>
  );
};

export default BubbleBackground;
