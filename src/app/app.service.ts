import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Recipe } from './home/recipes/recipes';

@Injectable()
export class AppService {
  recipe_url = 'assets/recipes.json';

  constructor(
      private http: HttpClient
    ) { }

  getRecipes (): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.recipe_url);
  }
}
