import { Guild, GuildAuditLogsEntry, GuildAuditLogsResolvable, PermissionFlagsBits } from "discord.js";
import fs, { PathLike } from "node:fs";
import path from "node:path";
import { BotClient } from "./BotClient";

export class Utility {
    client: BotClient;

    constructor(client: BotClient) {
        this.client = client;
    }

    async fetchSingleAuditEntry<T extends GuildAuditLogsResolvable>(
        guild: Guild,
        type: T
    ): Promise<GuildAuditLogsEntry<T> | undefined> {
        if (!(await guild.members.fetchMe({ cache: true })).permissions.has(PermissionFlagsBits.ViewAuditLog)) return;

        return (
            await guild.fetchAuditLogs({
                type,
                limit: 1
            })
        ).entries.first();
    }

    walkPath(
        directoryPath: PathLike,
        options?:
            | {
                  encoding: BufferEncoding | null;
                  withFileTypes?: false | undefined;
              }
            | BufferEncoding
            | null
    ): string[] {
        const pathList = [];

        const files = fs.readdirSync(directoryPath, options);
        for (const file of files) {
            const fullPath = path.resolve(directoryPath.toString(), file);

            if (fs.statSync(fullPath).isDirectory()) {
                this.walkPath(fullPath, options);
            } else {
                pathList.push(fullPath);
            }
        }

        return pathList;
    }
}
