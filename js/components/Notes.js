import { StorageManager } from '../core/StorageManager.js';
import { sanitize } from '../core/Utils.js';
import { EventBus } from '../core/EventBus.js';
import { Lightbox } from './Lightbox.js';

export class Notes {
  static bound = false;

  static init() {
    EventBus.on('ui:reach-notes', () => this.render());
  }

  static render() {
    const list = document.getElementById('notes-list');
    const ta = document.getElementById('notes-ta');
    const saveBtn = document.getElementById('notes-save');
    if (!list) return;

    const notes = StorageManager.getNotes();
    list.innerHTML = '';

    notes.forEach((note, i) => {
      const item = document.createElement('div');
      item.className = 'note-item';
      const textSpan = document.createElement('span');
      textSpan.textContent = note;
      const delBtn = document.createElement('button');
      delBtn.className = 'note-del';
      delBtn.textContent = '\u2715';
      delBtn.setAttribute('aria-label', 'Eliminar nota');
      delBtn.addEventListener('click', () => {
        const all = StorageManager.getNotes();
        all.splice(i, 1);
        StorageManager.setNotes(all);
        Notes.render();
      });
      item.appendChild(textSpan);
      item.appendChild(delBtn);
      list.appendChild(item);
    });

    Lightbox.renderFavs();

    if (saveBtn && ta && !this.bound) {
      this.bound = true;
      saveBtn.addEventListener('click', () => {
        const text = ta.value.trim();
        if (!text) return;
        const safe = sanitize(text);
        const all = StorageManager.getNotes();
        all.push(safe);
        StorageManager.setNotes(all);
        ta.value = '';
        this.render();
      });
    }
  }
}
