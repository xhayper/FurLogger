import { ClientEvents } from "discord.js";
import { BotClient } from "./BotClient";

export type EventName = keyof ClientEvents;

export type EventListener<E extends EventName> = (client: BotClient, ...args: ClientEvents[E]) => void;

export interface Event<E extends EventName = any> {
    eventName: E;
    on?: EventListener<E>;
    once?: EventListener<E>;
}

export const TypedEvent = <T extends EventName>(event: Event<T>) => event;
