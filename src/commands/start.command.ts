import { CurrentCtx } from "../interfaces/context.models";
import { initProfilazioneMenu } from "../menu/profilazione.menu";
import { initStartMenu } from "../menu/start.menu";

export const startCommand = async (ctx: CurrentCtx) => {
  console.log(ctx.message.chat.id);
  const userId = ctx.message.chat.id;
  global.database.get(
    "SELECT userId FROM user WHERE userId = $userId",
    {
      $userId: userId.toString(),
    },
    (err: string, row: any) => {
      console.log("ROW: ", row);
      if (!row) {
        global.database.run(
          "INSERT INTO user VALUES (?,?)",
          [userId, true],
          (err: string, row: any) => {
            return initProfilazioneMenu(ctx as any, true);
          }
        );
      } else {
        return initStartMenu(ctx as any);
      }
    }
  );
};
