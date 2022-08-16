import { AuditLogEvent, GuildChannel } from "discord.js";
import { BotClient } from "../structure/BotClient";
import { TypedEvent } from "../structure/Event";
import { ExtendedGuild } from "../structure/ExtendedGuild";

export default TypedEvent({
    eventName: "channelCreate",
    on: async (client: BotClient<true>, channel: GuildChannel) => {
        const executor = (await client.utility.fetchSingleAuditEntry(channel.guild, AuditLogEvent.ChannelCreate))
            ?.executor;
        const moderator = executor ? await channel.guild.members.fetch({ user: executor, limit: 1 }) : null;

        if (channel.isTextBased()) channel.send(`${moderator} created this channel!`);

        // const a = new ExtendedGuild(client, channel.guild);
        // console.log(await a.getTemplateString("channelCreate"));
    }
});
