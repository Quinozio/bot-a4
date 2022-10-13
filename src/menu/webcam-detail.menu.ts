import { RegularMenu } from "@quino/telegraf-menu";
import { BACK_MENU_FILTERS } from "../const/back-menu.filters";

import { WEBCAM_MENU_FILTERS } from "../const/webcam-menu.filters";
import { MenuAction } from "../interfaces/commands.models";
import { CurrentCtx } from "../interfaces/context.models";
import { initStartMenu } from "./start.menu";
import { initWebcamMenu } from "./webcam.menu";

export const initWebcamDetailMenu = async (ctx: CurrentCtx, url: string) => {
  new RegularMenu<CurrentCtx, MenuAction>({
    action: MenuAction.WEBCAM_DETAIL,
    message: "",
    customMessage: { type: "image", content: url },
    filters: BACK_MENU_FILTERS,
    replaceable: true,
    menuGetter: (menuCtx) => menuCtx.session.keyboardMenu,
    menuSetter: (menuCtx, menu) => (menuCtx.session.keyboardMenu = menu),
    onChange(changeCtx, state) {
      if (state === MenuAction.BACK) {
        return initWebcamMenu(changeCtx);
      }
      if (state === MenuAction.MENU) {
        return initStartMenu(changeCtx);
      }
    },
  }).sendMenu(ctx);
};   
  