import { ChatInputCommandInteraction, PermissionResolvable, SlashCommandBuilder } from "discord.js";
import { BotClient } from "./BotClient";

export interface Command {
    name: string;
    builder: SlashCommandBuilder;
    permission?: PermissionResolvable[];
    execute(client: BotClient<true>, interaction: ChatInputCommandInteraction): void;
}
