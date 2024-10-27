// app/page.tsx
"use client";

import WaveAnimation from "@/components/WaveAnimation";
import useNFCListener from "@/hooks/useNFCListener";
import WatchParty from "@/types/WatchParty";
import MusicPlayer from "./../components/playMovie";


export default function MusicPage() {


  const { nfcSupported, watchParty, handleNfcScan, setWatchParty } = useNFCListener({
    latitude: 35.0,
    longitude: 139.0,
  });

  const handleSongSelect = (watchParty: WatchParty) => {
    setWatchParty(watchParty);
  };

  const handleProgressChange = async () => {
    // setCurrentProgress(progress);

    if (watchParty) {
      try {
        await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: watchParty.id,
            url: watchParty.url,
            lat: watchParty.lat,
            lon: watchParty.lon,
            current_time: watchParty.play_time,
          }),
        });
      } catch (error) {
        console.error("Failed to save progress:", error);
      }
    }
  };


  // types/layout.ts

  return (
    <WaveAnimation>
      <h1 className="text-3xl font-bold mb-6 z-10 relative">Share Pods</h1>

      {/* Song List */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-20 z-10 relative">
        <h2 className="text-xl font-semibold mb-4">Songs</h2>
        <div className="space-y-4">
          {/* {songs.map((song) => (
              <div
                key={song.id}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${selectedSong?.id === song.id
                  ? "bg-blue-100"
                  : "bg-gray-50 hover:bg-gray-100"
                  }`}
                onClick={() => handleSongSelect(song)}
              >
              </div>
            ))} */}
          <div>
            <label htmlFor="website" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">URL</label>
            <input type="url" id="website" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="flowbite.com" required onChange={() => handleSongSelect}/>
          </div>
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
