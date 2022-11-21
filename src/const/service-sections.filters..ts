import { KeyboardButton, MenuFilters } from "@quino/telegraf-menu";
import fetch from "node-fetch";

import { MenuAction } from "../interfaces/commands.models";
import { CurrentCtx } from "../interfaces/context.models";
import { IServiceItem } from "../interfaces/service.models";

export const SERVICES_SECTION_FILTERS: (
  ctx: CurrentCtx
) => Promise<MenuFilters<MenuAction>[]> = async (ctx) => {
  ctx.session.services = [];
  const res = await fetch(`${process.env.API_URL}/o/map-rest/rest-areas/A4AAA`);
  const json: IServiceItem[] = await res.json();
  ctx.session.services = [...json];
  return [
    [
      new KeyboardButton("menu.services.button.aree", MenuAction.SERVICES_AREE),
      new KeyboardButton(
        "menu.services.button.ricarica",
        MenuAction.SERVICES_RICARICA
      ),
    ],
    [
      new KeyboardButton(
        "menu.services.button.metano",
        MenuAction.SERVICES_METANO
      ),
      new KeyboardButton(
        "menu.services.button.camper",
        MenuAction.SERVICES_CAMPER
      ),
    ],
    [new KeyboardButton("menu.menu", MenuAction.MENU)],
  ];
};
