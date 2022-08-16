import { Collection, Message, Snowflake, TextBasedChannel } from "discord.js";

export class CacheManager {
    // Collection<ChannelId, MessageList>
    pinCache: Collection<Snowflake, Message[]> = new Collection(); // We only need this

    async fetchChannelPin(channel: TextBasedChannel): Promise<Message[]> {
        const pinnedMessage = Array.from((await channel.messages.fetchPinned()).values());
        this.pinCache.set(channel.id, pinnedMessage);
        return pinnedMessage;
    }
}
