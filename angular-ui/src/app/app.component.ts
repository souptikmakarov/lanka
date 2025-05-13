import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SocketService } from './services/socket.service';
import { Subscription, take } from 'rxjs';
import { GameDataService } from './services/game-data.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'angular-ui';
  message: string = '';
  private gameStateSubscription: Subscription | undefined;
  private gameStartedSubscription: Subscription | undefined;
  private gameResetSubscription: Subscription | undefined;

  constructor(
    private socketService: SocketService,
    private gameDataService: GameDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('AppComponent initialized');
    this.socketService.connect();
    this.socketService.onConnect();
    let playerIdSubscription = this.gameDataService.playerId.subscribe(
      (playerId: string | null) => {
        if (playerId) {
          console.log('Player ID:', playerId);
          this.router.navigate(['/lobby']);
          playerIdSubscription?.unsubscribe();
        }
      }
    );
    this.gameStateSubscription = this.socketService
      .listen('game_state')
      .subscribe((state: any) => {
        console.log('game_state', JSON.stringify(state));
        this.gameDataService.gameState.next(state);
      });
    this.gameStartedSubscription = this.socketService
      .listen('game_started')
      .subscribe(() => {
        console.log('game_started');
        this.router.navigate(['/game']);
      });
    this.gameResetSubscription = this.socketService
      .listen('game_reset')
      .subscribe(() => {
        console.log('game_reset');
        this.gameDataService.gameState.next(null);
        this.router.navigate(['/lobby']);
      });
  }

  ngOnDestroy(): void {
    if (this.gameStateSubscription) {
      this.gameStateSubscription.unsubscribe();
    }
    if (this.gameStartedSubscription) {
      this.gameStartedSubscription.unsubscribe();
    }
    this.socketService.disconnect();
  }
}
