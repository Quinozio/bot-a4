import { Markup } from "telegraf";
import I18n from "@edjopato/telegraf-i18n";
import { RegularMenu } from "@quino/telegraf-menu";
import { START_MENU_FILTERS } from "../const/start-menu.filters";
import { MenuAction } from "../interfaces/commands.models";
import { CurrentCtx } from "../interfaces/context.models";
import { initWebcamMenu } from "./webcam.menu";
import { SETTINGS_MENU_FILTERS } from "../const/settings-menu.filters";
import { initStartMenu } from "./start.menu";
import { initChangeLanguageMenu } from "./change-language.menu";
import { initProfilazioneMenu } from "./profilazione.menu";
import { initNotificheMenu } from "./notifiche.menu";

export const initSettingsMenu = (ctx: CurrentCtx) => {
  new RegularMenu<CurrentCtx, MenuAction>({
    action: MenuAction.SETTINGS,
    message: "menu.settings.start",
    filters: SETTINGS_MENU_FILTERS,
    replaceable: true,
    menuGetter: (menuCtx) => menuCtx.session.keyboardMenu,
    menuSetter: (menuCtx, menu) => (menuCtx.session.keyboardMenu = menu),
    onChange(changeCtx, state) {
      switch (state) {
        case MenuAction.CHANGE_LANGUAGE:
          return initChangeLanguageMenu(changeCtx);
        case MenuAction.START_PROFILAZIONE:
          return initProfilazioneMenu(changeCtx);
        case MenuAction.GESTIONE_NOTIFICHE:
          return initNotificheMenu(changeCtx);
        case MenuAction.MENU:
          return initStartMenu(changeCtx);
      }
    },
  }).sendMenu(ctx);
};
