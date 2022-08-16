import { GuildChannel } from "discord.js";
import { BotClient } from "../structure/BotClient";
import { TypedEvent } from "../structure/Event";

export default TypedEvent({
    eventName: "channelCreate",
    on: (client: BotClient<true>, channel: GuildChannel) => {
        client.logger.debug(`Channel created in "${channel.guild.name}"!\n`, channel);
    }
});
