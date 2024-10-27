import { useState } from 'react';

export const useWaveAnimationActive = (initialActive: boolean = true) => {
  const [isWaveAnimationActive, setIsWaveAnimationActive] = useState(initialActive);

  // アニメーションの有効/無効を切り替える関数
  const toggleActive = () => {
    setIsWaveAnimationActive((prevActive) => !prevActive);
  };

  return { isWaveAnimationActive, setIsWaveAnimationActive, toggleActive };
}
