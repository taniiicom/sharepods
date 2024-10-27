import { useState, useRef } from "react";

interface callWebSocketProps {
  id: string;
}

interface WsMessage {
  play_time?: number;
  isPlay?: boolean;
  numPlayers?: number;
}

const useWebSocket = () => {
  const [wsCurrentSeekTime, setWsCurrentSeekTime] = useState<number>(0);
  const [wsIsPlaying, setWsIsPlaying] = useState<boolean>(false);
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const ws = useRef<WebSocket | null>(null);
  const callWebSocket = ({ id }: callWebSocketProps) => {
    if (ws && ws.current?.readyState === WebSocket.OPEN) {
      return;
    }
    ws.current = new WebSocket(`ws://api.sharepods.p1ass.com/ws?id=${id}`);

    ws.current.onmessage = (event) => {
      const data: WsMessage = JSON.parse(event.data);

      if (data.play_time) {
        setWsCurrentSeekTime(data.play_time);
      } else if (data.isPlay) {
        setWsIsPlaying(data.isPlay);
      } else if (data.numPlayers) {
        setIsSharing(data.numPlayers > 2);
      }
    };
  };

  const sendWsMessage = (message: WsMessage) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  };

  return {
    wsCurrentSeekTime,
    wsIsPlaying,
    isSharing,
    callWebSocket,
    sendWsMessage,
  };
};

export default useWebSocket;
