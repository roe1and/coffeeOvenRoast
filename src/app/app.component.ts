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
    this.temperatures = this.appService.getTemp();
  }

  changeTempToggle() {

    if (this.temperatures['temperatures'] === 'celsius') {
      this.appService.setTemp('farenheit');
    } else {
      this.appService.setTemp('celsius');
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
