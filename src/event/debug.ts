import { BotClient } from "../structure/BotClient";
import { TypedEvent } from "../structure/Event";

export default TypedEvent({
    eventName: "debug",
    on: (client: BotClient<true>, message: string) => {
        client.logger.debug("[DJS]", message);
    }
});
