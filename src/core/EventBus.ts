import type { EventMap, EventName, EventCallback } from '../types/events';

export class EventBus {
  private static listeners: Map<string, Set<EventCallback>> = new Map();

  static on<K extends EventName>(event: K, callback: EventCallback<EventMap[K]>): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback as EventCallback);
  }

  static off<K extends EventName>(event: K, callback: EventCallback<EventMap[K]>): void {
    this.listeners.get(event)?.delete(callback as EventCallback);
  }

  static emit<K extends EventName>(event: K, data?: EventMap[K]): void {
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

  static clear(): void {
    this.listeners.clear();
  }
}
