import { useSyncExternalStore } from "react";

// NFCストアの型定義
interface NFCStore {
  getSnapshot: () => string | null;
  subscribe: (listener: (data: string | null) => void) => () => void;
}

// NFCデータを管理するストアを作成
function createNFCStore(): NFCStore {
  let listeners: ((data: string | null) => void)[] = [];
  let nfcData: string | null = null;

  // NFCデバイスからデータを取得
  const readNFCData = async () => {
    try {
      const ndef = new window.NDEFReader();
      await ndef.scan();

      ndef.onreading = (event) => {
        const decoder = new TextDecoder();
        const message = event.message;
        const records = message.records.map(record => decoder.decode(record.data));
        nfcData = records.join(', ');

        // リスナーに新しいデータを通知
        listeners.forEach(listener => listener(nfcData));
      };
    } catch (error) {
      console.error("NFC読み取り中にエラーが発生しました:", error);
    }
  };

  return {
    getSnapshot: () => nfcData,
    subscribe: (listener: (data: string | null) => void) => {
      listeners.push(listener);
      if (listeners.length === 1) readNFCData(); // 最初のリスナーが追加されたら読み取り開始
      return () => {
        listeners = listeners.filter(l => l !== listener);
      };
    }
  };
}

const nfcStore = createNFCStore();
const useNFCListener = () => {
  return useSyncExternalStore(nfcStore.subscribe, nfcStore.getSnapshot);
};
export default useNFCListener;
