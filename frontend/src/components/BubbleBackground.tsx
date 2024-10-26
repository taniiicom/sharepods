import { useEffect, useRef } from 'react';

interface BubbleBackgroundProps {
  direction: 'up' | 'down';
}

const BubbleBackground:React.FC<BubbleBackgroundProps> = ({direction}) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let activeBubble = null;

    const createBubble = () => {
      const bubbleEl = document.createElement('span');
      bubbleEl.className = direction === 'up' ? 'bubble-up' : 'bubble-down';
      const minSize = 10;
      const maxSize = 50;
      const size = Math.random() * (maxSize - minSize) + minSize;
      bubbleEl.style.width = `${size}px`;
      bubbleEl.style.height = `${size}px`;
      bubbleEl.style.left = `${Math.random() * window.innerWidth}px`;
      section.appendChild(bubbleEl);

      setTimeout(() => {
        bubbleEl.remove();
      }, 8000);
    };

    // 泡の生成を開始
    activeBubble = setInterval(() => {
      createBubble();
    }, 300);

    // クリーンアップ関数
    return () => {
      clearInterval(activeBubble);
    };
  }, [direction]);

  return (
    <div ref={sectionRef} className="bubble-background relative w-full h-full"></div>
  );
};

export default BubbleBackground;
