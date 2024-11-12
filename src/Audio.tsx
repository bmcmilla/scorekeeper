import { Howl } from 'howler';

export class AudioPlayer {

  private sadTrombone: Howl;
  private applause: Howl;

  async playSadTrombone() {
    if (!this.sadTrombone) {
      this.sadTrombone = new Howl({
        src: ['./mixkit-sad-game-over-trombone-471.m4a', './mixkit-sad-game-over-trombone-471.wav'],
        autoplay: false,
        loop: false,
      });
    }
    this.sadTrombone.play();
  }

  async playApplause() {
    if (!this.applause) {
      this.applause = new Howl({
        src: ['./mixkit-end-of-show-clapping-crowd-477.m4a', './mixkit-end-of-show-clapping-crowd-477.wav'],
        autoplay: false,
        loop: false,
      });
    }
    this.applause.play();
  }  
}



