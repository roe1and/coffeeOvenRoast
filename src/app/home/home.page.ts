import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Toast } from '@ionic-native/toast/ngx';
import { takeUntil } from 'rxjs/operators';
import { fromEvent, pipe, timer } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
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

  constructor (
    private insomnia: Insomnia,
    private nativeAudio: NativeAudio,
    private vibration: Vibration,
    private screenOrientation: ScreenOrientation,
    private toast: Toast,
    private platform: Platform,
    ) {
    this.insomnia.keepAwake();
    this.nativeAudio.preloadSimple('ding', 'assets/Bell-sound-effect-ding.mp3');
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    this.backButtonEvent();
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

  startTimer1 (duration: number) {
    this.m = 0;
    this.s = 0;
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
        this.nativeAudio.play('ding');
      }
      if (this.stop_timer === true) {
        console.log('stop');
        clearInterval(this.timer);
        this.elapsed = 0;
        this.stop_timer = false;
      }
      this.percent1 = this.elapsed / duration;
      this.elapsed++;
      this.m = Math.floor((duration - this.elapsed) / 60);
      this.s = (duration - this.elapsed) - this.m * 60;
      console.log(this.m, this.s);
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
        this.nativeAudio.play('ding');
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
        this.nativeAudio.play('ding');
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
        this.vibration.vibrate(200);
        this.nativeAudio.play('ding');
      }
      this.percent4 = this.elapsed / duration;
      this.elapsed++;
    }, 1000);
  }

  delete() {
    this.color = 'danger';
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
