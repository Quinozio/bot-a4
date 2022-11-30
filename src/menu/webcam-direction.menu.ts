import { RegularMenu } from "@quino/telegraf-menu";

import { WEBCAM_DIRECTION_MENU_FILTERS } from "../const/webcam-direction-menu.filters";
import { MenuAction } from "../interfaces/commands.models";
import { CurrentCtx } from "../interfaces/context.models";
import { initStartMenu } from "./start.menu";
import { initWebcamMenu } from "./webcam.menu";

export const initWebcamDirectionMenu = async (ctx: CurrentCtx) => {
  new RegularMenu<CurrentCtx, MenuAction>({
    action: MenuAction.WEBCAM_DIRECTION,
    message: "menu.webcam.start",
    filters: WEBCAM_DIRECTION_MENU_FILTERS,
    replaceable: true,
    menuGetter: (menuCtx) => menuCtx.session.keyboardMenu,
    menuSetter: (menuCtx, menu) => (menuCtx.session.keyboardMenu = menu),
    onChange(changeCtx, state) {
      console.log(state);
      if (state === MenuAction.MENU) {
        return initStartMenu(changeCtx);
      } else if (state === MenuAction.WEBCAM_DIRECTION_A31) {
        changeCtx.session.webcamDirectionSelected = "A31AA";
      } else if (state === MenuAction.WEBCAM_DIRECTION_A4) {
        changeCtx.session.webcamDirectionSelected = "A4AAA";
      }
      return initWebcamMenu(changeCtx);
    },
  }).sendMenu(ctx);
};
