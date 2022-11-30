import { RegularMenu } from "@quino/telegraf-menu";

import { WEBCAM_MENU_FILTERS } from "../const/webcam-menu.filters";
import { MenuAction } from "../interfaces/commands.models";
import { CurrentCtx } from "../interfaces/context.models";
import { initStartMenu } from "./start.menu";
import { initWebcamDetailMenu } from "./webcam-detail.menu";
import { initWebcamDirectionMenu } from "./webcam-direction.menu";

export const initWebcamMenu = async (ctx: CurrentCtx) => {
  new RegularMenu<CurrentCtx, MenuAction>({
    action: MenuAction.WEBCAM,
    message: "menu.webcam.start",
    filters: await WEBCAM_MENU_FILTERS(ctx),
    replaceable: true,
    menuGetter: (menuCtx) => menuCtx.session.keyboardMenu,
    menuSetter: (menuCtx, menu) => (menuCtx.session.keyboardMenu = menu),
    onChange(changeCtx, state) {
      if (state === MenuAction.BACK) {
        return initWebcamDirectionMenu(changeCtx);
      } else if (state === MenuAction.MENU) {
        return initStartMenu(changeCtx);
      }
      console.log(state);
      return initWebcamDetailMenu(changeCtx, process.env.API_URL + state);
    },
  }).sendMenu(ctx);
};
