
export default class Animation {

  constructor() {
    this.animation = null;
    this.playInterval = null;
    this.playState = true;
  }

  create() {
    this.destroy();
    this.animation =  bodymovin.loadAnimation({
                        wrapper: document.getElementById('anim'),
                        animType: 'svg',
                        loop: true,
                        autoplay: !this.playState,
                        animationData: animData
                      });
  };
  onFrameChange(callBack) {
    this.animation.addEventListener('enterFrame', (e) => {
        callBack(Math.trunc(this.animation.currentFrame), this.animation.frameRate);
    });
  }
  onPlayChange(callBack) {
    this.playInterval = setInterval(function() {
      if (this.animation.isPaused !== this.playState){
        this.playState = this.animation.isPaused;
        callBack(this.playState);
      }
    }.bind(this), 200);
  }
  togglePlay() {
    if (this.animation) {
      this.animation.isPaused ? this.animation.play() : this.animation.pause();
      return !this.animation.isPaused;
    }
  }
  pause() {
    this.animation.pause();
  }
  stop() {
    if (this.animation) this.animation.stop();
  }
  goToAndStop(value, isFrame) {
    this.animation.goToAndStop(value, isFrame);
  }
  step(fwd, frames = 1) {
    if (this.animation) {
      var op = fwd ? (a,b) => (a + b) : (a,b) => (a - b);
      this.animation.goToAndStop(op(this.animation.currentFrame, frames) % this.animation.totalFrames, true);
    }
  }
  exists() {
    return !!this.animation;
  }
  getTotalFrames() {
    return this.animation.totalFrames
  }
  getSpeed() {
    return this.animation ? this.animation.playSpeed : -1;
  }
  setSpeed(s) {
    if(this.animation) this.animation.setSpeed(s)
  }
  setDirection(d) {
    if(this.animation) bodymovin.setDirection(d);
  }
  destroy() {
    if (this.animation) {
      this.animation.destroy();
      this.animation = null;
      clearInterval(this.playInterval);
    }
  }

}
