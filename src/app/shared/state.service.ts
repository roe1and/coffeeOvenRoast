import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Recipe } from '../shared/recipes';
import { Units } from '../shared/config.types';

@Injectable({
    providedIn: 'root'
  })
export class AppService {
    private stateUnit: BehaviorSubject<Units> =
        new BehaviorSubject({temperature: 'celsius', weight: 'grams'});
}
