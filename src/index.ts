import "dotenv/config";

import { BotClient } from "./structure/BotClient";
import path from "node:path";

const client = new BotClient({
    debug: true
});

client.loadCommandIn(path.join(__dirname, "command"));
client.loadEventIn(path.join(__dirname, "event"));

client.login();
