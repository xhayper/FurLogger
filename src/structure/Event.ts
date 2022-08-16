import { ClientEvents } from "discord.js";
import { BotClient } from "./BotClient";

export const AllowedLogEvent = [
    "channelCreate",
    "channelDelete",
    // "channelPinsUpdate",
    "channelUpdate",
    "emojiCreate",
    "emojiDelete",
    "emojiUpdate",
    "guildBanAdd",
    "guildBanRemove",
    "guildIntegrationsUpdate",
    "guildMemberAdd",
    "guildMemberRemove",
    "guildMemberUpdate",
    "guildUpdate",
    "inviteCreate",
    "inviteDelete",
    "messageDelete",
    "messageReactionRemoveAll",
    "messageReactionRemoveEmoji",
    "messageDeleteBulk",
    "messageReactionAdd",
    "messageReactionRemove",
    "messageUpdate",
    "roleCreate",
    "roleDelete",
    "roleUpdate",
    "threadCreate",
    "threadDelete",
    "threadListSync",
    "threadMemberUpdate",
    "threadMembersUpdate",
    "threadUpdate",
    "voiceStateUpdate",
    "webhookUpdate",
    "stageInstanceCreate",
    "stageInstanceUpdate",
    "stageInstanceDelete",
    "stickerCreate",
    "stickerDelete",
    "stickerUpdate",
    "guildScheduledEventCreate",
    "guildScheduledEventUpdate",
    "guildScheduledEventDelete",
    "guildScheduledEventUserAdd",
    "guildScheduledEventUserRemove"
] as const;

export type AllowedLogEventType = typeof AllowedLogEvent[number];

export type EventName = keyof ClientEvents;

export type EventListener<E extends EventName> = (client: BotClient, ...args: ClientEvents[E]) => void;

export interface Event<E extends EventName = any> {
    eventName: E;
    on?: EventListener<E>;
    once?: EventListener<E>;
}

export const TypedEvent = <T extends EventName>(event: Event<T>) => event;
