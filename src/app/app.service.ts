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

  constructor(
      private http: HttpClient,
      public nativeStorage: NativeStorage,
    ) { }

  getRecipes (): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.recipe_url);
  }

}
