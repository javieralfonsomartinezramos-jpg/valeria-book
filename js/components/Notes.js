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
