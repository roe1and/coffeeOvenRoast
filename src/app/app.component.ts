import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';

import { AppService } from './app.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Component({
  selector: 'app-root',
  providers: [ AppService ],
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  temp_unit;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private appService: AppService,
    private statusBar: StatusBar,
    private storage: Storage,
    private nativeStorage: NativeStorage
  ) {

  }

  ngOnInit() {
    this.initializeApp();
    console.log('opened');
    this.platform.ready().then((readySource) => {
      this.temp_unit = this.getTemperature();
    });
  }

  ionViewWillEnter() {

  }

  getTemperature() {
    this.nativeStorage.getItem('tempUnit')
    .then(
      (temperatures) => {
        this.temp_unit = temperatures == null ? 'celsius' : temperatures;
        console.log('temp', this.temp_unit);
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

    console.log('current', this.temp_unit);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
