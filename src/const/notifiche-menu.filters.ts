import { KeyboardButton, MenuFilters } from "@quino/telegraf-menu";

import { MenuAction } from "../interfaces/commands.models";

export const NOTIFICHE_MENU_FILTERS: MenuFilters<MenuAction>[] = [
  [
    new KeyboardButton(
      "menu.notifiche.button.attiva",
      MenuAction.ATTIVA_NOTIFICHE
    ),
    new KeyboardButton(
      "menu.notifiche.button.silenzia",
      MenuAction.SILENZIA_NOTIFICHE
    ),
  ],
  [new KeyboardButton("menu.back", MenuAction.BACK)],
  [new KeyboardButton("menu.menu", MenuAction.MENU)],
];
