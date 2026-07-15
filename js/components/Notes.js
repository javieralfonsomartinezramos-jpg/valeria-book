console.log(`%c[FORENSIC] MODULE LOADED — js/components/Notes.js`, 'color:#27ae60;font-weight:bold');

const _fB = () => window.__FORENSIC;
const _fVT = () => `[${(performance.now() - (_fB()?.t0 || performance.now())).toFixed(2)}ms]`;
const _fW = (fn, label, path) => function(...args) {
  const _t0 = performance.now(); const _ts = () => `[${(performance.now() - (_fB()?.t0 || _t0)).toFixed(2)}ms]`;
  console.groupCollapsed(`${_ts()} [FN] ${path} → ${label}`);
  try {
    const r = fn.apply(this, args);
    if (r instanceof Promise) { r.then(v => { console.log(`${_ts()} [FN] ✓ ${label} — resolved in ${(performance.now()-_t0).toFixed(2)}ms`); console.groupEnd(); return v; }, e => { console.error(`${_ts()} [FN] 🚨 ${label} — rejected: ${e?.message||e}`); console.groupEnd(); throw e; }); }
    else { console.log(`${_ts()} [FN] ✓ ${label} — completed in ${(performance.now()-_t0).toFixed(2)}ms`); console.groupEnd(); }
    return r;
  } catch(e) { console.error(`${_ts()} [FN] 🚨 ${label} — exception: ${e?.message||e}`); console.trace(); console.groupEnd(); throw e; }
};

import { StorageManager } from '../core/StorageManager.js';
import { sanitize } from '../core/Utils.js';
import { Lightbox } from './Lightbox.js';
import { DOMManager } from '../managers/DOMManager.js';

export class Notes {
  static render() {
    const list = DOMManager.get('notes-list');
    const ta = DOMManager.get('notes-ta');
    const saveBtn = DOMManager.get('notes-save');
    if (!list) return;

    const notes = StorageManager.getNotes();
    list.innerHTML = '';

    notes.forEach((note, i) => {
      const item = document.createElement('div');
      item.className = 'note-item';
      item.innerHTML = '<span>' + sanitize(note) + '</span><button class="note-del" data-idx="' + i + '" aria-label="Eliminar nota">\u2715</button>';
      item.querySelector('.note-del').addEventListener('click', () => {
        const all = StorageManager.getNotes();
        all.splice(i, 1);
        StorageManager.setNotes(all);
        Notes.render();
      });
      list.appendChild(item);
    });

    Lightbox.renderFavs();

    if (saveBtn && ta && !saveBtn._notesBound) {
      saveBtn._notesBound = true;
      saveBtn.addEventListener('click', () => {
        const text = ta.value.trim();
        if (!text) return;
        const all = StorageManager.getNotes();
        all.push(sanitize(text));
        StorageManager.setNotes(all);
        ta.value = '';
        Notes.render();
      });
    }
  }
}

Notes.render = _fW(Notes.render.bind(Notes), 'render', 'js/components/Notes.js');
