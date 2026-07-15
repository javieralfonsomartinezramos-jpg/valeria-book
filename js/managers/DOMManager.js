let cache = {};
const clickDelegates = [];
const keyDelegates = [];

function match(el, selector) {
  if (selector === '*') return true;
  return el?.matches?.(selector) || el?.closest?.(selector);
}

function onClick(e) {
  for (const [sel, fn] of clickDelegates) {
    if (match(e.target, sel) && !e.defaultPrevented) fn(e);
  }
}

function onKey(e) {
  for (const [sel, fn] of keyDelegates) {
    if (match(e.target, sel) && !e.defaultPrevented) fn(e);
  }
}

export class DOMManager {
  static init() {
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
  }

  static destroy() {
    document.removeEventListener('click', onClick);
    document.removeEventListener('keydown', onKey);
    cache = {};
    clickDelegates.length = 0;
    keyDelegates.length = 0;
  }

  static get(id) {
    if (!(id in cache)) cache[id] = document.getElementById(id);
    return cache[id];
  }

  static getAll(ids) {
    return ids.map(id => this.get(id));
  }

  static clearCache(id) { delete cache[id]; }

  static onClick(selector, handler) {
    clickDelegates.push([selector, handler]);
  }

  static onKey(selector, handler) {
    keyDelegates.push([selector, handler]);
  }

  static removeClick(selector, handler) {
    const i = clickDelegates.findIndex(([s, h]) => s === selector && h === handler);
    if (i >= 0) clickDelegates.splice(i, 1);
  }

  static removeKey(selector, handler) {
    const i = keyDelegates.findIndex(([s, h]) => s === selector && h === handler);
    if (i >= 0) keyDelegates.splice(i, 1);
  }
}
