import { Markup, Scenes } from "telegraf";
import { Message } from "telegraf/typings/core/types/typegram";

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
      if (messageToSend) {
        if ("text" in messageToSend) {
          await ctx.telegram.sendMessage(row.userId, messageToSend, {
            parse_mode: "HTML",
          });
        }
        if ("photo" in messageToSend) {
          await ctx.telegram.sendPhoto(
            row.userId,
            messageToSend.photo[0].file_id,
            { caption: messageToSend.caption }
          );
        }
        if ("video" in messageToSend) {
          await ctx.telegram.sendVideo(
            row.userId,
            messageToSend.video.file_id,
            { caption: messageToSend.caption }
          );
        }
      }

      // ctx.telegram.unpinAllChatMessages(message.chat.id);
      // ctx.telegram.pinChatMessage(row.userId, message.message_id);
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

let messageToSend: Message | undefined = undefined;
adminScene.on(["photo", "video", "text"], async (ctx) => {
  console.log(ctx?.message);
  if (ctx.message) {
    messageToSend = ctx?.message;
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
