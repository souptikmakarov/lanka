import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LobbyComponent } from './lobby/lobby.component';
import { GameComponent } from './game/game.component';

export const routes: Routes = [
    { path: '', component: AppComponent },
    { path: 'lobby', component: LobbyComponent },
    { path: 'game', component: GameComponent}
];
