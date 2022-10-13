import { KeyboardButton, MenuFilters } from "@quino/telegraf-menu";

import { MenuAction } from "../interfaces/commands.models";
import { CurrentCtx } from "../interfaces/context.models";

export const SERVICE_DETAIL_MENU_FILTERS: (
  ctx: CurrentCtx
) => MenuFilters<MenuAction>[] = (ctx) => {
  const serviceDetail = ctx.session.serviceSelected;
  const rowSize = 3;
  const buttons = serviceDetail.services.map(
    (service) => new KeyboardButton(service.id, "" as MenuAction)
  );
  const rows = [];
  for (let i = 0; i < buttons.length; i += rowSize) {
    const chunk = buttons.slice(i, i + rowSize);
    rows.push(chunk);
  }
  rows.push([new KeyboardButton("menu.menu", MenuAction.MENU)]);
  rows.push([new KeyboardButton("menu.back", MenuAction.BACK)]);
  return rows;
};
