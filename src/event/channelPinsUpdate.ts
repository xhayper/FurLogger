import { AuditLogEvent, TextBasedChannel } from "discord.js";
import { BotClient } from "../structure/BotClient";
import { TypedEvent } from "../structure/Event";

export default TypedEvent({
    eventName: "channelPinsUpdate",
    // TODO: This solution is painfully slow
    on: async (client: BotClient<true>, channel: TextBasedChannel) => {
        client.logger.debug("[channelPinsUpdate]", "RECIEVED EVENT");

        if (channel.isDMBased()) return;

        const oldPinnedMessages = client.cacheManager.pinCache.get(channel.id) ?? [];
        let time = Date.now();
        const newPinnedMessages = await client.cacheManager.fetchChannelPin(channel);
        client.logger.debug("[channelPinsUpdate]", "FETCH NEW PIN, TOOK", (Date.now() - time) / 1000, "s");

        const pinned = newPinnedMessages.length > oldPinnedMessages.length;

        time = Date.now();
        const executor = (
            await client.utility.fetchSingleAuditEntry(
                channel.guild,
                pinned ? AuditLogEvent.MessagePin : AuditLogEvent.MessageUnpin
            )
        )?.executor;
        client.logger.debug("[channelPinsUpdate]", "FETCH AUDIT, TOOK", (Date.now() - time) / 1000, "s");

        time = Date.now();
        const moderator = executor ? await channel.guild.members.fetch({ user: executor, limit: 1 }) : null;
        client.logger.debug("[channelPinsUpdate]", "FETCH GUILD MEMBER, TOOK", (Date.now() - time) / 1000, "s");

        const theMessage = pinned
            ? newPinnedMessages.find((message) => !oldPinnedMessages.includes(message))
            : oldPinnedMessages.find((message) => !newPinnedMessages.includes(message));

        time = Date.now();
        await channel.send({
            embeds: [
                {
                    description: `${moderator?.user} ${pinned ? "pinned" : "unpinned"} a message!\nOld Pinned Amount: ${
                        oldPinnedMessages.length
                    }\nNew Pinned Amount: ${newPinnedMessages.length}\n[Jump to message](${theMessage?.url})`
                }
            ]
        });
        client.logger.debug("[channelPinsUpdate]", "SEND MESSAGE, TOOK", (Date.now() - time) / 1000, "s");
    }
});
