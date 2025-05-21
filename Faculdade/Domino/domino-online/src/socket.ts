import { io, Socket } from 'socket.io-client';

const URL = 'http://localhost:3001';
export const socket: Socket = io(URL, { autoConnect: false });

export const connectSocket = (name: string) => {
  socket.auth = { name };
  socket.connect();
};