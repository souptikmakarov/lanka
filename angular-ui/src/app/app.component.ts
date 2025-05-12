import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SocketService } from './services/socket.service';
import { Subscription, take } from 'rxjs';
import { GameDataService } from './services/game-data.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular-ui';
  message: string = '';
  private gameStateSubscription: Subscription | undefined;
  private gameStartedSubscription: Subscription | undefined;

  constructor(private socketService: SocketService, private gameDataService: GameDataService, private router: Router) {}

  ngOnInit(): void {
    this.socketService.connect();
    let playerIdSubscription = this.gameDataService.playerId.subscribe((playerId: string | null) => {
      if (playerId) {
        console.log("Player ID:", playerId);
        this.router.navigate(['/lobby']);
        playerIdSubscription?.unsubscribe();
      }
    });
    this.gameStateSubscription = this.socketService.listen('game_state').subscribe((state: any) => {
      console.log("game_state", JSON.stringify(state));
      this.gameDataService.gameState.next(state);
    });
    this.gameStartedSubscription = this.socketService.listen('game_started').subscribe((state: any) => {
      console.log("game_started", JSON.stringify(state));
      this.router.navigate(['/game']);
    });
  }

  sendMessage(): void {
    this.socketService.emit('message', 'Hello from Angular!');
  }

  ngOnDestroy(): void {
    if (this.gameStateSubscription) {
      this.gameStateSubscription.unsubscribe();
    }
    this.socketService.disconnect();
  }
}
