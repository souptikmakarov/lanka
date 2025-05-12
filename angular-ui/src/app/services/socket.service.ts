import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { GameDataService } from './game-data.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  private url = 'http://localhost:8000'; // Replace with your server URL

  constructor(private gameDataService: GameDataService) {
    this.socket = io(this.url);
  }

  connect(): void {
    this.socket.connect();
  }

  disconnect(): void {
    this.socket.disconnect();
  }

  onConnect(): void{
    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.gameDataService.playerId.next(this.socket.id == undefined ? null : this.socket.id);
    });
  }

  listen(eventName: string): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(eventName, (data: any) => {
        observer.next(data);
      });
      return () => {
        this.socket.off(eventName);
      };
    });
  }

  emit(eventName: string, data: any): void {
    this.socket.emit(eventName, data);
  }
}