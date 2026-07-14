export class EventBus {
  static listeners = new Map();

  static on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
  }

  static off(event, callback) {
    this.listeners.get(event)?.delete(callback);
  }

  static offAll(event) {
    this.listeners.delete(event);
  }

  static emit(event, data) {
    const cbs = this.listeners.get(event);
    if (!cbs) return;
    cbs.forEach((cb) => {
      try {
        cb(data);
      } catch (e) {
        console.error(`[EventBus] Error in handler for "${event}":`, e);
      }
    });
  }

  static clear() {
    this.listeners.clear();
  }
}
