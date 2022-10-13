import { Markup } from "telegraf";
import I18n from "telegraf-i18n";
import { RegularMenu } from "@quino/telegraf-menu";
import { START_MENU_FILTERS } from "../const/start-menu.filters";
import { MenuAction } from "../interfaces/commands.models";
import { CurrentCtx } from "../interfaces/context.models";
import { initWebcamMenu } from "./webcam.menu";
import { initSettingsMenu } from "./settings.menu";
import { initServicesMenu } from "./services.menu";
import { TRAFFICO_DIRECTION_MENU_FILTERS } from "../const/traffico-direction-menu.filters";
import { initStartMenu } from "./start.menu";
import fetch from "node-fetch";
import {
  DirectionTo,
  IEvent,
  IEventsOnStreet,
} from "../interfaces/events.models";

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
        console.log(events);
        await ctx.reply("➖➖➖➖➖➖➖➖➖➖\n");
        events?.forEach(async (event) => {
          const description = event.DESCRIZIONE.replaceAll("<br>", "\n");
          await ctx.replyWithHTML(description);
        });
        await ctx.deleteMessage(changeCtx.session.keyboardMenu.messageId);
        await ctx.reply("➖➖➖➖➖➖➖➖➖➖\n");
        return initTrafficoDirectionMenu(changeCtx);
      }
    },
  }).sendMenu(ctx);
};

const getEventsOnStreet = async () => {
  const res = await fetch(
    "https://inviaggio.autobspd.it/o/map-rest/events-on-street/A4AAA"
  );
  return (await res.json()) as IEventsOnStreet;
};
const getEvents = async (direction: DirectionTo) => {
  const eventsOnStreet = await getEventsOnStreet();
  return eventsOnStreet.events.filter(
    (event) => event.DIR === direction && !event.ID_PADRE
  );
};
const getTrafficoOvest = async () => getEvents(DirectionTo.MILAN);
const getTrafficoEst = () => getEvents(DirectionTo.VENEZ);
