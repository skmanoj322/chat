import * as React from "react";

export function useSocket() {
  const [socket, Setsocket] = React.useState<WebSocket | null>(null);
  React.useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onopen = () => {
      Setsocket(ws);
    };

    ws.onclose = () => {
      Setsocket(null);
    };
    return () => {
      ws.close();
    };
  }, []);
  return socket;
}
