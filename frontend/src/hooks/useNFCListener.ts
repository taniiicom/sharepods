import { useState, useEffect } from "react";

const useNFCListener = () => {
  const [nfcSupported, setNfcSupported] = useState(false);
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
      nfcReader.onreading = (event) => {
        const decoder = new TextDecoder();
        for (const record of event.message.records) {
          setMessage(`NFCデータ: ${decoder.decode(record.data)}`);
        }
      };
      setMessage("NFCスキャンを開始しました。カードをかざしてください。");
    } catch (error) {
      setMessage("NFCスキャン中にエラーが発生しました：" + error);
    }
  };

  return { nfcSupported, message, handleNfcScan };
};
export default useNFCListener;
