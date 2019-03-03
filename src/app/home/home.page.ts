import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Toast } from '@ionic-native/toast/ngx';
import { takeUntil, mergeMap, map } from 'rxjs/operators';
import { fromEvent, pipe, timer, Observable } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { Recipe } from '../home/recipes/recipes';
import { AudioService } from './shared/audio.service';
import { AppService } from '../app.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  providers: [ AppService ],
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit, AfterViewInit {
  percent1: any = 0;
  percent2: any = 0;
  percent3: any = 0;
  percent4: any = 0;
  hide_p1 = false;
  hide_p2 = false;
  hide_p3 = false;
  hide_p4 = false;
  disable_click_p1 = false;
  disable_click_p2 = true;
  disable_click_p3 = true;
  disable_click_p4 = true;
  seconds = 0;
  p1 = 'Tap to start';
  p2 = 'Disabled';
  p3 = 'Disabled';
  p4 = 'Disabled';
  p1_done = false;
  p2_done = false;
  p3_done = false;
  p4_done = false;
  start_p1 = false;
  timer: any = false;
  elapsed = 0;
  m: number;
  s: number;
  preventSingleClick = false;
  click_timer: any;
  delay = 200;
  color = 'primary';
  reset_id = 'inactive';
  stop_timer = false;
  overtime = true;
  overtime_button = true;
  current_recipe;
  showcontent = false;
  recipes: any[] = [];
  time_remain: number;
  clickable: boolean = false;
  init_recipes = {
    'recipes': [
      {
        'id': '14900c38-53d1-4665-bc8c-3d61008eb744',
        'name': 'Brazil Santos',
        'variant': 'Medium',
        'description': 'yummy',
        'starttemp': 190,
        'maintemp': 235,
        'intervals': [9, 180, 180, 180]
      },
      {
        'id': 'e758896c-32ff-440f-a79a-6f642afcb245',
        'name': 'Brazil Catuai',
        'variant': 'Dark',
        'description': 'also yummy',
        'starttemp': 220,
        'maintemp': 235,
        'intervals': [250, 180, 180, 180]
      },
      {
        'id': 'b55390a1-1fa6-426a-bad9-8319a241f26f',
        'name': 'Brazil Catuai',
        'variant': 'Medium',
        'description': 'also yummy',
        'starttemp': 190,
        'maintemp': 235,
        'intervals': [260, 180, 180, 180]
      }
    ]
  };
  slideOpts = {
    effect: 'flip',
    pagination: false
  };

  constructor (
    private insomnia: Insomnia,
    private nativeAudio: NativeAudio,
    private vibration: Vibration,
    private screenOrientation: ScreenOrientation,
    private toast: Toast,
    private platform: Platform,
    private appService: AppService,
    private nativeStorage: NativeStorage,
    private audio: AudioService,
    public alertController: AlertController,
    ) {
    this.insomnia.keepAwake();
    this.nativeAudio.preloadSimple('ding', 'assets/Bell-sound-effect-ding.mp3');
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    this.backButtonEvent();
  }

  ngOnInit() {
    this.platform.ready().then(() => {
      this.getRecipes();
    });
  }

  ngAfterViewInit() {
    this.audio.preload('tabSwitch', 'assets/Bell-sound-effect-ding.mp3');
  }

  getRecipes() {
    this.nativeStorage.getItem('recipes')
    .then(
      (result) => {
        this.recipes = result;
      },
      error => {
        this.nativeStorage.setItem('recipes', this.init_recipes.recipes)
        .then(
          () => {
            this.init_recipes.recipes.forEach((element) => {
              this.recipes.push(element);
            });
            this.recipes = this.init_recipes.recipes;
          },
          err => console.error('Error storing item', err)
        );
      }
    );
  }

  setRecipe($event) {
    this.showcontent = true;
    const id = $event.target.value;
    console.log(id);
    // this.current_recipe =  this.recipes['recipes'][id]['intervals'];
    this.current_recipe = this.recipes.filter(obj => {
      return obj.id === id;
    });
    console.log(this.current_recipe);
    this.startAlert();
  }

  async startAlert() {
    const temp = this.current_recipe[0].starttemp;
    const temp_unit = 'C';
    const alert = await this.alertController.create({
    header: 'Roasting, Phase 1',
    message: 'Important: Before you start preheat the oven to ' + temp + ' °' + temp_unit,
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
          console.log('Confirm Cancel: blah');
        }
      }, {
        text: 'Start roasting',
        handler: () => {
          console.log('Confirm Okay');
          this.ovenTempAlert();
        }
      }
    ]
  });

    await alert.present();
  }

  async ovenTempAlert() {
    const time = this.current_recipe[0].intervals[0];
    const temp = this.current_recipe[0].maintemp;
    const temp_unit = 'C';
    const alert = await this.alertController.create({
    header: 'Set oven temperature',
    message: 'Set the oven temperature to ' + temp + ' °' + temp_unit,
    buttons: [
     {
        text: 'Done',
        handler: () => {
          console.log('Confirm Okay');
          this.startTimer(time);
        }
      }
    ]
  });

    await alert.present();
  }

  startTimer(duration: number) {
    this.clickable = true;
    this.timer = setInterval(() => {
      if (this.elapsed === duration) {
        clearInterval(this.timer);
        this.vibration.vibrate(200);
        // this.nativeAudio.play('ding');
        this.audio.play('tabSwitch');
        this.time_remain = undefined;
        this.clickable = false;
      }
      this.percent1 = this.elapsed / duration;
      this.elapsed++;
      this.time_remain = duration - this.elapsed;

    }, 1000);
  }

  backButtonEvent() {
    this.platform.backButton.subscribe(async () => {
      this.toast.show(
        `Press back again to exit.`,
        '2000',
        'center')
        .subscribe(toast => {
            // console.log(JSON.stringify(toast));
        });
      });
    }
/*
  startTimer1 (duration: number) {
    this.start_p1 = true;
    this.m = Math.floor(duration / 60);
    this.s = duration - this.m * 60;
    this.timer = false;
    this.percent1 = 0;
    this.disable_click_p1 = true;
    this.p1 = 'Beans are now roasting';

    this.timer = setInterval(() => {
      if (this.elapsed === duration) {
        clearInterval(this.timer);
        this.p1 = 'Done';
        this.elapsed = 0;
        this.p1_done = true;
        this.hide_p1 = true;
        this.disable_click_p2 = false;
        this.vibration.vibrate(200);
        // this.nativeAudio.play('ding');
        this.audio.play('tabSwitch');
      }
      if (this.stop_timer === true) { // not working
        console.log('stop');
        clearInterval(this.timer);
        this.elapsed = 0;
        this.stop_timer = false;
      }
      this.m = Math.floor((duration - this.elapsed) / 60);
      this.s = (duration - this.elapsed) - this.m * 60;
      this.percent1 = this.elapsed / duration;
      this.elapsed++;

    }, 1000);
  }

  startTimer2 (duration: number) {
    this.timer = false;
    this.percent2 = 0;
    this.disable_click_p2 = true;
    this.p2 = 'Still roasting';

    this.timer = setInterval(() => {
      if (this.elapsed === duration) {
        clearInterval(this.timer);
        this.p2 = 'Done';
        this.elapsed = 0;
        this.p2_done = true;
        this.hide_p2 = true;
        this.disable_click_p3 = false;
        this.vibration.vibrate(200);
        // this.nativeAudio.play('ding');
        this.audio.play('tabSwitch');
      }
      this.percent2 = this.elapsed / duration;
      this.elapsed++;
    }, 1000);
  }

  startTimer3 (duration: number) {
    this.timer = false;
    this.percent3 = 0;
    this.disable_click_p3 = true;
    this.p3 = 'Almost there';

    this.timer = setInterval(() => {
      if (this.elapsed === duration) {
        clearInterval(this.timer);
        this.p3 = 'Done';
        this.elapsed = 0;
        this.p3_done = true;
        this.hide_p3 = true;
        this.disable_click_p4 = false;
        this.vibration.vibrate(200);
        // this.nativeAudio.play('ding');
        this.audio.play('tabSwitch');
      }
      this.percent3 = this.elapsed / duration;
      this.elapsed++;
    }, 1000);
  }

  startTimer4 (duration: number) {
    this.timer = false;
    this.percent4 = 0;
    this.disable_click_p4 = true;
    this.p4 = 'Home stretch!';

    this.timer = setInterval(() => {
      if (this.elapsed === duration) {
        clearInterval(this.timer);
        this.p4 = 'Done';
        this.elapsed = 0;
        this.p4_done = true;
        this.hide_p4 = true;
        this.overtime_button = false;
        this.vibration.vibrate(200);
        // this.nativeAudio.play('ding');
        this.audio.play('tabSwitch');
      }
      this.percent4 = this.elapsed / duration;
      this.elapsed++;
    }, 1000);
  }
*/
  addTime(time: number) {
    this.overtime = false;
    this.overtime_button = true;
    this.m = Math.floor(time / 60);
    this.s = time - this.m * 60;
    this.timer = setInterval(() => {
      if (this.elapsed === time) {
        clearInterval(this.timer);
        this.overtime = true;
        this.overtime_button = false;
        this.elapsed = 0;
        this.vibration.vibrate(200);
        // this.nativeAudio.play('ding');
        this.audio.play('tabSwitch');
      }
      this.elapsed++;
      this.m = Math.floor((time - this.elapsed) / 60);
      this.s = (time - this.elapsed) - this.m * 60;
    }, 1000);
  }

  resetTimer() {
    this.color = 'danger';
    this.toast.show(
      `Press again to reset.`,
      '2000',
      'center')
      .subscribe(toast => {
          // console.log(JSON.stringify(toast));
      });

    const confirm$ = fromEvent(document.getElementById('reset'), 'click');
    this.reset_id = 'reset';
    const timer$ = timer(4000);

    confirm$
      .pipe(
        takeUntil(timer$)
      )
      .subscribe(() => {
        console.log('ready to delete');
        this.color = 'primary';
        this.stop_timer = true;
        this.reset();
      });

    timer$
      .subscribe(() => {
        this.reset_id = 'inactive';
        console.log('timer up');
        this.color = 'primary';
      });
    }

  reset () {
    this.percent1 = 0;
    this.percent2 = 0;
    this.percent3 = 0;
    this.percent4 = 0;
    this.hide_p1 = false;
    this.hide_p2 = false;
    this.hide_p3 = false;
    this.hide_p4 = false;
    this.disable_click_p1 = false;
    this.disable_click_p2 = true;
    this.disable_click_p3 = true;
    this.disable_click_p4 = true;
    this.seconds = 0;
    this.p1 = 'Tap to start';
    this.p2 = 'Disabled';
    this.p3 = 'Disabled';
    this.p4 = 'Disabled';
    this.p1_done = false;
    this.p2_done = false;
    this.p3_done = false;
    this.p4_done = false;
    this.timer = false;
    this.elapsed = 0;
  }

}
