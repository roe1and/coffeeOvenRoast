import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { NativeStorage } from '@ionic-native/native-storage/ngx';

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
    private nativeStorage: NativeStorage
  ) { }

  ngOnInit() {
    this.initializeApp();
    console.log('opened');
    this.platform.ready().then(() => {
      this.getTemperature();
    });
    console.log('init', this.temp_unit);

  }

  getTemperature() {
  //  try {
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

          console.error('Error storing item', error);
        }
      );
  //  } catch (e) {
  //    console.log('e', e);
  //  }
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

    console.log('current', this.temp_unit);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
