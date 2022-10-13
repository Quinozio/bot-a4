import { readFileSync } from "fs";
import path from "path";
import { Markup, Scenes } from "telegraf";

import { CurrentCtx, ILocalDb } from "../interfaces/context.models";

export const adminScene = new Scenes.BaseScene<CurrentCtx>("adminScene");

adminScene.enter(async (ctx) => {
  const text = "Scrivi l'avviso che vuoi inviare a tutti gli utenti:";
  return await ctx.replyWithMarkdown(text);
});

adminScene.action("Si", async (ctx) => {
  const dbRaw = readFileSync(
    path.resolve(__dirname, "../../local.db.json"),
    "utf-8"
  );
  const db: ILocalDb = JSON.parse(dbRaw);
  const userIds = db.sessions.map((session) => session.id.split(":")[0]);
  userIds.forEach(async (userId) => {
    console.log(userId);
    ctx.telegram.sendMessage(userId, messageToSend);
    // ctx.telegram.pinChatMessage(userId, message.message_id);
  });
  await ctx.reply("Messaggio inviato!");
  return ctx.scene.leave();
});
adminScene.action("No", async (ctx) => {
  return ctx.scene.enter("adminScene");
});
adminScene.action("esci", async (ctx) => {
  return ctx.scene.leave();
});

let messageToSend = "";
adminScene.on("text", async (ctx) => {
  if (ctx?.message?.text) {
    messageToSend = ctx?.message?.text;
    return await ctx.reply(
      "Sei sicuro di voler inviare questo messaggio a tutti gli utenti?",
      Markup.inlineKeyboard([
        [
          Markup.button.callback("Si", "Si"),
          Markup.button.callback("No", "No"),
        ],
        [Markup.button.callback("Esci", "esci")],
      ])
    );
  }
});
adminScene.leave(async (ctx) => {});
