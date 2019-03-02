import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';

import { AppService } from './app.service';
import { Temperature } from './config.types';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Component({
  selector: 'app-root',
  providers: [ AppService ],
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  temperatures;

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
      this.temperatures = this.getTemperature();
    });
  }

  ionViewWillEnter() {

  }

  getTemperature() {
    this.nativeStorage.getItem('tempUnit')
    .then(
      (temperatures) => {
        this.temperatures = temperatures == null ? 'celsius' : temperatures;
        console.log('temp', this.temperatures);
      }
    );
  }

  changeTempToggle() {

    if (this.temperatures === 'celsius') {
      this.nativeStorage.setItem('tempUnit', 'farenheit')
        .then(
        () => console.log('Stored item this.temperatures =!'),
        error => console.error('Error storing item', error)
      );
      this.temperatures = 'farenheit';
    } else if (this.temperatures === 'farenheit') {
      this.nativeStorage.setItem('tempUnit', 'celsius')
        .then(
        () => console.log('Stored item celsius!'),
        error => console.error('Error storing item', error)
      );
      this.temperatures = 'celsius';
    }

    console.log('current', this.temperatures);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
