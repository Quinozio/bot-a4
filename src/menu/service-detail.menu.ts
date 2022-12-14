import { RegularMenu } from "@quino/telegraf-menu";

import { BACK_MENU_FILTERS } from "../const/back-menu.filters";
import { MenuAction } from "../interfaces/commands.models";
import { CurrentCtx } from "../interfaces/context.models";
import { initServicesMenu } from "./services.menu";
import { initStartMenu } from "./start.menu";

export const initServiceDetailMenu = async (
  ctx: CurrentCtx,
  source: string
) => {
  new RegularMenu<CurrentCtx, MenuAction>({
    action: MenuAction.SERVICE_DETAIL,
    message: "menu.serviceDetail.start",
    customMessage: { type: "image", content: { source } },
    filters: BACK_MENU_FILTERS,
    replaceable: true,
    menuGetter: (menuCtx) => menuCtx.session.keyboardMenu,
    menuSetter: (menuCtx, menu) => (menuCtx.session.keyboardMenu = menu),
    onChange: async (changeCtx, state) => {
      await ctx.deleteMessage(changeCtx.session.keyboardMenu.messageId);
      if (state === MenuAction.BACK) {
        return initServicesMenu(changeCtx);
      }
      if (state === MenuAction.MENU) {
        return initStartMenu(changeCtx);
      }
    },
  }).sendMenu(ctx);
};
