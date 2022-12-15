import { Markup } from "telegraf";
import I18n from "@edjopato/telegraf-i18n";
import { RegularMenu } from "@quino/telegraf-menu";
import { START_MENU_FILTERS } from "../const/start-menu.filters";
import { MenuAction } from "../interfaces/commands.models";
import { CurrentCtx } from "../interfaces/context.models";
import { initWebcamMenu } from "./webcam.menu";
import { initSettingsMenu } from "./settings.menu";
import { initServicesMenu } from "./services.menu";
import { initTrafficoDirectionMenu } from "./traffico-direction.menu";
import { initServiceSectionsMenu } from "./service-sections.menu";
import { initCantieriMenu } from "./cantieri.menu";
import { initWebcamDirectionMenu } from "./webcam-direction.menu";
import { initNotificheMenu } from "./notifiche.menu";

export const initStartMenu = (ctx: CurrentCtx, fn?: any, message?: string) => {
  new RegularMenu<CurrentCtx, MenuAction>({
    action: MenuAction.MENU,
    message: message ? message : "menu.start.start",
    filters: START_MENU_FILTERS,
    replaceable: true,
    menuGetter: (menuCtx) => menuCtx.session.keyboardMenu,
    menuSetter: (menuCtx, menu) => (menuCtx.session.keyboardMenu = menu),
    onChange(changeCtx, state) {
      switch (state) {
        case MenuAction.WEBCAM_DIRECTION:
          changeCtx.session.webcamDirectionSelected = "A4AAA";
          return initWebcamMenu(changeCtx);
        case MenuAction.SETTINGS:
          return initSettingsMenu(changeCtx);
        case MenuAction.SERVICES:
          return initServiceSectionsMenu(changeCtx);
        case MenuAction.CANTIERI_ALTA_VELOCITA:
          return initCantieriMenu(changeCtx);
        case MenuAction.INFO_TRAFFICO:
          return initTrafficoDirectionMenu(changeCtx);
        case MenuAction.GESTIONE_NOTIFICHE:
          return initNotificheMenu(changeCtx);
        case MenuAction.SOS:
          console.log(changeCtx.chat, ctx.chat);
          const message = ctx.i18n.t("sos.testo");
          ctx.replyWithMarkdownV2(message);
        // return initStartMenu(changeCtx);
      }
    },
  }).sendMenu(ctx);
};
