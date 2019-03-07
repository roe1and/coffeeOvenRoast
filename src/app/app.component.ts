import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { UnitService } from './shared/unit.service';
import { RecipeService } from './shared/recipe.service';

@Component({
  selector: 'app-root',
  providers: [  ],
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  temp_unit: string;


  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private nativeStorage: NativeStorage,
    private unitService: UnitService,
    private recipeService: RecipeService,
    ) {
      this.unitService.loadUnits();
      this.recipeService.loadRecipes();
     }

  ngOnInit() {
    this.initializeApp();
    console.log('opened');
    this.platform.ready().then(() => {
      this.getTemperature();
    });
    console.log('init', this.temp_unit);

  }

  getTemperature() {
    this.nativeStorage.getItem('tempUnit')
    .then(
      (result) => {
        this.temp_unit = result;
      },
      error => {
        this.nativeStorage.setItem('tempUnit', 'celsius')
        .then(
          () => console.log('Stored item this.temp_unit =!'),
          err => console.error('Error storing item', err)
        );
        this.temp_unit = 'celsius';
      }
    );
  }

  changeTempToggle() {

    if (this.temp_unit === 'celsius') {
      this.nativeStorage.setItem('tempUnit', 'farenheit')
        .then(
        () => console.log('Stored item this.temp_unit =!'),
        error => console.error('Error storing item', error)
      );
      this.temp_unit = 'farenheit';
    } else if (this.temp_unit === 'farenheit') {
      this.nativeStorage.setItem('tempUnit', 'celsius')
        .then(
        () => console.log('Stored item celsius!'),
        error => console.error('Error storing item', error)
      );
      this.temp_unit = 'celsius';
    }

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
