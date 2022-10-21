import { RegularMenu } from "@quino/telegraf-menu";
import { BACK_MENU_FILTERS } from "../const/back-menu.filters";
import { SERVICE_DETAIL_MENU_FILTERS } from "../const/service-detail-menu.filters";

import { WEBCAM_MENU_FILTERS } from "../const/webcam-menu.filters";
import { MenuAction } from "../interfaces/commands.models";
import { CurrentCtx } from "../interfaces/context.models";
import { initServicesMenu } from "./services.menu";
import { initStartMenu } from "./start.menu";
import { initWebcamMenu } from "./webcam.menu";

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
    onChange(changeCtx, state) {
      if (state === MenuAction.BACK) {
        return initServicesMenu(changeCtx);
      }
      if (state === MenuAction.MENU) {
        return initStartMenu(changeCtx);
      }
    },
  }).sendMenu(ctx);
};
