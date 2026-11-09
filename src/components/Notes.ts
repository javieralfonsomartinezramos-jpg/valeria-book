console.log(`%c[FORENSIC] MODULE LOADED — js/components/Notes.js`, 'color:#27ae60;font-weight:bold');

const _fB = () => window.__FORENSIC;
const _fVT = () => `[${(performance.now() - (_fB()?.t0 || performance.now())).toFixed(2)}ms]`;
const _fW = <TArgs extends unknown[], TReturn>(fn: (...args: TArgs) => TReturn, label: string, path: string) => function(this: unknown, ...args: TArgs): TReturn {
  const _t0 = performance.now(); const _ts = () => `[${(performance.now() - (_fB()?.t0 || _t0)).toFixed(2)}ms]`;
  console.groupCollapsed(`${_ts()} [FN] ${path} → ${label}`);
  try {
    const r = fn.apply(this, args);
    if (r instanceof Promise) { r.then(v => { console.log(`${_ts()} [FN] ✓ ${label} — resolved in ${(performance.now()-_t0).toFixed(2)}ms`); console.groupEnd(); return v; }, e => { console.error(`${_ts()} [FN] 🚨 ${label} — rejected: ${(e as Error).message||e}`); console.groupEnd(); throw e; }); }
    else { console.log(`${_ts()} [FN] ✓ ${label} — completed in ${(performance.now()-_t0).toFixed(2)}ms`); console.groupEnd(); }
    return r;
  } catch(e) { console.error(`${_ts()} [FN] 🚨 ${label} — exception: ${(e as Error).message||e}`); console.trace(); console.groupEnd(); throw e; }
};

import { StorageManager } from '../core/StorageManager.js';
import { sanitize } from '../core/Utils.js';
import { Lightbox } from './Lightbox.js';
import { DOMManager } from '../managers/DOMManager.js';
import type { NoteEntry } from '../types/index.js';

export class Notes {
  static render(): void {
    const list = DOMManager.get('notes-list');
    const ta = DOMManager.get('notes-ta') as HTMLTextAreaElement | null;
    const nameInput = DOMManager.get('notes-name') as HTMLInputElement | null;
    const saveBtn = DOMManager.get('notes-save');
    const status = DOMManager.get('notes-status');
    if (!list) return;

    const notes = StorageManager.getNotes();
    list.innerHTML = '';

    notes.forEach((note, i) => {
      const item = document.createElement('div');
      item.className = 'note-item';
      const copy = document.createElement('div');
      copy.className = 'note-copy';
      const author = document.createElement('strong');
      author.className = 'note-author';
      author.textContent = sanitize(note.name);
      const message = document.createElement('p');
      message.className = 'note-message';
      message.textContent = sanitize(note.text);
      copy.append(author, message);
      const deleteButton = document.createElement('button');
      deleteButton.className = 'note-del';
      deleteButton.type = 'button';
      deleteButton.setAttribute('aria-label', 'Eliminar mensaje de ' + sanitize(note.name));
      deleteButton.textContent = '\u2715';
      item.append(copy, deleteButton);
      deleteButton.addEventListener('click', () => {
        const all = StorageManager.getNotes();
        all.splice(i, 1);
        StorageManager.setNotes(all);
        Notes.render();
      });
      list.appendChild(item);
    });

    Lightbox.renderFavs();

    if (saveBtn && ta && nameInput && !(saveBtn as HTMLElement & { _notesBound?: boolean })._notesBound) {
      (saveBtn as HTMLElement & { _notesBound?: boolean })._notesBound = true;
      saveBtn.addEventListener('click', () => {
        const text = ta.value.trim();
        const name = nameInput.value.trim();
        if (!name || !text) {
          if (status) status.textContent = 'Escribe tu nombre y tu mensaje para publicarlo.';
          if (!name) nameInput.focus(); else ta.focus();
          return;
        }
        const all: NoteEntry[] = StorageManager.getNotes();
        all.push({ name: sanitize(name), text: sanitize(text), createdAt: new Date().toISOString() });
        StorageManager.setNotes(all);
        nameInput.value = '';
        ta.value = '';
        if (status) status.textContent = 'Tu mensaje quedó guardado en esta página.';
        Notes.render();
      });
    }
  }
}

Notes.render = _fW(Notes.render.bind(Notes), 'render', 'js/components/Notes.js');
