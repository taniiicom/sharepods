import React, { useRef, useState } from "react";
import ReactPlayer from "react-player";

// コンポーネントのプロップス型定義
interface MusicPlayerProps {
  url: string; // 再生する音楽/動画のURL
  onProgressChange?: (progress: number) => void; // 進捗変更時のコールバック（0-100の値）
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ url, onProgressChange }) => {
  // ReactPlayerのインスタンスを参照するためのref
  const playerRef = useRef<ReactPlayer | null>(null);

  // 再生状態を管理するstate
  const [isPlaying, setIsPlaying] = useState(false); // 再生中かどうか
  const [played, setPlayed] = useState(0); // 再生位置（0-1の値）
  const [duration, setDuration] = useState(0); // 動画の総再生時間（秒）
  const [seeking, setSeeking] = useState(false); // シークバー操作中かどうか

  // 前回の状態を保持するためのref
  // refを使用することで、値の更新時に再レンダリングが発生しない
  const prevStateRef = useRef({
    isPlaying: false,
    played: 0,
    seeking: false,
  });

  // 再生状態が変化したかどうかをチェックする関数
  const hasStateChanged = (currentPlayed: number) => {
    const prevState = prevStateRef.current;

    // 再生状態の変化をチェック（再生開始/停止）
    const playStateChanged = prevState.isPlaying !== isPlaying;

    // シーク操作の完了をチェック（シーク操作終了時）
    const seekingCompleted = prevState.seeking && !seeking;

    // 前回の状態を更新
    prevStateRef.current = {
      isPlaying,
      played: currentPlayed,
      seeking,
    };

    return playStateChanged || seekingCompleted;
  };

  // 再生/一時停止ボタンのクリックハンドラ
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // 再生進捗の更新ハンドラ（ReactPlayerから定期的に呼び出される）
  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    if (!seeking) {
      // シーク中でない場合のみ更新
      setPlayed(state.played);

      // 重要な状態変化時のみonProgressChangeを呼び出す
      if (hasStateChanged(state.played)) {
        onProgressChange?.(state.played * 100);
      }
    }
  };

  // シークバーの値変更ハンドラ
  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setPlayed(value);
    if (playerRef.current) {
      playerRef.current.seekTo(value, "fraction"); // 再生位置を更新
    }
  };

  // シークバーのドラッグ開始ハンドラ
  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  // シークバーのドラッグ終了ハンドラ
  const handleSeekMouseUp = () => {
    setSeeking(false);
    // シーク操作完了時にonProgressChangeを呼び出す
    onProgressChange?.(played * 100);
  };

  // プログラムによるシーク位置の更新ハンドラ
  const handleSeek = (seconds: number) => {
    setPlayed(seconds);
    if (playerRef.current) {
      playerRef.current.seekTo(seconds, "fraction");
    }
  };

  // 秒数を「MM:SS」または「HH:MM:SS」形式に変換する関数
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
    // プレイヤーのコンテナ（画面下部に固定）
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-10">
      {/* 非表示のReactPlayerコンポーネント */}
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
                disablekb: 1, // キーボードコントロールを無効化
                enablejsapi: 1, // YouTube JavaScript APIを有効化
                origin: window.location.origin, // オリジンを指定
                host: "https://www.youtube-nocookie.com", // プライバシー強化モードを使用
                modestbranding: 1, // YouTubeロゴを最小限に
                rel: 0, // 関連動画を非表示
                showinfo: 0, // 動画情報を非表示
                iv_load_policy: 3, // アノテーションを無効化
              },
            },
          }}
        />
      </div>

      {/* カスタムコントロール */}
      <div className="flex items-center gap-4">
        {/* 再生/一時停止ボタン */}
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

        {/* 進捗バーと時間表示 */}
        <div className="flex-1 flex items-center gap-2">
          {/* 現在の再生時間 */}
          <span className="text-sm font-medium w-12">
            {formatTime(played * duration)}
          </span>

          {/* シークバー */}
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

          {/* 総再生時間 */}
          <span className="text-sm font-medium w-12">
            {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
