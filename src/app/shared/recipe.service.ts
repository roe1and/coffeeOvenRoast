import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Recipe } from './recipes.types';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

const init_data = {
  'recipes': [
    {
      'id': '14900c38-53d1-4665-bc8c-3d61008ec711',
      'name': 'Brazil Santos',
      'variant': 'Test',
      'size': 75,
      'description': 'yummy',
      'starttemp': 190,
      'maintemp': 235,
      'intervals': [5, 4, 3, 2]
    },
    {
      'id': '14900c38-53d1-4665-bc8c-3d61008eb744',
      'name': 'Brazil Santos',
      'variant': 'Medium',
      'size': 75,
      'description': 'yummy',
      'starttemp': 190,
      'maintemp': 235,
      'intervals': [240, 200, 200, 200]
    },
    {
      'id': 'e758896c-32ff-440f-a79a-6f642afcb245',
      'name': 'Brazil Catuai',
      'variant': 'Dark',
      'size': 75,
      'description': 'also yummy',
      'starttemp': 190,
      'maintemp': 235,
      'intervals': [250, 180, 180, 180]
    },
    {
      'id': 'b55390a1-1fa6-426a-bad9-8319a241f26f',
      'name': 'Brazil Catuai',
      'variant': 'Medium',
      'size': 75,
      'description': 'also yummy',
      'starttemp': 190,
      'maintemp': 235,
      'intervals': [260, 180, 180, 180]
    }
  ]
};

@Injectable()
export class RecipeService {
  private Recipes = new BehaviorSubject<Recipe>(init_data);
  data$: Observable<any> = this.Recipes.asObservable();

  constructor(
  private nativeStorage: NativeStorage,
  ) {}

  loadRecipes() {
    this.nativeStorage.getItem('recipes')
    .then(
      (result) => {
        this.Recipes.next(result);
      },
      error => {
        this.nativeStorage.setItem('recipes', init_data)
        .then(
          () => console.log('done'),
          err => console.error('Error storing recipe', err)
        );
      }
    );
  }
}
