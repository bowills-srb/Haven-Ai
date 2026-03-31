import { CalendarEvent, SEED_EVENTS } from "./warranty";

let store: CalendarEvent[] = [...SEED_EVENTS];

export function getEvents(): CalendarEvent[] {
  return [...store];
}

export function addEvent(event: CalendarEvent): void {
  if (!store.some((e) => e.id === event.id)) {
    store.push(event);
  }
}
