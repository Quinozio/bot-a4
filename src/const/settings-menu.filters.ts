import { MenuFilters, KeyboardButton } from "@quino/telegraf-menu";
import { MenuAction } from "../interfaces/commands.models";

export const SETTINGS_MENU_FILTERS: MenuFilters<MenuAction>[] = [
  [
    // new KeyboardButton(
    //   "menu.settings.button.changeLanguage",
    //   MenuAction.CHANGE_LANGUAGE
    // ),
    new KeyboardButton(
      "menu.settings.button.gestioneNotifiche",
      MenuAction.GESTIONE_NOTIFICHE
    ),
    new KeyboardButton(
      "menu.settings.button.sceltaMezzo",
      MenuAction.START_PROFILAZIONE
    ),
  ],
  [new KeyboardButton("menu.menu", MenuAction.MENU)],
];
