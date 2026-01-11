// @ts-check
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "help",
    aliases: ["menu", "commands", "cmds"],
    version: "5.0",
    author: "Christus",
    shortDescription: "📜 Premium command menu",
    longDescription: "Displays a modern, clean and categorized list of all bot commands.",
    category: "system",
    guide: "{pn}help [command name]"
  },

  onStart: async function ({ message, args, prefix }) {
    const allCommands = global.GoatBot.commands;
    const categories = Object.create(null);

    /* ───── UI CONFIG ───── */
    const UI = {
      line: "━━━━━━━━━━━━━━━━━━",
      dot: "•",
      arrow: "➥",
      boxOpen: "╭───◈",
      boxClose: "╰────────────◈",
      header: "☠️ 𝗡𝗘𝗢𝗞𝗘𝗫 𝗔𝗜 𝗠𝗘𝗡𝗨 ☠️"
    };

    /* ───── CATEGORY ICONS ───── */
    const emojiMap = {
      ai: "🤖",
      "ai-image": "🎨",
      system: "⚙️",
      tools: "🛠️",
      utility: "🧩",
      fun: "🎉",
      game: "🎮",
      economy: "💰",
      media: "🎥",
      image: "🖼️",
      group: "👥",
      admin: "🛡️",
      owner: "👑",
      config: "🔧",
      info: "ℹ️",
      rank: "🏆",
      boxchat: "📦",
      "18+": "🔞",
      others: "📁"
    };

    /* ───── UTILS ───── */
    const cleanCategory = (text) =>
      text
        ? text
            .normalize("NFKD")
            .replace(/[^\w\s-]/g, "")
            .trim()
            .toLowerCase()
        : "others";

    const getDesc = (cmd) =>
      typeof cmd.config.longDescription === "string"
        ? cmd.config.longDescription
        : cmd.config.longDescription?.en ||
          cmd.config.shortDescription?.en ||
          cmd.config.shortDescription ||
          "No description.";

    /* ───── BUILD CATEGORIES ───── */
    for (const [, cmd] of allCommands) {
      const cat = cleanCategory(cmd.config.category);
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(cmd.config.name);
    }

    /* ───── COMMAND DETAIL VIEW ───── */
    if (args[0]) {
      const query = args[0].toLowerCase();
      const cmd =
        allCommands.get(query) ||
        [...allCommands.values()].find((c) =>
          (c.config.aliases || []).includes(query)
        );

      if (!cmd)
        return message.reply(`❌ Command **"${query}"** not found.`);

      const {
        name,
        version,
        author,
        guide,
        category,
        aliases,
        role
      } = cmd.config;

      const usage =
        typeof guide === "string"
          ? guide.replace(/{pn}/g, prefix)
          : `${prefix}${name}`;

      return message.reply(
        `${UI.line}\n` +
        `☠️ 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗜𝗡𝗙𝗢 ☠️\n` +
        `${UI.line}\n\n` +
        `${UI.arrow} Name: ${name}\n` +
        `${UI.arrow} Category: ${category || "others"}\n` +
        `${UI.arrow} Description: ${getDesc(cmd)}\n` +
        `${UI.arrow} Aliases: ${aliases?.length ? aliases.join(", ") : "None"}\n` +
        `${UI.arrow} Usage: ${usage}\n` +
        `${UI.arrow} Permission Level: ${role ?? 0}\n` +
        `${UI.arrow} Author: ${author}\n` +
        `${UI.arrow} Version: ${version}\n\n` +
        `${UI.line}`
      );
    }

    /* ───── MAIN MENU ───── */
    let msg = `${UI.header}\n${UI.line}\n`;
    const sortedCategories = Object.keys(categories).sort();

    for (const cat of sortedCategories) {
      const icon = emojiMap[cat] || emojiMap.others;
      const cmds = categories[cat].sort().map(c => `${UI.dot} ${c}`).join("  ");

      msg +=
        `\n${UI.boxOpen} ${icon} ${cat.toUpperCase()}\n` +
        `${cmds}\n` +
        `${UI.boxClose}\n`;
    }

    msg +=
      `\n📊 Total Commands: ${allCommands.size}\n` +
      `📁 Categories: ${sortedCategories.length}\n\n` +
      `➥ ${prefix}help <command> → Details\n` +
      `➥ ${prefix}callad → Contact admins\n` +
      `${UI.line}`;

    return message.reply(msg);
  }
};
