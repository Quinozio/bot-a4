import { RegularMenu } from "@quino/telegraf-menu";

import { SERVICES_SECTION_FILTERS } from "../const/service-sections.filters.";
import { MenuAction } from "../interfaces/commands.models";
import { CurrentCtx } from "../interfaces/context.models";
import { ServiceSectionEnum } from "../interfaces/service.models";
import { initServiceDetailMenu } from "./service-detail.menu";
import { initServicesMenu } from "./services.menu";
import { initStartMenu } from "./start.menu";

export const initServiceSectionsMenu = async (ctx: CurrentCtx) => {
  new RegularMenu<CurrentCtx, MenuAction>({
    action: MenuAction.SERVICES,
    message: "menu.services.start",
    filters: await SERVICES_SECTION_FILTERS(ctx),
    replaceable: true,
    menuGetter: (menuCtx) => menuCtx.session.keyboardMenu,
    menuSetter: (menuCtx, menu) => (menuCtx.session.keyboardMenu = menu),
    onChange(changeCtx, state) {
      if (state === MenuAction.MENU) {
        return initStartMenu(changeCtx);
      } else {
        if (state === MenuAction.SERVICES_AREE) {
          ctx.session.serviceSectionSelected = ServiceSectionEnum.AREE;
        } else if (state === MenuAction.SERVICES_CAMPER) {
          ctx.session.serviceSectionSelected = ServiceSectionEnum.CAMPER;
        } else if (state === MenuAction.SERVICES_METANO) {
          ctx.session.serviceSectionSelected = ServiceSectionEnum.METANO;
        } else if (state === MenuAction.SERVICES_RICARICA) {
          ctx.session.serviceSectionSelected = ServiceSectionEnum.RICARICA;
        }
        console.log(state);
        return initServicesMenu(changeCtx);
      }
    },
  }).sendMenu(ctx);
};
