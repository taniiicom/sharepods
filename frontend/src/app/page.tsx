// app/page.tsx
"use client";

import WaveAnimation from "@/components/WaveAnimation";
import useNFCListener from "@/hooks/useNFCListener";
import { useState } from "react";
import MusicPlayer from "./../components/playMovie";

interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
  progress?: number;
}

export default function MusicPage() {
  const [currentProgress, setCurrentProgress] = useState<number>(0);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  const songs: Song[] = [
    {
      id: "1",
      title: "Never Gonna Give You Up",
      artist: "Rick Astley",
      url: "https://www.youtube.com/watch?v=fhTFysCtF6g",
    },
  ];

  const handleSongSelect = (song: Song) => {
    setSelectedSong(song);
    setCurrentProgress(song.progress || 0);
  };

  const handleProgressChange = async (progress: number) => {
    setCurrentProgress(progress);

    if (watchParty) {
      try {
        await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            songId: watchParty.id,
            progress,
          }),
        });
      } catch (error) {
        console.error("Failed to save progress:", error);
      }
    }
  };

  const { nfcSupported, watchParty, handleNfcScan } = useNFCListener({
    latitude: 35.0,
    longitude: 139.0,
  });

  // types/layout.ts

  return (
    <WaveAnimation>
        <h1 className="text-3xl font-bold mb-6 z-10 relative">Share Pods</h1>

        {/* Song List */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-20 z-10 relative">
          <h2 className="text-xl font-semibold mb-4">Songs</h2>
          <div className="space-y-4">
            {songs.map((song) => (
              <div
                key={song.id}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${selectedSong?.id === song.id
                  ? "bg-blue-100"
                  : "bg-gray-50 hover:bg-gray-100"
                  }`}
                onClick={() => handleSongSelect(song)}
              >
                <div className="font-medium">{song.title}</div>
                <div className="text-sm text-gray-600">{song.artist}</div>
                {selectedSong?.id === song.id && (
                  <div className="text-sm text-blue-600 mt-1">
                    Progress: {currentProgress.toFixed(1)}%
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Player */}
        {watchParty && (
          <MusicPlayer
            url={watchParty.url}
            onProgressChange={handleProgressChange}
          />
        )}
        {nfcSupported && (
          <button onClick={handleNfcScan}>NFCスキャン開始</button>
        )}
    </WaveAnimation>
  );
}
