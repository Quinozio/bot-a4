import { KeyboardButton, RegularMenu } from "@quino/telegraf-menu";
import { Markup } from "telegraf";
import { SERVICES_MENU_FILTERS } from "../const/services-menu.filters";

import { WEBCAM_MENU_FILTERS } from "../const/webcam-menu.filters";
import { MenuAction } from "../interfaces/commands.models";
import { CurrentCtx } from "../interfaces/context.models";
import { initServiceDetailMenu } from "./service-detail.menu";
import { initStartMenu } from "./start.menu";
import { initWebcamDetailMenu } from "./webcam-detail.menu";

export const initServicesMenu = async (ctx: CurrentCtx) => {
  new RegularMenu<CurrentCtx, MenuAction>({
    action: MenuAction.SERVICES,
    message: "menu.services.start",
    filters: await SERVICES_MENU_FILTERS(ctx),
    replaceable: true,
    menuGetter: (menuCtx) => menuCtx.session.keyboardMenu,
    menuSetter: (menuCtx, menu) => (menuCtx.session.keyboardMenu = menu),
    onChange(changeCtx, state) {
      if (state === MenuAction.MENU) {
        return initStartMenu(changeCtx);
      } else {
        if (ctx.session.services) {
          const service = ctx.session.services.find(
            (service) => service.name === state
          );
          if (service) {
            ctx.session.services = undefined;
            ctx.session.serviceSelected = service;
            return initServiceDetailMenu(ctx);
          }
        }
      }
    },
  }).sendMenu(ctx);
};
