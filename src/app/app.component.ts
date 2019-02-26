import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  providers: [ AppService ],
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  temperature: string;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private appService: AppService,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    this.getTemperature();
  }

  getTemperature() {

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
