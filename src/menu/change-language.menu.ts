import { Markup } from "telegraf";
import I18n from "@edjopato/telegraf-i18n";
import { RegularMenu } from "@quino/telegraf-menu";
import { START_MENU_FILTERS } from "../const/start-menu.filters";
import { MenuAction } from "../interfaces/commands.models";
import { CurrentCtx, Language } from "../interfaces/context.models";
import { initWebcamMenu } from "./webcam.menu";
import { SETTINGS_MENU_FILTERS } from "../const/settings-menu.filters";
import { initStartMenu } from "./start.menu";
import { CHANGE_LANGUAGE_MENU_FILTERS } from "../const/change-language-menu.filters";

export const initChangeLanguageMenu = (ctx: CurrentCtx) => {
  new RegularMenu<CurrentCtx, MenuAction>({
    action: MenuAction.CHANGE_LANGUAGE,
    message: "menu.changeLanguage.start",
    filters: CHANGE_LANGUAGE_MENU_FILTERS,
    replaceable: true,
    menuGetter: (menuCtx) => menuCtx.session.keyboardMenu,
    menuSetter: (menuCtx, menu) => (menuCtx.session.keyboardMenu = menu),
    onChange(changeCtx, state) {
      if (state === MenuAction.MENU) {
        return initStartMenu(changeCtx);
      }
      if (state === MenuAction.SET_LANG_IT) {
        changeCtx.session.language = "it";
        changeCtx.i18n.locale("it");
      } else {
        changeCtx.session.language = "en";
        changeCtx.i18n.locale("en");
      } 
      return initStartMenu(changeCtx, null, "menu.changeLanguage.success");
    },
  }).sendMenu(ctx);
};
