import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Toast } from '@ionic-native/toast/ngx';
import { fromEvent, timer, interval } from 'rxjs';
import { takeUntil, map, subscribeOn } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';
import { AudioService } from '../shared/audio.service';
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
  seconds = 0;
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
  clickable: boolean = false;

  facts = [
    'Coffees from Rwanda often have a fruitinesss reminicent of red apples and red grapes',
    'Slow roasted coffee is considered the best',
    'Coffee is better than tea'
  ];
  init_recipes = {
    'recipes': [
      {
        'id': '14900c38-53d1-4665-bc8c-3d61008ec711',
        'name': 'Brazil Santos',
        'variant': 'Test',
        'size': 100,
        'description': 'yummy',
        'starttemp': 190,
        'maintemp': 235,
        'intervals': [5, 4, 3, 2]
      },
      {
        'id': '14900c38-53d1-4665-bc8c-3d61008eb744',
        'name': 'Brazil Santos',
        'variant': 'Medium',
        'size': 100,
        'description': 'yummy',
        'starttemp': 190,
        'maintemp': 235,
        'intervals': [240, 200, 200, 200]
      },
      {
        'id': 'e758896c-32ff-440f-a79a-6f642afcb245',
        'name': 'Brazil Catuai',
        'variant': 'Dark',
        'size': 100,
        'description': 'also yummy',
        'starttemp': 190,
        'maintemp': 235,
        'intervals': [250, 180, 180, 180]
      },
      {
        'id': 'b55390a1-1fa6-426a-bad9-8319a241f26f',
        'name': 'Brazil Catuai',
        'variant': 'Medium',
        'size': 100,
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
  current_roast_phase: number;
  total_roast_phases: number;
  initial_display: boolean = true;
  roasting_display: boolean = false;
  done_display: boolean = false;
  display_time: number = 0;
  recipes: any[] = [];
  current_recipe;
  tick_timer = interval(3000);


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
    this.nativeAudio.preloadSimple('tick', 'assets/Tick.mp3');
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
    const id = $event.target.value;
    this.roasting_display = false;
    this.done_display = false;
    console.log(id);
    // this.current_recipe =  this.recipes['recipes'][id]['intervals'];
    this.current_recipe = this.recipes.filter(obj => {
      return obj.id === id;
    });
    this.total_roast_phases = Object.keys(this.current_recipe[0].intervals).length;
    console.log(this.current_recipe);
    this.overtime_button = true;
    this.startAlert();
  }

  async startAlert() {
    this.current_roast_phase++;
    this.initial_display = false;
    this.roasting_display = true;
    this.current_roast_phase = 0;
    const temp = this.current_recipe[0].starttemp;
    const temp_unit = 'C';
    const roasts: string = Object.values(this.current_recipe[0].intervals).join(', ');
    const alert = await this.alertController.create({
      header: this.current_recipe[0].name + ': ' + this.current_recipe[0].variant,
      message: this.total_roast_phases + ' roastings (' + roasts + ') starting at ' + temp + ' °' + temp_unit,
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
          console.log('Confirm Cancel');
        }
        },
        {
          text: 'Start roasting',
          handler: () => {
            console.log('Confirm Okay');
            this.startOvenTempAlert();
          }
        }]
    });
    await alert.present();
  }

  async startOvenTempAlert() {
    const time = this.current_recipe[0].intervals[0];
    const temp = this.current_recipe[0].maintemp;
    const temp_unit = 'C';
    const alert = await this.alertController.create({
      header: 'Set oven temperature',
      message: 'Set the oven temperature to ' + temp + ' °' + temp_unit,
      buttons: [{
        text: 'Done',
        handler: () => {
          console.log('Confirm Okay');
          this.startTimer(time);
        }
      }]
    });
    await alert.present();
  }

  async roastPauseAlert() {
    const tick_subscribe = this.tick_timer.subscribe(x => {
      this.nativeAudio.play('tick');
    });
    const next_roast_phase: number = this.current_roast_phase;
    const time = this.current_recipe[0].intervals[next_roast_phase];
    console.log(time);
    const temp_unit = 'C';
    const alert = await this.alertController.create({
      header: 'Quick pause',
      message: 'Ready for phase  ' + (next_roast_phase + 1) + '?',
      buttons: [{
        text: 'Let\'s go',
        handler: () => {
          tick_subscribe.unsubscribe();
          this.startTimer(time);
          console.log('Confirm Okay');
        }
      }]
    });
    await alert.present();
  }

  startTimer(duration: number) {
    this.current_roast_phase++;
    this.display_time = duration;
    const numbers = interval(1000);
    const subscribe = numbers.subscribe(x => {
      duration--;
      this.display_time = duration;
      if (duration === 0) {
        if (this.current_roast_phase === this.total_roast_phases) {
          this.done_display = true;
          this.roasting_display = false;
          this.overtime_button = false;
          this.vibration.vibrate(200);
          this.nativeAudio.play('ding');
        } else {
          this.vibration.vibrate(200);
          this.nativeAudio.play('ding');
          this.roastPauseAlert();
        }

      }
    });
    setTimeout(() => subscribe.unsubscribe(), duration * 1000);
  }


  backButtonEvent() {
    this.platform.backButton.subscribe(async () => {
      this.toast.show(
        `Press back again to exit.`,
        '2000',
        'center')
        .subscribe(toast => {
            // console.log(JSON.stringify(toast));
            // navigator[‘app’].exitApp()
        });
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
          // navigator[‘app’].exitApp();
        });

      timer$
        .subscribe(() => {
          this.reset_id = 'inactive';
          console.log('timer up');
          this.color = 'primary';
        });
      }


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

  minutesSeconds(seconds: number) {
    this.m = Math.floor(seconds / 60);
    this.s = seconds - this.m * 60;
    let sec = String(this.s);
    if (sec.length === 1) {
      sec = '0' + sec;
    }
    const ms = String(this. m) + ':' + sec;
    return ms;
  }
/*
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
    this.seconds = 0;
    this.timer = false;
    this.elapsed = 0;
  }
*/
}
