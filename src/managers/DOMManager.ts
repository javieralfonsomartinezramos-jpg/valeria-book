const cache = new Map<string, HTMLElement | null>();
const clickDelegates: [string, (e: Event) => void][] = [];
const keyDelegates: [string, (e: Event) => void][] = [];

function match(el: EventTarget | null, selector: string): boolean {
  if (selector === '*') return true;
  const target = el as HTMLElement | null;
  return target?.matches?.(selector) || !!target?.closest?.(selector);
}

function onClick(e: Event): void {
  for (const [sel, fn] of clickDelegates) {
    if (match(e.target, sel) && !e.defaultPrevented) fn(e);
  }
}

function onKey(e: Event): void {
  for (const [sel, fn] of keyDelegates) {
    if (match(e.target, sel) && !e.defaultPrevented) fn(e);
  }
}

export class DOMManager {
  static init(): void {
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
  }

  static destroy(): void {
    document.removeEventListener('click', onClick);
    document.removeEventListener('keydown', onKey);
    cache.clear();
    clickDelegates.length = 0;
    keyDelegates.length = 0;
  }

  static get(id: string): HTMLElement | null {
    if (cache.has(id)) {
      return cache.get(id) ?? null;
    }
    const el = document.getElementById(id);
    cache.set(id, el);
    return el;
  }

  static getAll(ids: string[]): (HTMLElement | null)[] {
    return ids.map(id => this.get(id));
  }

  static clearCache(id?: string): void {
    if (id) {
      cache.delete(id);
    } else {
      cache.clear();
    }
  }

  static onClick(selector: string, handler: (e: Event) => void): void {
    clickDelegates.push([selector, handler]);
  }

  static onKey(selector: string, handler: (e: Event) => void): void {
    keyDelegates.push([selector, handler]);
  }

  static removeClick(selector: string, handler: (e: Event) => void): void {
    const i = clickDelegates.findIndex(([s, h]) => s === selector && h === handler);
    if (i >= 0) clickDelegates.splice(i, 1);
  }

  static removeKey(selector: string, handler: (e: Event) => void): void {
    const i = keyDelegates.findIndex(([s, h]) => s === selector && h === handler);
    if (i >= 0) keyDelegates.splice(i, 1);
  }
}
