import { Guild, Snowflake } from "discord.js";
import { Collection } from "mongodb";
import { BotClient } from "./BotClient";
import { AllowedLogEvent, AllowedLogEventType } from "./Event";

export class ExtendedGuild {
    databaseCollection: Collection<any>;
    client: BotClient<true>;
    guild: Guild;

    constructor(client: BotClient<true>, guild: Guild) {
        this.client = client;
        this.guild = guild;
        this.databaseCollection = this.client.database.collection("Guild");
    }

    async getLogChannelId(): Promise<Snowflake | null> {
        return (
            (
                await this.databaseCollection.findOne({
                    guildId: this.guild.id
                })
            )?.logChannelId ?? null
        );
    }

    async setLogChannelId(channelId: Snowflake): Promise<void> {
        await this.databaseCollection.updateOne(
            {
                guildId: this.guild.id
            },
            {
                $set: {
                    logChannelId: channelId
                }
            },
            {
                upsert: true
            }
        );
    }

    async deleteLogChannelId(): Promise<void> {
        await this.databaseCollection.updateOne(
            {
                guildId: this.guild.id
            },
            {
                $unset: {
                    logChannelId: ""
                }
            }
        );
    }

    async isEventEnabled(event: AllowedLogEventType): Promise<boolean> {
        if (!AllowedLogEvent.includes(event)) return false;

        return (
            (
                await this.databaseCollection.findOne({
                    guildId: this.guild.id
                })
            )?.logConfig?.[event]?.enabled ?? false
        );
    }

    async toggleEvent(event: AllowedLogEventType): Promise<void> {
        if (!AllowedLogEvent.includes(event)) return;

        const logConfig =
            (
                await this.databaseCollection.findOne({
                    guildId: this.guild.id
                })
            )?.logConfig ?? {};

        logConfig[event] = {
            enabled: !logConfig[event]?.enabled
        };

        await this.databaseCollection.updateOne(
            {
                guildId: this.guild.id
            },
            {
                $set: {
                    logConfig
                }
            },
            {
                upsert: true
            }
        );
    }

    async getTemplateString(event: AllowedLogEventType): Promise<string> {
        return (
            (
                await this.databaseCollection.findOne({
                    guildId: this.guild.id
                })
            )?.logConfig?.[event]?.template ?? ""
        );
    }

    async setTemplateString(event: AllowedLogEventType, template: string): Promise<void> {
        const logConfig =
            (
                await this.databaseCollection.findOne({
                    guildId: this.guild.id
                })
            )?.logConfig ?? {};

        logConfig[event] = {
            enabled: logConfig[event]?.enabled ?? false,
            template
        };

        await this.databaseCollection.updateOne(
            {
                guildId: this.guild.id
            },
            {
                $set: {
                    logConfig
                }
            },
            {
                upsert: true
            }
        );
    }

    async deleteTemplateString(event: AllowedLogEventType): Promise<void> {
        const logConfig =
            (
                await this.databaseCollection.findOne({
                    guildId: this.guild.id
                })
            )?.logConfig ?? {};

        delete logConfig[event]?.template;

        await this.databaseCollection.updateOne(
            {
                guildId: this.guild.id
            },
            {
                $set: {
                    logConfig
                }
            }
        );
    }
}
