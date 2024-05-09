import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';


@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  setup(): void {
    this.socket = io("https://staging.khaleejauction.com:2053", {
      path: '/',
      reconnection: true
    });
    this.socket.on('updates', (data) => {
      console.log(data);
    })
  }
}