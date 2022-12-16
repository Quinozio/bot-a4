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
  const listWebcamAttive = new Map()
    .set("TVCIO228-Ovest", "Brescia Est")
    .set("TVCIO244-Ovest", "Desenzano (BS)")
    .set("TVCIE251-Est", "Sirmione (BS)")
    .set("TVCIO259-Ovest", "Peschiera (VR)")
    .set("TVCIO270-Ovest", "Sommacampagna (VR)")
    .set("TVCIE291-Est", "Verona Est")
    .set("TVCIE303-Est", "San Bonifacio (VR)")
    .set("TVCIO316-Ovest", "Montebello-Montecchio (VI)")
    .set("TVCIE328-Est", "Vicenza Ovest")
    .set("TVCIE336-Est", "Vicenza Est");
  const webcams = json.filter((item) => listWebcamAttive.has(item.id));
  const buttons = webcams.map(
    (item) => new KeyboardButton(listWebcamAttive.get(item.id), item.url) as any
  );
  const rowSize = 2;
  const rows = [];
  for (let i = 0; i < buttons.length; i += rowSize) {
    const chunk = buttons.slice(i, i + rowSize);
    rows.push(chunk);
  }
  // rows.push([new KeyboardButton("menu.back", MenuAction.BACK)]);
  rows.push([new KeyboardButton("menu.menu", MenuAction.MENU)]);
  return rows;
};
