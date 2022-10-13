import { MenuFilters, KeyboardButton } from "@quino/telegraf-menu";
import { MenuAction } from "../interfaces/commands.models";

export const TRAFFICO_DIRECTION_MENU_FILTERS: MenuFilters<MenuAction>[] = [
  [
    new KeyboardButton(
      "menu.trafficoDirection.button.ovest",
      MenuAction.INFO_TRAFFICO_OVEST
    ),
    new KeyboardButton(
      "menu.trafficoDirection.button.est",
      MenuAction.INFO_TRAFFICO_EST
    ),
  ],
  [new KeyboardButton("menu.menu", MenuAction.MENU)],
];
