import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Recipe } from './home/recipes/recipes';
import { Temperature } from './config.types';

@Injectable()
export class AppService {
  recipe_url = 'assets/recipes.json';
  config_url = 'assets/config.json';
  private temperatures;

  constructor(
      private http: HttpClient,
      public nativeStorage: NativeStorage,
    ) { }

  getRecipes (): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.recipe_url);
  }
  /*
  storage.set('name', 'Max');

  // Or to get a key/value pair
  storage.get('age').then((val) => {
    console.log('Your age is', val);
  });
  */
  getTemp() {
    return this.nativeStorage.getItem('tempUnit')
    .then(
      (temperatures) => {
        this.temperatures = temperatures == null ? {'unit': 'celcius'} : temperatures;
        console.log(this.temperatures);
        return this.temperatures;
      }
    );
  }

  setTemp(temp: string) {
    this.nativeStorage.setItem('tempUnit', {unit: temp});
  }
}
