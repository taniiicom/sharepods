// app/page.tsx
"use client";

import WaveAnimation from "@/components/WaveAnimation";
import { useDirection } from "@/hooks/useDirection";
import useGeolocation from "@/hooks/useGeolocation";
import useNFCListener from "@/hooks/useNFCListener";
// import { usePlayed } from "@/hooks/usePlayed";
// import { usePlaying } from "@/hooks/usePlaying";
import { usePlaying } from "@/hooks/usePlaying";
import { useWaveAnimationActive } from "@/hooks/useWaveAnimationActive";
import WatchParty from "@/types/WatchParty";
import { ChangeEvent, useId, useState } from "react";
import MusicPlayer from "./../components/playMovie";

export default function MusicPage() {
  const { coordinates } = useGeolocation();
  const [status, setStatus] = useState<"sender" | "reciever">("reciever");
  const latitude = coordinates?.[0] ?? 0;
  const longitude = coordinates?.[1] ?? 0;
  const id = useId();
  const { direction, setDirection } = useDirection("down");
  const onFetch = async (watchParty: WatchParty) => {
    watchParty.play_time += 1.2;
    setWatchParty(watchParty);
    setIsPlaying(true);
    setIsWaveAnimationActive(true);
    setStatus("reciever");
    setDirection("down");
  }

  const { nfcSupported, watchParty, handleNfcScan, setWatchParty } =
    useNFCListener({
      latitude: latitude,
      longitude: longitude,
      onFetch: onFetch,
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
    setStatus("sender");
  };
  const { isWaveAnimationActive, setIsWaveAnimationActive } =
    useWaveAnimationActive(false);
  const { isPlaying, setIsPlaying } = usePlaying();

  // const { played, setPlayed } = usePlayed();

  // const handleDebugNFC = async () => {
  //   const res = await fetch(
  //     `https://api.sharepods.p1ass.com/watchparty?lat=${latitude}&lon=${longitude}`
  //   );
  //   const watchParty: WatchParty = await res.json();
  //   watchParty.play_time += 1.2;
  //   setWatchParty(watchParty);
  //   setIsPlaying(true);
  //   // setPlayed(watchParty.play_time % duration);
  //   // setIsPlaying(true);
  //   setStatus("reciever");
  //   setIsWaveAnimationActive(true);
  //   setDirection("down");
  // };

  const handleProgressChange = async (progress: number) => {
    if (watchParty && status === "sender") {
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
        setDirection("up");
      } catch (error) {
        console.error("Failed to save progress:", error);
      }
    }
  };

  // types/layout.ts

  return (
    <WaveAnimation
      isWaveAnimationActive={isWaveAnimationActive}
      direction={direction}
    >
      <h1 className="text-3xl font-bold mb-6 z-10 relative font-serif flex justify-center">Share Pods</h1>

      {/* Song List */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-40 z-10 relative">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="website"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white font-serif"
            >
            </label>
            <input
              type="url"
              id="website"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 font-serif"
              placeholder="https://www.youtube.com/"
              required
              onChange={(e) => handleSongSelect(e)}
            />
          </div>
        </div>
        {!nfcSupported ? (
          <button onClick={() => {
            handleNfcScan();
          }} className="font-serif flex justify-center font-light mt-1 w-full">NFCスキャン開始</button>
        ) : (
          <>
            <p className="font-serif flex justify-center">NFCに対応していません</p>
            {/* <button
              className={"border-2"}
              onClick={async () => {
                await handleDebugNFC();
              }}
            >
              [debug用] NFCスキャンをしたことにしてAPIを叩くボタン
            </button> */}
          </>
        )}
      </div>
      {/* Player */}
      {watchParty && (
        <MusicPlayer
          url={watchParty.url}
          setIsPlaying={setIsPlaying}
          isPlaying={isPlaying}
          onProgressChange={handleProgressChange}
          currentTimeSeconds={watchParty.play_time}
        />
      )}
    </WaveAnimation>
  );
}
