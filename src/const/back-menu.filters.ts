import { MenuFilters, KeyboardButton } from "@quino/telegraf-menu";
import { MenuAction } from "../interfaces/commands.models";

export const BACK_MENU_FILTERS: MenuFilters<MenuAction>[] = [
  [new KeyboardButton("menu.back", MenuAction.BACK)],
  [new KeyboardButton("menu.menu", MenuAction.MENU)],
];
