import { MenuFilters, KeyboardButton } from "@quino/telegraf-menu";
import { MenuAction } from "../interfaces/commands.models";

export const WEBCAM_DIRECTION_MENU_FILTERS: MenuFilters<MenuAction>[] = [
  [
    new KeyboardButton("menu.webcamDirection.button.a4", MenuAction.WEBCAM_DIRECTION_A4),
    new KeyboardButton("menu.webcamDirection.button.a31", MenuAction.WEBCAM_DIRECTION_A31),
  ],
  [new KeyboardButton("menu.menu", MenuAction.MENU)],
];
