import { MenuFilters, KeyboardButton } from "@quino/telegraf-menu";
import fetch from "node-fetch";
import { MenuAction } from "../interfaces/commands.models";
import { CurrentCtx } from "../interfaces/context.models";
import { IWebcam } from "../interfaces/webcam.models";

export const WEBCAM_MENU_FILTERS: (
  ctx: CurrentCtx
) => Promise<MenuFilters<MenuAction>[]> = async (ctx) => {
  const direction = ctx.session.webcamDirectionSelected;
  const res = await fetch(
    `${process.env.API_URL}/o/map-rest/webcam/${direction}`
  );
  const json: IWebcam[] = await res.json();
  console.log(json);

  const listWebcamAttive = [
    "TVCIO221-Ovest",
    "TVCIO228-Ovest",
    "TVCIO244-Ovest",
    "TVCIE251-Est",
    "TVCIO259-Ovest",
    "TVCIO270-Ovest",
    "TVCIO276-Ovest",
    "TVCIO279-Ovest",
    "TVCIE291-Est",
    "TVCIE303-Est",
    "TVCIO316-Ovest",
    "TVCIE328-Est",
    "TVCIE336-Est",
    "TVCIO356-Ovest",
    "TVCIE363-Est",
    "TVCIN088-Sud",
    "TVCIS061-Sud",
    "TVCIN053-Nord",
  ];
  const webcams = json.filter((item) => listWebcamAttive.includes(item.id));
  const buttons = webcams.map(
    (item) => new KeyboardButton(item.id, item.url) as any
  );
  const rowSize = 2;
  const rows = [];
  for (let i = 0; i < buttons.length; i += rowSize) {
    const chunk = buttons.slice(i, i + rowSize);
    rows.push(chunk);
  }
  rows.push([new KeyboardButton("menu.back", MenuAction.BACK)]);
  rows.push([new KeyboardButton("menu.menu", MenuAction.MENU)]);
  return rows;
};
