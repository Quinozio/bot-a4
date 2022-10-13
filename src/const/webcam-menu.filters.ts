import { MenuFilters, KeyboardButton } from "@quino/telegraf-menu";
import fetch from "node-fetch";
import { MenuAction } from "../interfaces/commands.models";

export const WEBCAM_MENU_FILTERS: () => Promise<
  MenuFilters<MenuAction>[]
> = async () => {
  const res = await fetch(
    "https://inviaggio.autobspd.it/o/map-rest/webcam/A4AAA"
  );
  const json: any[] = await res.json();
  const buttons = json
    .splice(0, 6)
    .map((item) => new KeyboardButton(item.name, item.url));
  const rowSize = 2;
  const rows = [];
  for (let i = 0; i < buttons.length; i += rowSize) {
    const chunk = buttons.slice(i, i + rowSize);
    rows.push(chunk);
  }
  rows.push([new KeyboardButton("menu.menu", MenuAction.MENU)]);
  return rows;
};
