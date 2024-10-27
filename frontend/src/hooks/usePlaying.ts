import { useState } from "react";

export const usePlaying = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return { isPlaying, setIsPlaying };
}
