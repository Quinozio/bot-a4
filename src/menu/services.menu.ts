import { RegularMenu } from "@quino/telegraf-menu";
import joinImages from "join-images";
import fetch from "node-fetch";

import { SERVICES_MENU_FILTERS } from "../const/services-menu.filters";
import { MenuAction } from "../interfaces/commands.models";
import { CurrentCtx } from "../interfaces/context.models";
import { initServiceDetailMenu } from "./service-detail.menu";
import { initServiceSectionsMenu } from "./service-sections.menu";
import { initStartMenu } from "./start.menu";

export const initServicesMenu = async (ctx: CurrentCtx) => {
  new RegularMenu<CurrentCtx, MenuAction>({
    action: MenuAction.SERVICES,
    message: "menu.services.start",
    filters: await SERVICES_MENU_FILTERS(ctx),
    replaceable: true,
    menuGetter: (menuCtx) => menuCtx.session.keyboardMenu,
    menuSetter: (menuCtx, menu) => (menuCtx.session.keyboardMenu = menu),
    onChange: async (changeCtx, state) => {
      if (state === MenuAction.MENU) {
        return initStartMenu(changeCtx);
      } else if (state === MenuAction.BACK) {
        return initServiceSectionsMenu(changeCtx);
      } else {
        if (ctx.session.services) {
          const service = ctx.session.services.find(
            (service) => service.name === state
          );
          if (service) {
            ctx.session.serviceSelected = service;

            const images = await Promise.all(
              service.services.map(async (s) => {
                const image = await fetch(
                  `https://inviaggio.autobspd.it${s.url}`
                );
                return await image.buffer();
              })
            );
            const rowSize = 5;
            const rows = [];
            for (let i = 0; i < images.length; i += rowSize) {
              const chunk = images.slice(i, i + rowSize);
              const img = await joinImages(chunk, {
                direction: "horizontal",
                margin: { top: 10, right: 10, left: 10 },
                align: "start",
                offset: 10,
                color: "#fff",
              });
              // Save image as file
              const imgBuffer = await img.png().toBuffer();
              rows.push(imgBuffer);
            }
            const image = await joinImages(rows, {
              direction: "vertical",
              color: "#fff",
              margin: 10,
              align: "start",
              offset: 10,
            });
            await image.toFile("services.png");
            return initServiceDetailMenu(ctx, "services.png");
          }
        }
      }
    },
  }).sendMenu(ctx);
};
