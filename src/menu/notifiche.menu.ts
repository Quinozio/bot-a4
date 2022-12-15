import { RegularMenu } from "@quino/telegraf-menu";

import { NOTIFICHE_MENU_FILTERS } from "../const/notifiche-menu.filters";
import { MenuAction } from "../interfaces/commands.models";
import { CurrentCtx } from "../interfaces/context.models";
import { initSettingsMenu } from "./settings.menu";
import { initStartMenu } from "./start.menu";

export const attivaNotifiche = async (userId: string, ctx: CurrentCtx) => {
  global.database.run(
    `UPDATE user SET notifiche = 1 WHERE userId = ${userId}`,
    async (err: string, row: any) => {
      if (ctx.session.keyboardMenu.messageId) {
        try {
          await ctx.deleteMessage(ctx.session.keyboardMenu.messageId);
        } catch (e) {}
      }

      await ctx.reply("Notifiche attivate.");
      return initStartMenu(ctx);
    }
  );
};
export const silenziaNotifiche = async (userId: string, ctx: CurrentCtx) => {
  global.database.run(
    `UPDATE user SET notifiche = 0 WHERE userId = ${userId}`,
    async (err: string, row: any) => {
      if (ctx.session.keyboardMenu.messageId) {
        try {
          await ctx.deleteMessage(ctx.session.keyboardMenu.messageId);
        } catch (e) {}
      }
      await ctx.reply("Notifiche silenziate.");
      return initStartMenu(ctx);
    }
  );
};
export const initNotificheMenu = (ctx: CurrentCtx) => {
  new RegularMenu<CurrentCtx, MenuAction>({
    action: MenuAction.GESTIONE_NOTIFICHE,
    message: "menu.notifiche.start",
    filters: NOTIFICHE_MENU_FILTERS,
    replaceable: true,
    menuGetter: (menuCtx) => menuCtx.session.keyboardMenu,
    menuSetter: (menuCtx, menu) => (menuCtx.session.keyboardMenu = menu),
    onChange(changeCtx, state) {
      let userId: string = changeCtx.chat.id;
      if (userId) {
        userId = userId.toString().replace(".0", "");
        console.log(userId);
      }
      if (state === MenuAction.ATTIVA_NOTIFICHE) {
        return attivaNotifiche(userId, changeCtx);
      }
      if (state === MenuAction.SILENZIA_NOTIFICHE) {
        global.database.run(
          `UPDATE user SET notifiche = 0 WHERE userId = ${userId}`,
          (err: string, row: any) => {
            return silenziaNotifiche(userId, changeCtx);
          }
        );
      }
      if (state === MenuAction.BACK) {
        return initSettingsMenu(changeCtx);
      }
      if (state === MenuAction.MENU) {
        return initStartMenu(changeCtx);
      }
    },
  }).sendMenu(ctx);
};
