import { BotClient } from "../structures/BotClient";
import { TypedEvent } from "../structures/Event";

export default TypedEvent({
    eventName: "debug",
    on: (client: BotClient<true>, message: string) => {
        client.logger.debug(message);
    }
});
