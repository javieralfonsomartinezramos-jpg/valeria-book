import { Logger } from '../core/Logger';

export interface ButtonDef {
  id: string;
  onClick: (e: Event) => void;
  eventType?: string;
}

export class ButtonManager {
  private static bound = new Set<string>();

  static register(defs: ButtonDef[]): void {
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
