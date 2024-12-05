import { io } from "socket.io-client";

export const socket = io(
  process.env.APIX_URL as string,
  {
    transports: ["websocket"],
  }
);
