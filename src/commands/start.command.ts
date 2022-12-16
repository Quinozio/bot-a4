import { CurrentCtx } from "../interfaces/context.models";
import { initProfilazioneMenu } from "../menu/profilazione.menu";
import { initStartMenu } from "../menu/start.menu";

export const startCommand = async (ctx: CurrentCtx) => {
  if (ctx?.session?.keyboardMenu?.messageId) {
    try {
      await ctx.deleteMessage(ctx.session.keyboardMenu.messageId);
    } catch (e) {}
  }

  let userId: string = ctx.message.chat.id;
  if (userId) {
    userId = userId.toString().replace(".0", "");
    console.log(userId);
  }
  global.database.get(
    `SELECT userId FROM user WHERE userId = ${userId}`,
    (err: string, row: any) => {
      console.log("ROW: ", row);
      if (!row) {
        global.database.run(
          `INSERT INTO user VALUES (${userId},${1})`,
          (err: string, row: any) => {
            console.log("AFTER INSERT: ", err, row);
            return initProfilazioneMenu(ctx as any, true);
          }
        );
      } else {
        return initStartMenu(ctx as any);
      }
    }
  );
};
