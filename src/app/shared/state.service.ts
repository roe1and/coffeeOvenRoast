import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Recipe } from '../shared/recipes';
import { Units } from '../shared/config.types';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

const init_data = {temperature: 'celsius', weight: 'grams'};

@Injectable()
export class StateService {
  private stateUnit = new BehaviorSubject<Units>(init_data);
  data$: Observable<any> = this.stateUnit.asObservable();

  constructor(
  private nativeStorage: NativeStorage,
  ) {}

  loadUnits() {
    this.nativeStorage.getItem('Units')
    .then(
      (result) => {
        this.stateUnit.next(result);
      },
      error => {
        this.nativeStorage.setItem('Units', init_data)
        .then(
          () => console.log('done'),
          err => console.error('Error storing item', err)
        );
      }
    );
  }
}
