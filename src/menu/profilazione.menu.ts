import { RegularMenu } from "@quino/telegraf-menu";

import { PROFILAZIONE_MENU_FILTERS } from "../const/profilazione-menu.filters";
import { MenuAction } from "../interfaces/commands.models";
import { CurrentCtx } from "../interfaces/context.models";
import { initStartMenu } from "./start.menu";

export const initProfilazioneMenu = (ctx: CurrentCtx, fn?: any) => {
  new RegularMenu<CurrentCtx, MenuAction>({
    action: MenuAction.MENU,
    message: "menu.profilazione.start",
    filters: PROFILAZIONE_MENU_FILTERS,
    replaceable: true,
    menuGetter: (menuCtx) => menuCtx.session.keyboardMenu,
    menuSetter: (menuCtx, menu) => (menuCtx.session.keyboardMenu = menu),
    onChange(changeCtx, state) {
      return initStartMenu(ctx);
    },
  }).sendMenu(ctx);
};
