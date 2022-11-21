import { KeyboardButton, MenuFilters } from "@quino/telegraf-menu";

import { MenuAction } from "../interfaces/commands.models";
import { CurrentCtx } from "../interfaces/context.models";
import {
  serviceBySection,
  ServiceSectionEnum,
} from "../interfaces/service.models";

export const SERVICES_MENU_FILTERS: (
  ctx: CurrentCtx
) => MenuFilters<MenuAction>[] = (ctx) => {
  if (ctx.session.serviceSectionSelected != null && ctx.session.services) {
    const servicesBySection = ctx.session.services?.filter((service) =>
      service.services.some((service) => {
        const filters =
          serviceBySection[
            ctx.session.serviceSectionSelected as ServiceSectionEnum
          ];

        if (filters[0] === "all") {
          return true;
        }
        return serviceBySection[
          ctx.session.serviceSectionSelected as ServiceSectionEnum
        ].includes(service.id);
      })
    );
    const buttons = servicesBySection.map(
      (item) => new KeyboardButton(item.name, item.name as MenuAction)
    );
    const rowSize = 2;
    const rows = [];
    for (let i = 0; i < buttons.length; i += rowSize) {
      const chunk = buttons.slice(i, i + rowSize);
      rows.push(chunk);
    }
    rows.push([new KeyboardButton("menu.back", MenuAction.BACK)]);
    rows.push([new KeyboardButton("menu.menu", MenuAction.MENU)]);
    return rows;
  } else {
    return [
      [new KeyboardButton("menu.back", MenuAction.BACK)],
      [new KeyboardButton("menu.menu", MenuAction.MENU)],
    ];
  }
};
