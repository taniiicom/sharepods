"use client";
import GeographicalLocation from "@/types/GeographicalLocation";
import WatchParty from "@/types/WatchParty";
import { useEffect, useState } from "react";

const useNFCListener = ({ latitude, longitude }: GeographicalLocation) => {
  const [nfcSupported, setNfcSupported] = useState(false);
  const [watchParty, setWatchParty] = useState<WatchParty | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && "NDEFReader" in window) {
      setNfcSupported(true);
    }
  }, []);

  const handleNfcScan = async () => {
    if (!nfcSupported) {
      setMessage("このデバイスではNFCがサポートされていません。");
      return;
    }
    try {
      const nfcReader = new window.NDEFReader();
      await nfcReader.scan();
      nfcReader.onreadingerror = async () => {
        const res = await fetch(
          `https://api.sharepods.p1ass.com/watchparty?lat=${latitude}&lon=${longitude}`,
        );
        const watchParty: WatchParty = await res.json();
        setWatchParty(watchParty);
        setMessage("NFCイベント発生！！！");
      };
      setMessage("NFCスキャンを開始しました。カードをかざしてください。");
    } catch (error) {
      setMessage("NFCスキャン中にエラーが発生しました：" + error);
    }
  };

  return { nfcSupported, watchParty, setWatchParty, message, handleNfcScan };
};

/**
 *
 * 使用例:
 *
 * "use client";
 * import React from "react";
 * import useNFCListener from "@/hooks/useNFCListener";
 *
 * const Page = () => {
 *   const longitude = 0;
 *   const latitude = 0;
 *   const { nfcSupported, message, handleNfcScan } = useNFCListener({
 *     longitude,
 *     latitude,
 *   });
 *   return (
 *     <>
 *       <div>
 *         {nfcSupported ? (
 *           <button onClick={handleNfcScan}>NFCスキャン開始</button>
 *         ) : (
 *           <p>NFCがサポートされていません。</p>
 *         )}
 *         <p>{message}</p>
 *       </div>
 *     </>
 *   );
 * };
 * export default Page;
 */

export default useNFCListener;
