import { MenuFilters, KeyboardButton } from "@quino/telegraf-menu";
import { MenuAction } from "../interfaces/commands.models";

export const CHANGE_LANGUAGE_MENU_FILTERS: MenuFilters<MenuAction>[] = [
  [new KeyboardButton("menu.changeLanguage.button.it", MenuAction.SET_LANG_IT)],
  [new KeyboardButton("menu.changeLanguage.button.en", MenuAction.SET_LANG_EN)],
  [new KeyboardButton("menu.start.button.settings", MenuAction.SETTINGS)],
];
