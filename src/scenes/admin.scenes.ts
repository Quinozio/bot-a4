import { Markup, Scenes } from "telegraf";

import { CurrentCtx, User } from "../interfaces/context.models";

export const adminScene = new Scenes.BaseScene<CurrentCtx>("adminScene");

adminScene.enter(async (ctx) => {
  const text = "Scrivi l'avviso che vuoi inviare a tutti gli utenti:";
  return await ctx.replyWithMarkdownV2(text);
});

adminScene.action("Si", async (ctx) => {
  global.database.each(
    "SELECT userId FROM user WHERE notifiche = 1",
    async (err: string, row: User) => {
      const message = await ctx.telegram.sendMessage(row.userId, messageToSend);
      ctx.telegram.unpinAllChatMessages(message.chat.id);
      ctx.telegram.pinChatMessage(row.userId, message.message_id);
    }
  );
  await ctx.reply("Messaggio inviato!");
  return ctx.scene.leave();
});
adminScene.action("No", async (ctx) => {
  return ctx.scene.enter("adminScene");
});
adminScene.action("esci", async (ctx) => {
  if (ctx.chat?.id) {
    ctx.telegram.sendMessage(
      ctx.chat.id,
      "Utilizza il comando /menu per ricominciare."
    );
  }
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
