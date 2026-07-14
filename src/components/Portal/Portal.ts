import { gsap } from 'gsap';
import { FocusTrap } from '../../ui/FocusTrap';
import { Logger } from '../../core/Logger';

export class Portal {
  private static releaseFocus: (() => void) | null = null;

  static init(): void {
    const portal = document.getElementById('portal');
    const btn = document.getElementById('portal-btn') as HTMLButtonElement | null;
    const title = portal?.querySelector('.portal-title');
    const sub = portal?.querySelector('.portal-sub');
    const hint = portal?.querySelector('.portal-hint');
    const heart = portal?.querySelector('.portal-heart');

    if (!portal || !btn) {
      Logger.warn('Portal', 'Elements not found');
      return;
    }

    this.releaseFocus = FocusTrap.trap(portal, btn);

    if (heart) {
      gsap.set(heart, { opacity: 0, scale: 0.5 });
      gsap.to(heart, { opacity: 1, scale: 1, duration: 1.2, ease: 'back.out(1.7)', delay: 0.3 });
    }

    if (title) {
      gsap.set(title, { opacity: 0, y: 20 });
      gsap.to(title, { opacity: 1, y: 0, duration: 1, ease: 'power2.out', delay: 0.6 });
    }

    if (sub) {
      gsap.set(sub, { opacity: 0, y: 15 });
      gsap.to(sub, { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out', delay: 0.9 });
    }

    gsap.set(btn, { opacity: 0, y: 10 });
    gsap.to(btn, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 1.1 });

    if (hint) {
      gsap.set(hint, { opacity: 0 });
      gsap.to(hint, { opacity: 0.4, duration: 0.6, delay: 1.4 });
    }

    btn.addEventListener('click', () => {
      gsap.to(portal, {
        opacity: 0,
        scale: 1.08,
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: () => {
          portal.style.display = 'none';
          if (this.releaseFocus) {
            this.releaseFocus();
            this.releaseFocus = null;
          }
          const book = document.getElementById('book');
          if (book) {
            book.setAttribute('tabindex', '-1');
            book.focus();
          }
        },
      });
    });
  }
}
