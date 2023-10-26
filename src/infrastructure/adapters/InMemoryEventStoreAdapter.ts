import { DomainEvent, Event } from "../../domain/events/index.js";

export class InMemorEventStoreAdapter implements DomainEvent {
  events: Event[] = [];

  private push(event: Event) {
    this.events.push(event);
  }

  emit<T extends Event>(event: T) {
    this.push(event);
    return event;
  }

  getEvent() {}
}
