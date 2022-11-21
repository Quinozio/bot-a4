import { MenuFilters, KeyboardButton } from "@quino/telegraf-menu";
import { MenuAction } from "../interfaces/commands.models";

export const PROFILAZIONE_MENU_FILTERS: MenuFilters<MenuAction>[] = [
  [
    new KeyboardButton(
      "menu.profilazione.button.leggero",
      MenuAction.PROFILAZIONE_LEGGERO
    ),
    new KeyboardButton(
      "menu.profilazione.button.pesante",
      MenuAction.PROFILAZIONE_PESANTE
    ),
  ],
];
