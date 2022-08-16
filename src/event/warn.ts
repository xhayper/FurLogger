import { BotClient } from "../structure/BotClient";
import { TypedEvent } from "../structure/Event";

export default TypedEvent({
    eventName: "warn",
    on: (client: BotClient<true>, info: string) => {
        client.logger.warn("[DJS]", info);
    }
});
