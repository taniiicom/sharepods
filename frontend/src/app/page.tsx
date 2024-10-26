// app/page.tsx
"use client";

import { useState } from "react";
import MusicPlayer from "./../components/playMovie";
import WaveAnimation from "@/components/WaveAnimation";

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

    if (selectedSong) {
      try {
        await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            songId: selectedSong.id,
            progress,
          }),
        });
      } catch (error) {
        console.error("Failed to save progress:", error);
      }
    }
  };

  // types/layout.ts

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Music Player</h1>

        {/* Song List */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-20">
          <h2 className="text-xl font-semibold mb-4">Songs</h2>
          <div className="space-y-4">
            {songs.map((song) => (
              <div
                key={song.id}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  selectedSong?.id === song.id
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
        {/* Main Content */}
        <WaveAnimation />
        {/* Player */}
        {selectedSong && (
          <MusicPlayer
            url={selectedSong.url}
            onProgressChange={handleProgressChange}
          />
        )}
      </div>
    </div>
  );
}
