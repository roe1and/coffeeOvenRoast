import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';

import { AppService } from './app.service';
import { Temperature } from './config.types';

@Component({
  selector: 'app-root',
  providers: [ AppService ],
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  temperatures: Temperature;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private appService: AppService,
    private statusBar: StatusBar,
    private storage: Storage,
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    // this.temperatures = this.getTemperature();
  }

  ionViewWillEnter() {
  }

  getTemperature() {
    return this.appService.getTemp();
  }

  changeTempToggle() {

    if (this.temperatures['temperatures'] === 'celsius') {
      // this.appService.setTemp('farenheit');
      // this.temperatures['temperatures'] = 'farenheit';
    } else {
      // this.appService.setTemp('celsius');
      // this.temperatures['temperatures'] = 'celsius';
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
