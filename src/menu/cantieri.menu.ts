import { RegularMenu } from "@quino/telegraf-menu";

import { getTrafficoEst, getTrafficoOvest } from "../api/traffico.api";
import { TRAFFICO_DIRECTION_MENU_FILTERS } from "../const/traffico-direction-menu.filters";
import { MenuAction } from "../interfaces/commands.models";
import { CurrentCtx } from "../interfaces/context.models";
import { EventType, IEvent } from "../interfaces/events.models";
import { formatEvents } from "../utils/traffico.formatter";
import { initStartMenu } from "./start.menu";

export const initCantieriMenu = (ctx: CurrentCtx) => {
  new RegularMenu<CurrentCtx, MenuAction>({
    action: MenuAction.CANTIERI_ALTA_VELOCITA,
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
        events = events.filter(
          (event) =>
            event.TIPO === EventType.CANTIERE ||
            (event.TIPO === EventType.MESSAGGIO_PMV &&
              event.DETTAGLIO?.TIPOLOGIA === "CHIUSURA")
        );
        await ctx.reply("➖➖➖➖➖➖➖➖➖➖\n");
        const messages = formatEvents(ctx, events);
        messages?.forEach(async (message) => {
          await ctx.replyWithHTML(message);
        });
        await ctx.deleteMessage(changeCtx.session.keyboardMenu.messageId);
        await ctx.reply("➖➖➖➖➖➖➖➖➖➖\n");
        return initCantieriMenu(changeCtx);
      }
    },
  }).sendMenu(ctx);
};
