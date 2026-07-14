export class FocusTrap {
  private static handler: ((e: KeyboardEvent) => void) | null = null;

  static trap(container: HTMLElement, firstEl?: HTMLElement | null): () => void {
    const sel = 'a[href], button:not([disabled]), textarea, input:not([type="hidden"]), [tabindex]:not([tabindex="-1"])';
    const els = Array.from(container.querySelectorAll<HTMLElement>(sel));
    const first = els[0];
    const last = els[els.length - 1];

    this.handler = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (!first || !last) return;
      if (e.shiftKey) {
        if (document.activeElement === first || document.activeElement === container) {
          e.preventDefault();
          (last || first).focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    container.addEventListener('keydown', this.handler);
    requestAnimationFrame(() => (firstEl || first || container).focus());

    return () => {
      if (this.handler) {
        container.removeEventListener('keydown', this.handler);
        this.handler = null;
      }
    };
  }
}
