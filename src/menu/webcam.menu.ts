import { RegularMenu } from "@quino/telegraf-menu";

import { WEBCAM_MENU_FILTERS } from "../const/webcam-menu.filters";
import { MenuAction } from "../interfaces/commands.models";
import { CurrentCtx } from "../interfaces/context.models";
import { initStartMenu } from "./start.menu";
import { initWebcamDetailMenu } from "./webcam-detail.menu";

export const initWebcamMenu = async (ctx: CurrentCtx) => {
  new RegularMenu<CurrentCtx, MenuAction>({
    action: MenuAction.WEBCAM,
    message: "menu.webcam.start",
    filters: await WEBCAM_MENU_FILTERS(),
    replaceable: true,
    menuGetter: (menuCtx) => menuCtx.session.keyboardMenu,
    menuSetter: (menuCtx, menu) => (menuCtx.session.keyboardMenu = menu),
    onChange(changeCtx, state) {
      if (state === MenuAction.MENU) {
        return initStartMenu(changeCtx);
      }
      return initWebcamDetailMenu(
        changeCtx,
        "https://inviaggio.autobspd.it" + state
      );
    },
  }).sendMenu(ctx);
};
