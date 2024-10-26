import React, { useRef, useState } from "react";
import ReactPlayer from "react-player";

interface MusicPlayerProps {
  url: string;
  onProgressChange?: (progress: number) => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ url, onProgressChange }) => {
  const playerRef = useRef<ReactPlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    if (!seeking) {
      setPlayed(state.played);
      onProgressChange?.(state.played * 100);
    }
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setPlayed(value);
    if (playerRef.current) {
      playerRef.current.seekTo(value, "fraction");
    }
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekMouseUp = () => {
    setSeeking(false);
  };

  const handleSeek = (seconds: number) => {
    setPlayed(seconds);
    if (playerRef.current) {
      playerRef.current.seekTo(seconds, "fraction");
    }
  };

  const formatTime = (seconds: number) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, "0");
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-10">
      <div className="hidden">
        <ReactPlayer
          ref={playerRef}
          url={url}
          playing={isPlaying}
          controls={false}
          width="0"
          height="0"
          onProgress={handleProgress}
          onDuration={setDuration}
          onSeek={handleSeek}
          config={{
            youtube: {
              playerVars: { disablekb: 1 },
            },
          }}
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handlePlayPause}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <span className="text-xl">⏸</span>
          ) : (
            <span className="text-xl">▶️</span>
          )}
        </button>

        <div className="flex-1 flex items-center gap-2">
          <span className="text-sm font-medium w-12">
            {formatTime(played * duration)}
          </span>

          <div className="flex-1 relative">
            <input
              type="range"
              min={0}
              max={1}
              step="any"
              value={played}
              onMouseDown={handleSeekMouseDown}
              onChange={handleSeekChange}
              onMouseUp={handleSeekMouseUp}
              className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer"
            />
          </div>

          <span className="text-sm font-medium w-12">
            {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
