import { FocusTrap } from '../../ui/FocusTrap';
import { Logger } from '../../core/Logger';

export class Portal {
  private static releaseFocus: (() => void) | null = null;

  static init(): void {
    const portal = document.getElementById('portal');
    const btn = document.getElementById('portal-btn') as HTMLButtonElement | null;

    if (!portal || !btn) {
      Logger.warn('Portal', 'Elements not found');
      return;
    }

    this.releaseFocus = FocusTrap.trap(portal, btn);

    btn.addEventListener('click', () => {
      portal.classList.add('hidden');
      if (this.releaseFocus) {
        this.releaseFocus();
        this.releaseFocus = null;
      }
      setTimeout(() => {
        portal.style.display = 'none';
        const book = document.getElementById('book');
        if (book) {
          book.setAttribute('tabindex', '-1');
          book.focus();
        }
      }, 800);
    });
  }
}
