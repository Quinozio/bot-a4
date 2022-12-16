import { RegularMenu } from "@quino/telegraf-menu";

import { getTrafficoEst, getTrafficoOvest } from "../api/traffico.api";
import { TRAFFICO_DIRECTION_MENU_FILTERS } from "../const/traffico-direction-menu.filters";
import { MenuAction } from "../interfaces/commands.models";
import { CurrentCtx } from "../interfaces/context.models";
import { IEvent } from "../interfaces/events.models";
import { formatEvents } from "../utils/traffico.formatter";
import { initStartMenu } from "./start.menu";

export const initTrafficoDirectionMenu = (ctx: CurrentCtx) => {
  new RegularMenu<CurrentCtx, MenuAction>({
    action: MenuAction.INFO_TRAFFICO,
    message: "menu.trafficoDirection.start",
    filters: TRAFFICO_DIRECTION_MENU_FILTERS,
    replaceable: true,
    menuGetter: (menuCtx) => menuCtx.session.keyboardMenu,
    menuSetter: (menuCtx, menu) => (menuCtx.session.keyboardMenu = menu),
    async onChange(changeCtx, state) {
      if (state === MenuAction.MENU) {
        return initStartMenu(changeCtx);
      } else {
        let events: IEvent[] | undefined;
        if (state === MenuAction.INFO_TRAFFICO_OVEST) {
          events = await getTrafficoOvest();
        } else {
          events = await getTrafficoEst();
        }
        // console.log(events);
        await ctx.reply("➖➖➖➖➖➖➖➖➖➖\n");
        const messages = formatEvents(ctx, events);
        messages?.forEach(async (message) => {
          await ctx.replyWithHTML(message);
        });
        await ctx.deleteMessage(changeCtx.session.keyboardMenu.messageId);
        await ctx.reply("➖➖➖➖➖➖➖➖➖➖\n");
        return initTrafficoDirectionMenu(changeCtx);
      }
    },
  }).sendMenu(ctx);
};
