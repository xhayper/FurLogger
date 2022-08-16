import { BotClient } from "../structures/BotClient";
import { TypedEvent } from "../structures/Event";

export default TypedEvent({
    eventName: "ready",
    once: (client: BotClient<true>) => {
        client.logger.log(`Ready! Logged in as ${client.user.tag}!`);
    }
});
