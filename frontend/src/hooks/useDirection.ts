import { useState } from 'react';

type Direction = 'up' | 'down';

export const useDirection = (initialDirection: Direction = 'down') => {
  const [direction, setDirection] = useState<Direction>(initialDirection);

  // 方向を切り替える関数
  const toggleDirection = () => {
    setDirection((prevDirection) => (prevDirection === 'down' ? 'up' : 'down'));
  };

  return { direction, setDirection, toggleDirection };
};
