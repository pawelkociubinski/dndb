import { DomainEvent, IEvent } from "../../domain/events/index.js";

export class InMemorEventStoreAdapter implements DomainEvent {
  events: { [key: string]: Array<(event: IEvent) => void> } = {};

  subscribe(eventType: string, listener: (event: IEvent) => void): void {
    if (!this.events[eventType]) {
      this.events[eventType] = [];
    }
    this.events[eventType].push(listener);
  }

  emit(event: IEvent): void {
    const listeners = this.events[event.type];

    if (!listeners) {
      return;
    }

    listeners.forEach((listener) => listener(event));
  }
}
