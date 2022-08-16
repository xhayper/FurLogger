import { ChannelType, DMChannel, GuildChannel } from "discord.js";
import { BotClient } from "../structure/BotClient";
import { TypedEvent } from "../structure/Event";

export default TypedEvent({
    eventName: "channelDelete",
    on: (client: BotClient<true>, channel: GuildChannel | DMChannel) => {
        if (channel.type != ChannelType.GuildText) return;
        client.logger.debug(`Channel deleted in "${channel.guild.name}"!\n`, channel);
    }
});
