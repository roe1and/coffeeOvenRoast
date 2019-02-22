import { Component } from '@angular/core';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';

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
  percent5: any = 0;
  hide_p1 = false;
  disable_click_p1 = false;
  seconds = 0;
  p1 = 'Tap to start';
  p2 = 'Phase 2';
  p3 = 'Phase 3';
  p4 = 'Phase 4';

  p1_done = false;
  p2_done = false;
  timer: any = false;
  elapsed = 0;

  constructor (
    private insomnia: Insomnia,
    private nativeAudio: NativeAudio,
    private vibration: Vibration
    ) {
    this.insomnia.keepAwake();
    this.nativeAudio.preloadSimple('ding', 'assets/Bell-sound-effect-ding.mp3');
  }

  startTimer1 (duration: number) {
    console.log('clicked');
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
        this.vibration.vibrate(200);
        this.nativeAudio.play('ding');
      }
      this.percent1 = this.elapsed / duration;
      this.elapsed++;
    }, 1000);
  }

  startTimer2 (duration: number) {
    this.timer = false;
    this.percent2 = 0;

    this.timer = setInterval(() => {
      if (this.elapsed === duration) {
        clearInterval(this.timer);
        this.p2 = 'Done';
        this.elapsed = 0;
        this.p2_done = true;
        this.nativeAudio.play('ding');
      }
      this.percent2 = this.elapsed / duration;
      this.elapsed++;
    }, 1000);
  }




}
