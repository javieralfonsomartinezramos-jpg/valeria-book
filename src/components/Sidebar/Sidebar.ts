import { CHAPTERS } from '../../config';
import { sanitize } from '../../core/Utils';
import { FocusTrap } from '../../ui/FocusTrap';
import { Logger } from '../../core/Logger';
import { goToSpread } from '../Book/BookEngine';
import { getCurrentSpread } from '../Book/BookUI';

export class Sidebar {
  private static open = false;
  private static releaseFocus: (() => void) | null = null;
  private static prevFocus: HTMLElement | null = null;

  static init(): void {
    this.buildIndex();
    this.bindEvents();
  }

  static buildIndex(): void {
    const list = document.getElementById('index-list');
    if (!list) return;

    list.innerHTML = CHAPTERS.map((ch) => {
      const active = ch.spread === getCurrentSpread();
      return `<li><a href="#" data-spread="${ch.spread}" class="index-link${active ? ' active' : ''}">${sanitize(ch.name)}</a></li>`;
    }).join('');

    list.querySelectorAll('.index-link').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const s = parseInt((link as HTMLElement).dataset.spread || '0', 10);
        if (s !== getCurrentSpread()) goToSpread(s);
        this.close();
      });
    });
  }

  static toggle(): void {
    this.open = !this.open;
    const sb = document.getElementById('sidebar');
    if (!sb) return;
    sb.classList.toggle('open', this.open);
    sb.hidden = !this.open;

    if (this.open) {
      this.buildIndex();
      this.prevFocus = document.activeElement as HTMLElement;
      this.releaseFocus = FocusTrap.trap(sb, document.getElementById('sidebar-close'));
    } else {
      this.cleanup();
    }
  }

  static close(): void {
    if (!this.open) return;
    this.open = false;
    const sb = document.getElementById('sidebar');
    if (sb) {
      sb.classList.remove('open');
      sb.hidden = true;
    }
    this.cleanup();
  }

  private static cleanup(): void {
    if (this.releaseFocus) { this.releaseFocus(); this.releaseFocus = null; }
    if (this.prevFocus) { this.prevFocus.focus(); this.prevFocus = null; }
  }

  private static bindEvents(): void {
    const btnIndex = document.getElementById('btn-index');
    if (btnIndex) btnIndex.addEventListener('click', () => this.toggle());
    else Logger.warn('Sidebar', 'btn-index not found');

    const closeBtn = document.getElementById('sidebar-close');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());

    document.addEventListener('click', (e) => {
      const sb = document.getElementById('sidebar');
      if (this.open && sb && !sb.contains(e.target as Node) && e.target !== btnIndex) this.close();
    });


  }

}
