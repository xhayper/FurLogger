import { BotClient } from "../structure/BotClient";
import { TypedEvent } from "../structure/Event";

export default TypedEvent({
    eventName: "ready",
    once: async (client: BotClient<true>) => {
        client.logger.log(`Ready! Logged in as ${client.user.tag}!`);

        // TODO: Figure out how to do this without causing a ratelimit
        for (const oauthGuild of (await client.guilds.fetch()).values()) {
            const guild = await client.guilds.fetch(oauthGuild.id);

            if (!guild) continue;

            for (const channel of (await guild.channels.fetch()).values()) {
                if (!channel.isTextBased()) continue;

                client.logger.debug(`Fetching pinned messages of "#${channel.name}" in "${guild.name}"...`);

                const pinnedMessage = await client.cacheManager.fetchChannelPin(channel);

                client.logger.debug(
                    `Found ${pinnedMessage.length} pinned message in "#${channel.name}" in "${guild.name}".`
                );
            }
        }
    }
});
