const config = {
  // Your discord user id
  // owner: access to source code of bot etc...
  ownerID: process.env.ownerID,
  // this can be both array or a single user id of your bot admins users
  // bot admins: reload bot commands, restart bot so forth...
  admins: process.env.ownerID,
  // this can be both array or a single user id of your bot support users
  // bot support: people who knows how your bot works and do simple fix
  support: process.env.ownerID,
  // prefix is what the keyword to execute your bot commands
  // most people uses "!" , or ".". You can select what you want!
  prefix: "!",
  // if we should show command denied message for
  // Being required to be a bot support or higher to use the command
  // *Recommend: true, so we can give the "imagination" those command don't exist
  // *Hides commands that regular users to don't see and they don't have access to
  hideDeniedBotAdminCommandsUsage: false,

  // ?optional: These two are optional variable and purely for sample setup
  // defines the mod role and admin role names for permissions.
  // You can also use .env and set these roles there,
  modRole: "Mod",
  adminRole: "Admin",

  // !PERMISSION LEVEL DEFINITIONS.
  // Level 1,2, 6,7 are undefined
  permissions: [
    // Default User and for all Direct Message Users
    // (excluding bot support, admin, owner)
    {
      level: 0,
      name: "User",
      check: () => true,
    },
    // Level 1, 2, can be defined to tailored to your needs for servers

    // Level: 3
    // This is the server mod role, based off role based modRole variable.
    {
      level: 3,
      name: "Moderator",
      check: (author, channel, guild, guildMember) => {
        try {
          const modRole = guild.roles.cache.find(
            (r) => r.name.toLowerCase() === config.modRole.toLowerCase()
          );
          if (modRole && guildMember._roles.has(modRole.id)) return true;
        } catch (e) {
          return false;
        }
      },
    },
    // Level: 4
    // This is the server admin role, based off role based adminRole variable.
    {
      level: 4,
      name: "Administrator",
      check: (author, channel, guild, guildMember) => {
        try {
          const adminRole = guild.roles.cache.find(
            (r) => r.name.toLowerCase() === config.adminRole.toLowerCase()
          );
          return adminRole && guildMember._roles.has(adminRole.id);
        } catch (e) {
          return false;
        }
      },
    },
    // Level: 5
    // This is the server owner where channel is called.
    {
      level: 5,
      name: "Server Owner",
      check: (author, channel, guild, guildMember, ChannelType) => {
        channel.type === ChannelType.GuildText
          ? guild.ownerId === author.id
            ? true
            : false
          : false;
      },
    },
    // Level 6, 7, can be defined to tailored to your needs

    // Level: 8
    // This is the bot support, predefined in the support array variable above
    {
      level: 8,
      name: "Bot Support",
      check: (author) => {
        if (!config.support) {
          if (config.ownerID === author.id) {
            return true;
          } else {
            return false;
          }
        }

        return config.support.includes(author.id);
      },
    },

    // Level: 9
    // This is the Bot Admin
    // Some limited access like rebooting the bot or reloading commands.
    {
      level: 9,
      name: "Bot Admin",
      check: (author) => {
        if (!config.admins) {
          if (config.ownerID === author.id) {
            return true;
          } else {
            return false;
          }
        }

        return config.admins.includes(author.id);
      },
    },

    // Level: 10
    // This is the Bot Owner, you should use your user id and set it to yourself
    // Highest Permissions because of dangerous commands such as eval
    // You can also use this to fun commands that only you can use
    {
      level: 10,
      name: "Bot Owner",
      // A simple check, compares the message author id to the one stored in the config file.
      check: (author) => {
        return config.ownerID === author.id;
      },
    },
  ],
};

module.exports = config;
