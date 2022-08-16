import { AuditLogEvent, ChannelType, DMChannel, GuildChannel } from "discord.js";
import { BotClient } from "../structure/BotClient";
import { TypedEvent } from "../structure/Event";

export default TypedEvent({
    eventName: "channelDelete",
    on: async (client: BotClient<true>, channel: GuildChannel | DMChannel) => {
        if (channel.isDMBased()) return;

        const executor = (await client.utility.fetchSingleAuditEntry(channel.guild, AuditLogEvent.ChannelDelete))
            ?.executor;
        const moderator = executor ? await channel.guild.members.fetch({ user: executor, limit: 1 }) : null;

        client.logger.debug(`${moderator} deleted a channel in "${channel.guild.name}"!\n`, channel);
    }
});
