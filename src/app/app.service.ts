import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Recipe } from './home/recipes/recipes';
import { Temperature } from './config.types';

@Injectable()
export class AppService {
  recipe_url = 'assets/recipes.json';
  config_url = 'assets/config.json';
  private temperatures: Temperature[];

  constructor(
      private http: HttpClient,
      public storage: Storage,
    ) { }

  getRecipes (): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.recipe_url);
  }

  getTemp() {
    return this.storage.get('temperatures').then(
      (temperatures) => {
        this.temperatures = temperatures == null ? {'temperture': 'celcius'} : temperatures;
        return [...this.temperatures];
      }
    );
  }

  setTemp(temp: Temperature) {
    this.temperatures.pop();
    this.temperatures.push(temp);
  }
}
