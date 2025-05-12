import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameDataService {

  playerId: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  gameState: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor() { }

  
}
