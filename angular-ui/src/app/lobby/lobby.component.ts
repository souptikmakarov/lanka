import { Component } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { CommonModule } from '@angular/common';
import { GameDataService } from '../services/game-data.service';

@Component({
  selector: 'app-lobby',
  imports: [CommonModule],
  templateUrl: './lobby.component.html',
  styleUrl: './lobby.component.scss',
})
export class LobbyComponent {
  public name: string = "";
  public team: string = "";
  public error: string = "";
  public game_state: any = null;

  constructor(private socket: SocketService, private gameDataService: GameDataService) {}

  ngOnInit(): void {
    this.gameDataService.gameState.subscribe((game_state: any) => {
      this.game_state = game_state;
    }); 
  }

  public join() {
    this.socket.emit('join_game', { name: this.name, team: this.team });
  }

  public startGame() {
    this.socket.emit('start_game', '');
  }
}
