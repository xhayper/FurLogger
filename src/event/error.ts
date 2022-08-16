import { BotClient } from "../structure/BotClient";
import { TypedEvent } from "../structure/Event";

export default TypedEvent({
    eventName: "error",
    once: (client: BotClient<true>, error: Error) => {
        client.logger.error("[DJS]", error);
    }
});
