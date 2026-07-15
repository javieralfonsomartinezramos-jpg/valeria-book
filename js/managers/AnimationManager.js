const frames = {};
let paused = false;
let saved = {};

export class AnimationManager {
  static init() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        paused = true;
        this._pauseNonEssential();
      } else {
        paused = false;
        this._resumeNonEssential();
      }
    });
  }

  static destroy() {
    Object.keys(frames).forEach(id => this.stop(id));
    document.removeEventListener('visibilitychange', this._handler);
  }

  static register(id, frameId) {
    frames[id] = { frameId, running: true };
  }

  static stop(id) {
    const f = frames[id];
    if (f?.frameId) { cancelAnimationFrame(f.frameId); }
    if (f) f.running = false;
  }

  static isPaused() { return paused; }

  static _pauseNonEssential() {
    ['particles', 'petals'].forEach(id => {
      if (frames[id]?.running) {
        saved[id] = true;
        this.stop(id);
      }
    });
  }

  static _resumeNonEssential() {
    ['particles', 'petals'].forEach(id => {
      if (saved[id] && frames[id]) {
        frames[id].running = true;
      }
    });
    saved = {};
  }
}
