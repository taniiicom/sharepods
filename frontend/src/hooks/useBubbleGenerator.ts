import { useEffect, useRef } from 'react';

export const useBubbleGenerator = (direction: 'up' | 'down') => {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let activeBubble: ReturnType<typeof setInterval>;

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

    // eslint-disable-next-line prefer-const
    activeBubble = setInterval(createBubble, 300);

    return () => {
      clearInterval(activeBubble);
    };
  }, [direction]);

  return sectionRef;
};
