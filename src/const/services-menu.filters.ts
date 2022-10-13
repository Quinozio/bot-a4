import { MenuFilters, KeyboardButton } from "@quino/telegraf-menu";
import fetch from "node-fetch";
import { MenuAction } from "../interfaces/commands.models";
import { CurrentCtx } from "../interfaces/context.models";
import { IServiceItem } from "../interfaces/service.models";

export const SERVICES_MENU_FILTERS: (
  ctx: CurrentCtx
) => Promise<MenuFilters<MenuAction>[]> = async (ctx) => {
  ctx.session.services = [];
  const res = await fetch(
    "https://inviaggio.autobspd.it/o/map-rest/rest-areas/A4AAA"
  );
  const json: IServiceItem[] = await res.json();
  ctx.session.services = [...json];
  const buttons = json.map((item) => new KeyboardButton(item.name, item.name as MenuAction));
  const rowSize = 2;
  const rows = [];
  for (let i = 0; i < buttons.length; i += rowSize) {
    const chunk = buttons.slice(i, i + rowSize);
    rows.push(chunk);
  }
  rows.push([new KeyboardButton("menu.menu", MenuAction.MENU)]);
  return rows;
};
