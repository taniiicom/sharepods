"use client";
import React from "react";
import useNFCListener from "@/hooks/useNFCListener";

const MobileLayout = () => {
  const longitude = 0;
  const latitude = 0;
  const { nfcSupported, message, handleNfcScan } = useNFCListener({
    longitude,
    latitude,
  });
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center px-4 z-50">
          <div className="flex-1">
            <h1 className="text-lg font-semibold">SharePods</h1>
          </div>
        </header>
      </div>
      <div>
        {nfcSupported ? (
          <button onClick={handleNfcScan}>NFCスキャン開始</button>
        ) : (
          <p>NFCがサポートされていません。</p>
        )}
        <p>{message}</p>
      </div>
    </>
  );
};

export default MobileLayout;
