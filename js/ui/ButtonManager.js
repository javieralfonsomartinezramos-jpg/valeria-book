import { Logger } from '../core/Logger.js';

export class ButtonManager {
  static bound = new Set();

  static register(defs) {
    defs.forEach((def) => {
      if (this.bound.has(def.id)) return;
      const el = document.getElementById(def.id);
      if (!el) {
        Logger.warn('ButtonManager', `Button #${def.id} not found in DOM`);
        return;
      }
      el.addEventListener(def.eventType || 'click', def.onClick);
      this.bound.add(def.id);
    });
  }
}
