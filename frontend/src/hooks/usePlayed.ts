import { useState } from "react";

export const usePlayed = (initialPlayed: number = 0) => {
  const [played, setPlayed] = useState(initialPlayed);

  return { played, setPlayed };
}
