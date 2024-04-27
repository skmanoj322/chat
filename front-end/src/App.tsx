import { useEffect, useState } from "react";
import { useSocket } from "./hooks/useSocket";

export default function App() {
  const [message, setMessage] = useState<string[]>([]);
  const [send, setSend] = useState("");
  const socket = useSocket();

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.onmessage = (data) => {
      const msg = JSON.parse(data.data);
      if (msg.type === "message") {
        console.log(msg);
        setMessage((m) => [...m, msg.payload.message]);
      }
    };
  }, [socket]);

  const onSendHandler = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get("roomId");
    const userId = urlParams.get("userId");
    socket?.send(
      JSON.stringify({
        type: "message",
        payload: {
          message: send,
          roomId: roomId,
          userId: userId,
        },
      })
    );
    setSend("");
  };
  const connectHandler = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get("roomId");
    const userId = urlParams.get("userId");
    console.log("connect", socket);
    // console.log();
    socket?.send(
      JSON.stringify({
        type: "join",
        payload: {
          roomId: roomId,
          userId: userId,
        },
      })
    );
  };
  return (
    <>
      <h1 className="text-3xl font-bold underline">
        {message.map((data) => data)}
      </h1>
      <input
        className="border-2 bg-slate-200	"
        value={send}
        onChange={(e) => {
          setSend(e.target.value);
        }}
      />
      <button
        className="font-bold text-black py-2 px-4 rounded hover:bg-green-700 border-2 border-cyan-600 "
        onClick={onSendHandler}
      >
        send
      </button>
      <button
        className="font-bold text-black py-2 px-4 rounded hover:bg-green-700 border-2 border-cyan-600 "
        onClick={connectHandler}
      >
        connect
      </button>
    </>
  );
}
