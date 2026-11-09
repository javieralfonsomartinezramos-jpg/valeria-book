const frames: Record<string, { frameId: number; running: boolean }> = {};
let paused = false;
let saved: Record<string, boolean> = {};

function _visibilityHandler(): void {
  if (document.hidden) {
    paused = true;
    AnimationManager._pauseNonEssential();
  } else {
    paused = false;
    AnimationManager._resumeNonEssential();
  }
}

export class AnimationManager {
  static init(): void {
    document.addEventListener('visibilitychange', _visibilityHandler);
  }

  static destroy(): void {
    Object.keys(frames).forEach(id => this.stop(id));
    document.removeEventListener('visibilitychange', _visibilityHandler);
  }

  static register(id: string, frameId: number): void {
    frames[id] = { frameId, running: true };
  }

  static stop(id: string): void {
    const f = frames[id];
    if (f?.frameId) {
      cancelAnimationFrame(f.frameId);
    }
    if (f) f.running = false;
  }

  static isPaused(): boolean {
    return paused;
  }

  static _pauseNonEssential(): void {
    ['particles', 'petals'].forEach(id => {
      if (frames[id]?.running) {
        saved[id] = true;
        this.stop(id);
      }
    });
  }

  static _resumeNonEssential(): void {
    ['particles', 'petals'].forEach(id => {
      if (saved[id] && frames[id]) {
        frames[id].running = true;
      }
    });
    saved = {};
  }
}
