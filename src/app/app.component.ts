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
  temperature;

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
    this.getTemperature();
  }

  getTemperature() {
    this.appService.getTemp()
    .subscribe((temperature: Temperature) => this.temperature = { ...temperature });
  }

  changeTempToggle() {
    if (this.temperature['temperature'] === 'celsius') {
      this.temperature['temperature'] = 'farenheit';
    } else {
      this.temperature['temperature'] = 'celsius';
    }
    console.log('current', this.temperature);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
