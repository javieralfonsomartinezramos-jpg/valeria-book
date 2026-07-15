import { FocusTrap } from '../ui/FocusTrap.js';
import { Logger } from '../core/Logger.js';

let releaseFocus = null;

export class Portal {
  static init() {
    const portal = document.getElementById('portal');
    const btn = document.getElementById('portal-btn');
    if (!portal || !btn) { Logger.warn('Portal', 'Elements not found'); return; }
    releaseFocus = FocusTrap.trap(portal, btn);
  }

  static close() {
    const portal = document.getElementById('portal');
    if (!portal) return;
    if (window.gsap) {
      gsap.to(portal, {
        opacity: 0, scale: 1.08, duration: 0.8, ease: 'power2.inOut',
        onComplete: () => {
          portal.style.display = 'none';
          if (releaseFocus) releaseFocus();
          const book = document.getElementById('book');
          if (book) { book.tabIndex = -1; book.focus(); }
        },
      });
    } else {
      portal.style.display = 'none';
      if (releaseFocus) releaseFocus();
    }
  }
}
