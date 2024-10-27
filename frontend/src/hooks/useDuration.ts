import { useState } from "react";

export const useDuration = (initialDuration: number = 0) => {
  const [duration, setDuration] = useState(initialDuration);

  return { duration, setDuration };
}
