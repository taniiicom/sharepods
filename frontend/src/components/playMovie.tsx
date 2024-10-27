import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";

interface MusicPlayerProps {
  url: string; // 再生する音楽/動画のURL
  onProgressChange?: (progress: number) => void; // 進捗変更時のコールバック（0-100の値）
  wsCurrentSeekTime: number;
  wsIsPlaying: boolean;
  sendWsMessage: (message: { isPlay?: boolean }) => void;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  // 現在の再生時間（秒）を制御するための新しいプロップス
  currentTimeSeconds?: number;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  url,
  onProgressChange,
  wsCurrentSeekTime,
  wsIsPlaying,
  sendWsMessage,
  // ReactPlayerのインスタンスを参照するためのref
  isPlaying,
  setIsPlaying,
  currentTimeSeconds,
}) => {
  const playerRef = useRef<ReactPlayer | null>(null);
  //   const [isPlaying, setIsPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);

  // 前回のcurrentTimeSecondsを保持するref
  const prevTimeRef = useRef<number | undefined>(undefined);

  const prevStateRef = useRef({
    isPlaying: false,
    played: 0,
    seeking: false,
  });

  useEffect(() => {
    handleSeek(wsCurrentSeekTime);
    setPlayed(wsCurrentSeekTime / duration);
  }, [wsCurrentSeekTime, duration]);
  useEffect(() => {
    if (wsIsPlaying) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }, [wsIsPlaying, setIsPlaying]);

  // 再生状態が変化したかどうかをチェックする関数
  // currentTimeSecondsが変更されたときに再生位置を更新
  useEffect(() => {
    if (
      currentTimeSeconds !== undefined &&
      currentTimeSeconds !== prevTimeRef.current &&
      duration > 0 &&
      !seeking
    ) {
      const newPlayed = Math.min(currentTimeSeconds / duration, 1);
      setPlayed(newPlayed);
      if (playerRef.current) {
        playerRef.current.seekTo(newPlayed, "fraction");
      }
      prevTimeRef.current = currentTimeSeconds;
    }
  }, [currentTimeSeconds, duration, seeking]);

  const hasStateChanged = (currentPlayed: number) => {
    const prevState = prevStateRef.current;
    const playStateChanged = prevState.isPlaying !== isPlaying;
    const seekingCompleted = prevState.seeking && !seeking;

    prevStateRef.current = {
      isPlaying,
      played: currentPlayed,
      seeking,
    };

    return playStateChanged || seekingCompleted;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    sendWsMessage({ isPlay: !isPlaying });
  };

  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    if (!seeking) {
      setPlayed(state.played);

      if (hasStateChanged(state.played)) {
        onProgressChange?.(state.played * 100);
      }
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
    onProgressChange?.(played * 100);
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
              playerVars: {
                disablekb: 1,
                enablejsapi: 1,
                origin: window.location.origin,
                host: "https://www.youtube-nocookie.com",
                modestbranding: 1,
                rel: 0,
                showinfo: 0,
                iv_load_policy: 3,
              },
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
