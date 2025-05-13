import { Component } from '@angular/core';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-lobby',
  imports: [],
  templateUrl: './lobby.component.html',
  styleUrl: './lobby.component.scss',
})
export class LobbyComponent {
  private name: string = "";
  private team: string = "";
  private error: string = "";

  constructor(private socket: SocketService) {}

  public join() {
    this.socket.emit('join_game', { name: this.name, team: this.team });
  }

  public startGame() {
    this.socket.emit('start_game', '');
  }
}
