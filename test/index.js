const { Client, GatewayIntentBits, Partials } = require("discord.js");
const DiscordFeaturesHandler = require("../src");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel, Partials.Channel, Partials.Reaction],
});

DiscordFeaturesHandler(client, {
  // file path to your script file
  mainDirectory: __dirname,
  // file path and filename of your configuration file
  config: "./config.js",
  // bot token that can be found in your discord dev portal
  BOT_TOKEN: "YOUR_BOT_TOKEN",
  loadCommandsLoggerOff: true,
  loadEventsLoggerOff: true,
  loadModulesLoggerOff: true,
  // optional:
  // files we want to excludes when handler is invoked
  // files must be in their respective folders to work
  // commands files in their sub folders
  // events and modules files in their folder
  filesToExcludeInHandlers: {
    commands: ["ping.js"],
  },
});
