import {
    BitFieldResolvable,
    Client,
    ClientOptions,
    Collection,
    GatewayIntentBits,
    GatewayIntentsString,
    Partials
} from "discord.js";
import { MongoClient, Logger, Db } from "mongodb";
import { Command } from "./Command";
import { AllowedLogEvent, Event } from "./Event";
import chalk from "chalk";
import { CacheManager } from "./CacheManager";
import { Utility } from "./Utility";

const LOADABLE_EXTENSIONS = [".js", ".ts"];

export class BotClient<Ready extends boolean = boolean> extends Client<Ready> {
    mongoClient: MongoClient = new MongoClient(process.env.DATABASE_URL!, {
        monitorCommands: true
    });
    database: Db;

    commandList: Collection<string, Command> = new Collection();
    eventList: Collection<string, Event> = new Collection();

    cacheManager = new CacheManager();
    utility: Utility = new Utility(this);

    debug: boolean = false;

    constructor(
        options?: Omit<ClientOptions, "intents"> & {
            intents?: BitFieldResolvable<GatewayIntentsString, number>;
            debug: boolean;
        }
    ) {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildBans,
                GatewayIntentBits.GuildEmojisAndStickers,
                GatewayIntentBits.GuildIntegrations,
                GatewayIntentBits.GuildWebhooks,
                GatewayIntentBits.GuildInvites,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildPresences,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildMessageTyping,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildScheduledEvents
            ],
            partials: [
                Partials.User,
                Partials.Channel,
                Partials.GuildMember,
                Partials.Message,
                Partials.Reaction,
                Partials.GuildScheduledEvent,
                Partials.ThreadMember
            ],
            ...options
        });

        this.debug = options?.debug ?? false;

        Logger.setLevel(this.debug ? "debug" : "info");
        this.mongoClient.connect();

        this.database = this.mongoClient.db("furlogger");
    }

    loadCommandIn(directoryPath: string) {
        for (const file of this.utility.walkPath(directoryPath)) {
            if (!LOADABLE_EXTENSIONS.some((ext) => file.endsWith(ext))) continue;

            const commandInstance = require(file);
            if (!commandInstance.default) {
                this.logger.warn(`"${file}" doesn't have default export!`);
                continue;
            }

            this.commandList.set(commandInstance.default.name, commandInstance.default);

            this.logger.debug(`Loaded "${commandInstance.eventName}" command from "${file}"!`);
        }
    }

    loadEventIn(directoryPath: string) {
        for (const file of this.utility.walkPath(directoryPath)) {
            if (!LOADABLE_EXTENSIONS.some((ext) => file.endsWith(ext))) continue;

            const event = require(file);
            if (!event.default) {
                this.logger.warn(`"${file}" doesn't have default export!`);
                continue;
            }

            const eventInstance = event.default as Event;

            if (eventInstance.on) this.on(eventInstance.eventName, (...args) => eventInstance.on!(this, ...args));
            if (eventInstance.once) this.once(eventInstance.eventName, (...args) => eventInstance.once!(this, ...args));

            this.logger.debug(`Loaded "${eventInstance.eventName}" event from "${file}"!`);
        }
    }

    logger = {
        getPrefix: (): string => `${this.shard ? `[Shard ${this.shard.ids.join(", ")}] ` : ""}[FurLogger]`,

        log: (...data: any[]) => {
            console.log(`[${chalk.greenBright("LOG")}] ${this.logger.getPrefix()}`, ...data);
        },

        info: (...data: any[]) => {
            console.log(`[${chalk.greenBright("INFO")}] ${this.logger.getPrefix()}`, ...data);
        },

        error: (...data: any[]) => {
            console.error(`[${chalk.redBright("ERROR")}] ${this.logger.getPrefix()}`, ...data);
        },

        warn: (...data: any[]) => {
            console.warn(`[${chalk.yellowBright("WARN")}] ${this.logger.getPrefix()}`, ...data);
        },

        debug: (...data: any[]) => {
            if (!this.debug) return;
            console.debug(`[${chalk.blueBright("DEBUG")}] ${this.logger.getPrefix()}`, ...data);
        }
    };
}
