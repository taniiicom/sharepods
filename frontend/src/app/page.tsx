// app/page.tsx
"use client";

import WaveAnimation from "@/components/WaveAnimation";
import { useDirection } from "@/hooks/useDirection";
import useGeolocation from "@/hooks/useGeolocation";
import useNFCListener from "@/hooks/useNFCListener";
import { useWaveAnimationActive } from "@/hooks/useWaveAnimationActive";
import { ChangeEvent, useId } from "react";
import MusicPlayer from "./../components/playMovie";


export default function MusicPage() {
  const { coordinates } = useGeolocation();
  const latitude = coordinates?.[0] ?? 0;
  const longitude = coordinates?.[1] ?? 0;
  const id = useId();

  const { nfcSupported, watchParty, handleNfcScan, setWatchParty } = useNFCListener({
    latitude: latitude,
    longitude: longitude,
  });

  const handleSongSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setWatchParty({
      id: id,
      lat: latitude,
      lon: longitude,
      url: url,
      play_time: 0,
    });
    console.log(watchParty);
  };
  const { direction, setDirection } = useDirection('down');
  const { isWaveAnimationActive, setIsWaveAnimationActive } = useWaveAnimationActive(false);



  const handleProgressChange = async (progress: number) => {
    if (watchParty) {
      try {
        await fetch("https://api.sharepods.p1ass.com/watchparty", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: id,
            url: watchParty.url,
            lat: latitude,
            lon: longitude,
            current_time: progress,
          }),
        });
        setIsWaveAnimationActive(true);
        setDirection('up');
      } catch (error) {
        console.error("Failed to save progress:", error);
      }
    }
  };


  // types/layout.ts

  return (
    <WaveAnimation isWaveAnimationActive={isWaveAnimationActive} direction={direction}>
      <h1 className="text-3xl font-bold mb-6 z-10 relative">Share Pods</h1>

      {/* Song List */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-20 z-10 relative">
        <h2 className="text-xl font-semibold mb-4">Songs</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="website" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">URL</label>
            <input type="url" id="website" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="flowbite.com" required onChange={(e) => handleSongSelect(e)}/>
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
