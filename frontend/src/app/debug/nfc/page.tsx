"use client";
import useNFCListener from "@/hooks/useNFCListener";

export default function DebugNFCPage() {
  const { nfcSupported, watchParty, handleNfcScan, setWatchParty } = useNFCListener({
    latitude: 1000, // テスト用数値
    longitude: 1000, // テスト用数値
  });

  return <div>
    <p>nfcSupported: {nfcSupported.toString()}</p>
    <button onClick={async () => {
      await handleNfcScan()
    }
    } className={"border"}>Start Scan Button
    </button>
    <div>
      <p>{watchParty? `id: ${watchParty.id}`: "watch party is null"}</p>
      <p>{watchParty? `url: ${watchParty.url}`: "watch party is null"}</p>
      <p>{watchParty? `lat: ${watchParty.lat}`: "watch party is null"}</p>
      <p>{watchParty? `lon: ${watchParty.lon}`: "watch party is null"}</p>
      <p>{watchParty? `play_time: ${watchParty.play_time}`: "watch party is null"}</p>
    </div>
  </div>

}
