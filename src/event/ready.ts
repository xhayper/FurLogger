import { BotClient } from "../structure/BotClient";
import { TypedEvent } from "../structure/Event";

export default TypedEvent({
    eventName: "ready",
    once: (client: BotClient<true>) => {
        client.logger.log(`Ready! Logged in as ${client.user.tag}!`);
    }
});
