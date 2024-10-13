import { Howl } from 'howler';

export class AudioPlayer {

  private sound: Howl;

  async play() {
    if (!this.sound) {
      this.sound = new Howl({
        src: ['./mixkit-sad-game-over-trombone-471.m4a', './mixkit-sad-game-over-trombone-471.wav'],
        autoplay: false,
        loop: false,
        onend: () => {
          console.log('Finished playing!');
        }
      });
    }
    this.sound.play();
  }
}



